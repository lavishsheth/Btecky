(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  /* ---- channel home page (needs a YouTube Data API key in config.js) ---- */
  (function initChannel() {
    var CFG = window.BTECKY_YT || {};
    if (!CFG.apiKey || !CFG.channelId || /PASTE|YOUR/i.test(CFG.apiKey)) return;   // no key yet: the simple video player above stays
    var cid = CFG.channelId, KEY = "btecky-yt-v1", TTL = (CFG.cacheHours || 6) * 3600 * 1000;
    var API = "https://www.googleapis.com/youtube/v3/";

    function api(path, params) {
      params.key = CFG.apiKey;
      return fetch(API + path + "?" + new URLSearchParams(params)).then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok) throw new Error((j.error && j.error.message) || String(r.status));
          return j;
        });
      });
    }
    function thumbOf(sn) {
      var t = sn && sn.thumbnails; if (!t) return "";
      var u = (t.medium || t.high || t.default || {}).url || "";
      return u.indexOf("https://") === 0 ? u : "";
    }
    function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

    function build() {
      var uploads = "UU" + cid.slice(2), popular = "UULP" + cid.slice(2);
      return Promise.all([
        api("channels", { part: "snippet,statistics,brandingSettings", id: cid }),
        api("channelSections", { part: "snippet,contentDetails", channelId: cid })
      ]).then(function (res) {
        var ch = res[0].items && res[0].items[0];
        if (!ch) throw new Error("channel not found");
        var secs = (res[1].items || []).slice().sort(function (a, b) { return (a.snippet.position || 0) - (b.snippet.position || 0); });
        var plan = [];
        secs.forEach(function (s) {
          var t = s.snippet.type, pl = (s.contentDetails && s.contentDetails.playlists) || [], title = s.snippet.title || "";
          if (t === "recentUploads") plan.push({ kind: "videos", title: title || "Latest videos", pid: uploads });
          else if (t === "popularUploads") plan.push({ kind: "videos", title: title || "Popular videos", pid: popular });
          else if (t === "singlePlaylist" && pl[0]) plan.push({ kind: "videos", title: title, pid: pl[0] });
          else if (t === "multiplePlaylists" && pl.length) plan.push({ kind: "lists", title: title || "Playlists", ids: pl });
          else if (t === "allPlaylists") plan.push({ kind: "lists", title: title || "Created playlists", all: true });
        });
        if (!plan.length) plan = [{ kind: "videos", title: "Latest videos", pid: uploads }, { kind: "lists", title: "Playlists", all: true }];

        var ids = [];
        plan.forEach(function (p) { if (p.kind === "videos") ids.push(p.pid); if (p.ids) ids = ids.concat(p.ids); });
        ids = uniq(ids).filter(function (id) { return id.indexOf("UU") !== 0; }).slice(0, 50);
        var needAll = plan.some(function (p) { return p.all; });
        var empty = { items: [] };
        return Promise.all([
          ids.length ? api("playlists", { part: "snippet,contentDetails", id: ids.join(","), maxResults: 50 }).catch(function () { return empty; }) : Promise.resolve(empty),
          needAll ? api("playlists", { part: "snippet,contentDetails", channelId: cid, maxResults: 50 }).catch(function () { return empty; }) : Promise.resolve(empty)
        ]).then(function (r2) {
          var meta = {};
          (r2[0].items || []).concat(r2[1].items || []).forEach(function (p) { meta[p.id] = p; });
          var jobs = plan.map(function (p) {
            if (p.kind === "lists") {
              var list = p.all ? (r2[1].items || []) : p.ids.map(function (id) { return meta[id]; }).filter(Boolean);
              return Promise.resolve({
                kind: "lists", title: p.title, viewAll: "https://www.youtube.com/channel/" + cid + "/playlists",
                items: list.map(function (x) { return { id: x.id, title: x.snippet.title, thumb: thumbOf(x.snippet), count: x.contentDetails && x.contentDetails.itemCount }; })
              });
            }
            return api("playlistItems", { part: "snippet,contentDetails", playlistId: p.pid, maxResults: 12 }).then(function (r) {
              var items = (r.items || []).map(function (it) {
                var sn = it.snippet || {};
                return { id: (it.contentDetails && it.contentDetails.videoId) || (sn.resourceId && sn.resourceId.videoId),
                  title: sn.title, thumb: thumbOf(sn), date: (it.contentDetails && it.contentDetails.videoPublishedAt) || sn.publishedAt };
              }).filter(function (v) { return v.id && v.thumb && !/^(Private|Deleted) video$/i.test(v.title || ""); });
              var title = p.title || (meta[p.pid] && meta[p.pid].snippet.title) || "Videos";
              return { kind: "videos", title: title, viewAll: "https://www.youtube.com/playlist?list=" + p.pid, items: items };
            }).catch(function () { return null; });
          });
          return Promise.all(jobs).then(function (sections) {
            sections = sections.filter(function (s) { return s && s.items.length; });
            if (!sections.length) throw new Error("nothing to show");
            var sn = ch.snippet, st = ch.statistics || {}, bi = ch.brandingSettings && ch.brandingSettings.image;
            return {
              channel: {
                title: sn.title, handle: sn.customUrl || "", avatar: thumbOf(sn), desc: sn.description || "",
                banner: bi && bi.bannerExternalUrl && bi.bannerExternalUrl.indexOf("https://") === 0 ? bi.bannerExternalUrl : "",
                subs: st.hiddenSubscriberCount ? null : (st.subscriberCount != null ? +st.subscriberCount : null),
                videos: st.videoCount != null ? +st.videoCount : null
              },
              sections: sections
            };
          });
        });
      });
    }

    var PLAY = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#e62117"/><path d="M26 20l20 12-20 12z" fill="#fff"/></svg>';
    var compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

    function card(it, isList) {
      var c = el("article", "yt-card");
      var b = el("button", "yt-thumb"); b.type = "button";
      b.setAttribute("aria-label", (isList ? "Play playlist: " : "Play video: ") + it.title);
      var img = el("img"); img.src = it.thumb; img.alt = ""; img.loading = "lazy"; b.appendChild(img);
      var pl = el("span", "play"); pl.innerHTML = PLAY; b.appendChild(pl);
      if (isList && it.count != null) b.appendChild(el("span", "pi", it.count + (it.count === 1 ? " video" : " videos")));
      b.addEventListener("click", function () {
        var box = el("div", "yt-frame"), f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + (isList ? "videoseries?list=" : "") + encodeURIComponent(it.id) + (isList ? "&" : "?") + "autoplay=1";
        f.title = it.title; f.allow = "autoplay; encrypted-media; picture-in-picture; web-share";
        f.setAttribute("allowfullscreen", ""); f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        box.appendChild(f); c.replaceChild(box, b);
      });
      c.appendChild(b);
      c.appendChild(el("h4", "", it.title));
      if (!isList && it.date) {
        var d = new Date(it.date);
        if (!isNaN(d)) c.appendChild(el("small", "", d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })));
      }
      return c;
    }

    function render(m) {
      var c = m.channel, head = $("yt-chan"); head.innerHTML = "";
      var banner = el("div", "yt-banner");
      if (c.banner) banner.style.backgroundImage = "url('" + c.banner + "=w1280')";
      head.appendChild(banner);
      var body = el("div", "yt-chan-body");
      if (c.avatar) { var av = el("img", "yt-avatar"); av.src = c.avatar; av.alt = ""; body.appendChild(av); }
      var meta = el("div", "yt-meta");
      meta.appendChild(el("h2", "", c.title));
      var bits = [];
      if (c.handle) bits.push(c.handle);
      if (c.subs != null) bits.push(compact.format(c.subs) + " subscribers");
      if (c.videos != null) bits.push(compact.format(c.videos) + " videos");
      meta.appendChild(el("div", "yt-sub", bits.join(" · ")));
      if (c.desc) meta.appendChild(el("p", "", c.desc.replace(/\s+/g, " ")));
      body.appendChild(meta);
      var act = el("div", "yt-actions");
      var sub = el("a", "btn btn-red", "Subscribe"); sub.href = "https://www.youtube.com/channel/" + cid + "?sub_confirmation=1"; sub.target = "_blank"; sub.rel = "noopener";
      var vis = el("a", "btn btn-line", "Open on YouTube"); vis.href = "https://www.youtube.com/channel/" + cid; vis.target = "_blank"; vis.rel = "noopener";
      act.appendChild(sub); act.appendChild(vis); body.appendChild(act);
      head.appendChild(body);

      var wrap = $("yt-sections"); wrap.innerHTML = "";
      m.sections.forEach(function (s) {
        var sec = el("div", "yt-sec"), h = el("div", "yt-sec-head");
        h.appendChild(el("h3", "", s.title));
        if (s.viewAll) { var va = el("a", "", "View all"); va.href = s.viewAll; va.target = "_blank"; va.rel = "noopener"; h.appendChild(va); }
        var row = el("div", "yt-row");
        var ar = el("div", "yt-arrows");
        [["\u2039", -1, "Scroll left"], ["\u203a", 1, "Scroll right"]].forEach(function (a) {
          var bt = el("button", "", a[0]); bt.type = "button"; bt.setAttribute("aria-label", a[2]);
          bt.addEventListener("click", function () { row.scrollBy({ left: a[1] * row.clientWidth * 0.8, behavior: "smooth" }); });
          ar.appendChild(bt);
        });
        h.appendChild(ar); sec.appendChild(h);
        s.items.forEach(function (it) { row.appendChild(card(it, s.kind === "lists")); });
        sec.appendChild(row); wrap.appendChild(sec);
      });
      $("channel").hidden = false;
      var fb = $("videos-fallback"); if (fb) fb.hidden = true;
      var hs = $("hero-stats");
      if (hs && (c.subs != null || c.videos != null)) {
        var bits2 = [];
        if (c.subs != null) bits2.push(compact.format(c.subs) + " subscribers");
        if (c.videos != null) bits2.push(compact.format(c.videos) + " videos");
        hs.textContent = bits2.join(" \u00b7 ");
      }
    }

    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (cached && cached.cid !== cid) cached = null;
    if (cached && cached.model && Date.now() - cached.ts < TTL) { render(cached.model); return; }
    build().then(function (m) {
      try { localStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), cid: cid, model: m })); } catch (e) {}
      render(m);
    }).catch(function () { if (cached && cached.model) render(cached.model); });
  })();
})();
