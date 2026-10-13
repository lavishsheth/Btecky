(function () {
  "use strict";
  var R = window.ARCADE_RULES, C = window.ArcadeCalc, CAT = window.ARCADE_CATALOG || { games: [], badges: [] };
  if (!R || !C) return;
  var $ = function (id) { return document.getElementById(id); };
  var nf = new Intl.NumberFormat("en-IN");
  var SKEY = "btecky-arcade-calc-v1", TKEY = "btecky-arcade-tracker-v1";

  /* ---------- saved data ---------- */
  function load(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  var trk = load(TKEY) || { games: [], badges: [] };
  trk.games = Array.isArray(trk.games) ? trk.games : []; trk.badges = Array.isArray(trk.badges) ? trk.badges : [];
  var saved = load(SKEY) || {};

  /* ---------- static content from the rules file ---------- */
  var sel = $("ms"), o;
  o = document.createElement("option"); o.value = "0"; o.textContent = "No milestone"; sel.appendChild(o);
  R.milestones.forEach(function (m, i) { o = document.createElement("option"); o.value = String(i + 1); o.textContent = m.name + " (+" + m.bonus + ")"; sel.appendChild(o); });
  var tsel = $("target");
  R.tiers.forEach(function (t, i) { o = document.createElement("option"); o.value = String(i); o.textContent = t.name + " (" + t.min + "+ points)"; tsel.appendChild(o); });
  var tb = document.querySelector("#ms-table tbody");
  R.milestones.forEach(function (m) {
    var tr = document.createElement("tr");
    [m.name, m.games, m.badges, "+" + m.bonus].forEach(function (v) { var td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
    tb.appendChild(tr);
  });
  $("verified").textContent = R.lastVerified;
  var src = $("sources");
  R.sources.forEach(function (s) {
    var li = document.createElement("li"), a = document.createElement("a");
    a.href = s.url; a.textContent = s.label; a.target = "_blank"; a.rel = "noopener"; li.appendChild(a); src.appendChild(li);
  });

  /* ---------- reading inputs ---------- */
  function n(id) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : 0; }
  function state() {
    var useT = $("use-tracker").checked;
    return {
      games: useT ? trk.games.length : Math.floor(n("in-games")),
      badges: useT ? trk.badges.length : Math.floor(n("in-badges")),
      extra: n("in-extra"),
      milestone: $("fac").checked ? parseInt($("ms").value, 10) || 0 : 0,
      bonusMilestone: $("fac").checked && $("bm").checked
    };
  }

  /* ---------- rendering ---------- */
  function fmt(v) { return C.fmt(v); }
  function pts(v) { return fmt(v) + (v === 1 ? " point" : " points"); }
  var lastRes = null;

  function renderBoard(r) {
    var next = r.next, base = r.tier ? r.tier.min : 0;
    $("total").textContent = fmt(r.total);
    $("mini-total").textContent = fmt(r.total);
    var tname = r.tier ? r.tier.name + " tier" : "Below " + R.tiers[0].name;
    $("tier-chip").textContent = tname; $("mini-tier").textContent = tname;
    $("board").classList.toggle("idle", r.total === 0);
    if (next) {
      $("cap").textContent = "points \u00b7 " + fmt(next.min - r.total) + " more for " + next.name;
      $("fill").style.width = Math.max(0, Math.min(100, ((r.total - base) / (next.min - base)) * 100)) + "%";
      $("p-from").textContent = r.tier ? r.tier.name + " " + base : "0";
      $("p-to").textContent = next.name + " " + next.min;
    } else {
      $("cap").textContent = "points \u00b7 top tier reached";
      $("fill").style.width = "100%";
      $("p-from").textContent = r.tier.name + " " + base; $("p-to").textContent = "";
    }
    $("s-games").textContent = fmt(r.gamePts);
    $("s-badges").textContent = fmt(r.badgePts);
    $("s-bonus").textContent = fmt(r.msBonus + r.bonus + r.extra);
    var lines = [
      [r.games + (r.games === 1 ? " game" : " games") + " \u00d7 " + R.points.game, r.gamePts],
      [r.badges + (r.badges === 1 ? " skill badge" : " skill badges") + " \u00d7 " + R.points.skillBadge, r.badgePts]
    ];
    if (r.milestone) lines.push([R.milestones[r.milestone - 1].name + " bonus", r.msBonus]);
    if (r.bonus) lines.push(["AI agent Bonus Milestone", r.bonus]);
    if (r.extra) lines.push(["Other points", r.extra]);
    var ul = $("lines"); ul.innerHTML = "";
    lines.forEach(function (l) {
      var li = document.createElement("li"), a = document.createElement("span"), b = document.createElement("b");
      a.textContent = l[0]; b.textContent = "+" + fmt(l[1]); li.appendChild(a); li.appendChild(b); ul.appendChild(li);
    });
  }

  function renderLadder(r) {
    var box = $("ladder"); box.innerHTML = "";
    R.tiers.forEach(function (t) {
      var d = document.createElement("div"), reached = r.total >= t.min, now = r.tier && r.tier.name === t.name;
      d.className = "rung" + (reached ? " done" : "") + (now ? " now" : "");
      var h = document.createElement("h3"); h.textContent = t.name; d.appendChild(h);
      var p = document.createElement("div"); p.className = "pts"; p.textContent = t.min + (t.max ? "\u2013" + t.max : "+"); d.appendChild(p);
      var s1 = document.createElement("small"); s1.textContent = "points"; d.appendChild(s1);
      var s2 = document.createElement("small"); s2.textContent = "First " + nf.format(t.cap) + " players"; s2.style.marginTop = "8px"; d.appendChild(s2);
      if (now) { var y = document.createElement("span"); y.className = "you"; y.textContent = "You are here"; d.appendChild(y); }
      box.appendChild(d);
    });
  }

  function renderPlan(r, s) {
    var t = R.tiers[parseInt($("target").value, 10) || 0], days = C.daysLeft(R, new Date()), need = C.need(R, r.total, t.min), out = $("need");
    out.className = "ac-out" + (need.gap === 0 ? " ok" : "");
    out.innerHTML = "";
    function p(html) { var e = document.createElement("p"); e.innerHTML = html; out.appendChild(e); }
    if (need.gap === 0) {
      p('<span class="big">Goal reached</span>');
      p("You have " + fmt(r.total) + " points, which is " + (r.total - t.min === 0 ? "exactly" : fmt(r.total - t.min) + " above") + " the " + t.name + " line of " + t.min + ".");
    } else {
      p('<span class="big">' + fmt(need.gap) + " more points</span>");
      p("To reach " + t.name + " (" + t.min + " points) you could finish <b>" + nf.format(need.games) + (need.games === 1 ? " game" : " games") + "</b>, or <b>" + nf.format(need.badges) + " skill " + (need.badges === 1 ? "badge" : "badges") + "</b>, or any mix. One game is worth two badges.");
      if (days > 0) {
        var wk = days / 7;
        p("With " + days + " days left in the season, badges alone would be about <b>" + (Math.ceil((need.badges / wk) * 10) / 10) + " a week</b>.");
      } else p("The 2026 season has ended, so no new points can be added.");
    }
    p('<span class="muted" style="font-size:.9rem">Prizes are limited and first come, first served, so the earlier you lock in your points the better.</span>');

    var g = Math.max(0, parseFloat($("gpm").value) || 0), b = Math.max(0, parseFloat($("bpw").value) || 0), pj = C.project(R, s, g, b, days), po = $("proj");
    po.className = "ac-out"; po.innerHTML = "";
    function q(html) { var e = document.createElement("p"); e.innerHTML = html; po.appendChild(e); }
    if (days <= 0) { q("The season has ended, so there is nothing left to project."); return; }
    q('<span class="big">' + fmt(pj.total) + " points</span>");
    q("By 31 December (" + days + " days left) that adds about <b>" + pj.addGames + (pj.addGames === 1 ? " game" : " games") + "</b> and <b>" + pj.addBadges + " skill " + (pj.addBadges === 1 ? "badge" : "badges") + "</b>, putting you in " + (pj.tier ? "the <b>" + pj.tier.name + "</b> tier." : "<b>below Trooper</b>."));
  }

  function renderHints(r, s) {
    var sug = C.suggestMilestone(R, s.games, s.badges), h = $("ms-hint"), cur = s.milestone;
    h.innerHTML = "";
    if (sug > 0 && sug !== cur) {
      h.appendChild(document.createTextNode("Your counts meet " + R.milestones[sug - 1].name + ". "));
      var b = document.createElement("button"); b.type = "button"; b.textContent = "Use it";
      b.addEventListener("click", function () { $("ms").value = String(sug); update(); });
      h.appendChild(b);
    } else if (sug === 0) {
      var m = R.milestones[0];
      h.textContent = "Milestone 1 needs " + m.games + " games and " + m.badges + " skill badges.";
    }
    $("bm-warn").hidden = !(s.bonusMilestone && s.milestone === 0);
  }

  function update(skipSave) {
    var s = state(), r = C.compute(R, s);
    lastRes = r;
    renderBoard(r); renderLadder(r); renderPlan(r, s); renderHints(r, s);
    $("fac-box").hidden = !$("fac").checked;
    if ($("use-tracker").checked) { $("in-games").value = trk.games.length; $("in-badges").value = trk.badges.length; }
    $("in-games").disabled = $("in-badges").disabled = $("use-tracker").checked;
    document.querySelectorAll('[data-for="in-games"],[data-for="in-badges"]').forEach(function (b) { b.disabled = $("use-tracker").checked; });
    if (skipSave !== true) save(SKEY, {
      games: $("in-games").value, badges: $("in-badges").value, extra: $("in-extra").value, useTracker: $("use-tracker").checked,
      fac: $("fac").checked, ms: $("ms").value, bm: $("bm").checked, target: $("target").value, gpm: $("gpm").value, bpw: $("bpw").value
    });
  }

  /* ---------- checklist ---------- */
  var tab = "games";
  function renderTracker() {
    var q = $("trk-search").value.trim().toLowerCase(), list = CAT[tab] || [], ul = $("trk-list"), have = trk[tab];
    ul.innerHTML = "";
    var shown = list.filter(function (x) { return !q || x.toLowerCase().indexOf(q) > -1; });
    shown.forEach(function (name) {
      var li = document.createElement("li"), lab = document.createElement("label"), cb = document.createElement("input"), sp = document.createElement("span");
      cb.type = "checkbox"; cb.checked = have.indexOf(name) > -1; cb.setAttribute("data-n", name);
      cb.addEventListener("change", function () {
        var i = trk[tab].indexOf(name);
        if (cb.checked && i < 0) trk[tab].push(name); else if (!cb.checked && i > -1) trk[tab].splice(i, 1);
        save(TKEY, trk); trkSummary(); if ($("use-tracker").checked) update();
      });
      sp.textContent = name; lab.appendChild(cb); lab.appendChild(sp); li.appendChild(lab); ul.appendChild(li);
    });
    if (!shown.length) { var e = document.createElement("li"); e.style.padding = "14px"; e.className = "muted"; e.textContent = "Nothing matches your search."; ul.appendChild(e); }
    $("tab-games").textContent = "Games (" + trk.games.length + "/" + CAT.games.length + ")";
    $("tab-badges").textContent = "Skill badges (" + trk.badges.length + "/" + CAT.badges.length + ")";
  }
  function trkSummary() {
    $("trk-summary").textContent = trk.games.length + (trk.games.length === 1 ? " game" : " games") + ", " + trk.badges.length + (trk.badges.length === 1 ? " badge" : " badges") + " ticked";
    $("tab-games").textContent = "Games (" + trk.games.length + "/" + CAT.games.length + ")";
    $("tab-badges").textContent = "Skill badges (" + trk.badges.length + "/" + CAT.badges.length + ")";
  }
  function setTab(t) { tab = t; $("tab-games").setAttribute("aria-pressed", String(t === "games")); $("tab-badges").setAttribute("aria-pressed", String(t === "badges")); renderTracker(); }
  $("tab-games").addEventListener("click", function () { setTab("games"); });
  $("tab-badges").addEventListener("click", function () { setTab("badges"); });
  $("trk-search").addEventListener("input", renderTracker);
  function bulk(on) {
    var q = $("trk-search").value.trim().toLowerCase();
    (CAT[tab] || []).forEach(function (name) {
      if (q && name.toLowerCase().indexOf(q) < 0) return;
      var i = trk[tab].indexOf(name);
      if (on && i < 0) trk[tab].push(name); else if (!on && i > -1) trk[tab].splice(i, 1);
    });
    save(TKEY, trk); renderTracker(); trkSummary(); if ($("use-tracker").checked) update();
  }
  $("trk-all").addEventListener("click", function () { bulk(true); });
  $("trk-none").addEventListener("click", function () { bulk(false); });

  /* ---------- wiring ---------- */
  document.querySelectorAll(".stepper button").forEach(function (b) {
    b.addEventListener("click", function () {
      var inp = $(b.getAttribute("data-for")), step = parseFloat(b.getAttribute("data-step")) * (inp.step && inp.step !== "any" ? parseFloat(inp.step) : 1);
      var v = (parseFloat(inp.value) || 0) + step, min = inp.min !== "" ? parseFloat(inp.min) : 0, max = inp.max !== "" ? parseFloat(inp.max) : Infinity;
      inp.value = Math.min(max, Math.max(min, v)); update();
    });
  });
  ["in-games", "in-badges", "in-extra", "gpm", "bpw"].forEach(function (id) { $(id).addEventListener("input", function () { update(); }); });
  ["use-tracker", "fac", "ms", "bm", "target"].forEach(function (id) { $(id).addEventListener("change", function () { update(); }); });

  $("reset").addEventListener("click", function () {
    if (!confirm("Clear your numbers and your checklist on this device?")) return;
    trk = { games: [], badges: [] }; save(TKEY, trk);
    ["in-games", "in-badges", "in-extra"].forEach(function (id) { $(id).value = "0"; });
    $("use-tracker").checked = $("fac").checked = $("bm").checked = false; $("ms").value = "0"; $("target").value = "0"; $("gpm").value = "3"; $("bpw").value = "2";
    renderTracker(); trkSummary(); update();
  });
  $("share").addEventListener("click", function () {
    if (!lastRes) return;
    var url = location.href.split("#")[0].split("?")[0], t = lastRes.tier ? lastRes.tier.name + " tier" : "below Trooper";
    var text = "I have about " + fmt(lastRes.total) + " Arcade points (" + t + "). Work out yours with the B Tecky Arcade Points Calculator:";
    if (navigator.share) navigator.share({ title: "Arcade Points Calculator", text: text, url: url }).catch(function () {});
    else window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + url), "_blank", "noopener");
  });

  /* ---------- restore saved values, then draw ---------- */
  function put(id, v) { if (v !== undefined && v !== null && v !== "") $(id).value = v; }
  put("in-games", saved.games); put("in-badges", saved.badges); put("in-extra", saved.extra); put("ms", saved.ms); put("target", saved.target); put("gpm", saved.gpm); put("bpw", saved.bpw);
  $("use-tracker").checked = !!saved.useTracker; $("fac").checked = !!saved.fac; $("bm").checked = !!saved.bm;
  if (!$("target").value) $("target").value = "0";
  setTab("games"); trkSummary(); update(true);
})();
