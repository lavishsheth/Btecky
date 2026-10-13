(function () {
  "use strict";

  /* ---- mobile menu ---- */
  var t = document.querySelector(".nav-toggle"), n = document.getElementById("nav");
  if (t && n) {
    t.addEventListener("click", function () {
      var open = n.classList.toggle("open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
      t.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    n.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { n.classList.remove("open"); t.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- social links (from config.js) ---- */
  (function initSocial() {
    var S = window.BTECKY_SOCIAL || {};
    var defs = [["youtube", "YouTube"], ["linkedin", "LinkedIn"], ["instagram", "Instagram"], ["x", "X"], ["telegram", "Telegram"], ["whatsapp", "WhatsApp"], ["github", "GitHub"]];
    document.querySelectorAll("[data-social]").forEach(function (box) {
      box.innerHTML = "";
      defs.forEach(function (d) {
        var u = S[d[0]];
        if (!u || !/^https:\/\//.test(u)) return;
        var a = document.createElement("a");
        a.href = u; a.textContent = d[1]; a.target = "_blank"; a.rel = "noopener me"; a.setAttribute("data-k", d[0]);
        a.setAttribute("aria-label", "B Tecky on " + d[1]);
        box.appendChild(a);
      });
    });
  })();

  /* ---- latest blog posts on the home page (reads posts.js) ---- */
  var grid = document.getElementById("latest-posts-grid"), sec = document.getElementById("latest-posts");
  if (grid && sec) {
    var B = window.BTECKY_BLOG, posts = (B && Array.isArray(B.posts)) ? B.posts.slice(0, 3) : [];
    if (posts.length) {
      posts.forEach(function (p) {
        var a = document.createElement("a"); a.className = "post-card"; a.href = "blog/" + p.slug + ".html";
        var cv = document.createElement("div"); cv.className = "cv";
        if (p.cover) { var im = document.createElement("img"); im.src = p.cover; im.alt = ""; im.loading = "lazy"; cv.appendChild(im); }
        var bd = document.createElement("div"); bd.className = "bd";
        if (p.tags && p.tags.length) { var ch = document.createElement("div"); ch.className = "chips"; var tg = document.createElement("span"); tg.className = "chip-t"; tg.textContent = p.tags[0]; ch.appendChild(tg); bd.appendChild(ch); }
        var h = document.createElement("h3"); h.textContent = p.title; bd.appendChild(h);
        if (p.summary) { var pp = document.createElement("p"); pp.textContent = p.summary; bd.appendChild(pp); }
        var m = document.createElement("div"); m.className = "meta";
        var d = new Date(p.date + "T00:00:00");
        m.textContent = isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        bd.appendChild(m);
        a.appendChild(cv); a.appendChild(bd); grid.appendChild(a);
      });
      sec.hidden = false;
    }
  }

  /* ---- ads: shown only once a real AdSense ID is in the <head> script ---- */
  (function initAds() {
    var s = document.querySelector('script[src*="adsbygoogle.js"]');
    var m = s && /client=(ca-pub-\d{10,})/.exec(s.src);
    if (!m) return;                       // placeholder ID: keep ad boxes hidden
    document.documentElement.classList.add("ads-on");
    document.querySelectorAll(".ad").forEach(function (box) {
      var slot = box.getAttribute("data-ad-slot");
      if (!slot || /^(\d)\1+$/.test(slot)) { box.style.display = "none"; return; }   // slot ID not set yet
      var ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", m[1]);
      ins.setAttribute("data-ad-slot", slot);
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");
      box.appendChild(ins);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  })();
})();
