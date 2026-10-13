(function () {
  "use strict";

  /* ---- settings you may want to edit ---- */
  var SALT = "btecky-arcade-v1";          // must match build_data.py
  var THRESH = [
    { name: "Milestone 1",       g: 6,  b: 18, bonus: 5  },
    { name: "Milestone 2",       g: 8,  b: 34, bonus: 15 },
    { name: "Milestone 3",       g: 10, b: 50, bonus: 25 },
    { name: "Ultimate Milestone", g: 12, b: 66, bonus: 35 }
  ];
  var AGENT_BONUS = 10;

  /* ---- tiny SHA-256 (works on http, https and file://) ---- */
  var K = [], H0 = [];
  (function () {
    var n = 2, c = 0;
    while (c < 64) {
      var p = true;
      for (var i = 2; i * i <= n; i++) if (n % i === 0) { p = false; break; }
      if (p) {
        if (c < 8) H0[c] = (Math.pow(n, 1 / 2) % 1) * 4294967296 | 0;
        K[c] = (Math.pow(n, 1 / 3) % 1) * 4294967296 | 0;
        c++;
      }
      n++;
    }
  })();
  function sha256hex(msg) {
    var bytes = new TextEncoder().encode(msg), l = bytes.length, bitLen = l * 8;
    var padLen = ((l + 9 + 63) >> 6) << 6;
    var buf = new Uint8Array(padLen); buf.set(bytes); buf[l] = 0x80;
    var dv = new DataView(buf.buffer);
    dv.setUint32(padLen - 4, bitLen >>> 0);
    dv.setUint32(padLen - 8, Math.floor(bitLen / 4294967296));
    var h = H0.slice(), w = new Int32Array(64);
    for (var o = 0; o < padLen; o += 64) {
      for (var i = 0; i < 16; i++) w[i] = dv.getInt32(o + i * 4);
      for (i = 16; i < 64; i++) {
        var a1 = w[i - 15], b1 = w[i - 2];
        var s0 = ((a1 >>> 7) | (a1 << 25)) ^ ((a1 >>> 18) | (a1 << 14)) ^ (a1 >>> 3);
        var s1 = ((b1 >>> 17) | (b1 << 15)) ^ ((b1 >>> 19) | (b1 << 13)) ^ (b1 >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var t1 = (hh + S1 + ch + K[i] + w[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
      h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    return h.map(function (x) { return (x >>> 0).toString(16).padStart(8, "0"); }).join("");
  }

  function normEmail(v) {
    var e = String(v).trim().toLowerCase();
    var at = e.lastIndexOf("@");
    var local = e.slice(0, at), dom = e.slice(at + 1);
    if (dom === "gmail.com" || dom === "googlemail.com") {
      local = local.split("+")[0].replace(/\./g, "");
      dom = "gmail.com";
    }
    return local + "@" + dom;
  }
  function keyFor(email) { return sha256hex(SALT + normEmail(email)).slice(0, 16); }

  /* ---- helpers ---- */
  var $ = function (id) { return document.getElementById(id); };
  var DATA = window.ARCADE_DATA;
  var nf = new Intl.NumberFormat("en-IN");
  function fmt(n) { return Number.isInteger(n) ? String(n) : n.toFixed(1); }
  function show(el, on) { el.hidden = !on; }
  document.querySelectorAll("[data-updated]").forEach(function (el) { if (DATA) el.textContent = DATA.updated; });

  var msg = $("msg");
  function say(text, kind) {
    msg.textContent = text;
    msg.className = "msg show " + (kind || "err");
  }
  function clearMsg() { msg.className = "msg"; msg.textContent = ""; }

  function countUp(el, to) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || to === 0) { el.textContent = fmt(to); return; }
    var start = performance.now(), dur = 700;
    (function tick(now) {
      var t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 3);
      var v = to * eased;
      el.textContent = t === 1 ? fmt(to) : (Number.isInteger(to) ? String(Math.round(v)) : v.toFixed(1));
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  function bar(label, cur, target) {
    var pct = Math.min(100, Math.round((cur / target) * 100));
    var done = cur >= target;
    return '<div class="bar"><div class="bar-row"><span>' + label + '</span><span>' +
      Math.min(cur, target) + ' / ' + target + '</span></div><div class="track"><div class="fill' +
      (done ? " done" : "") + '" style="width:' + pct + '%"></div></div></div>';
  }
  function fillList(ul, ids, dict) {
    ul.innerHTML = "";
    ids.map(function (i) { return dict[i]; }).sort().forEach(function (n) {
      var li = document.createElement("li"); li.textContent = n; ul.appendChild(li);
    });
  }

  /* ---- render ---- */
  var current = null;
  function render(r) {
    var name = r[0], games = r[1], badges = r[2], ms = r[3], bonus = r[4], agent = r[5], gi = r[6], bi = r[7], rank = r[8];
    var arcade = games + badges * 0.5;
    var msPts = ms > 0 ? THRESH[ms - 1].bonus : 0;
    var agentPts = bonus ? AGENT_BONUS : 0;
    var total = arcade + msPts + agentPts;
    current = { total: total, ms: ms };

    var board = $("board");
    board.classList.remove("idle");
    $("who").innerHTML = "Player <b></b>";
    $("who").querySelector("b").textContent = name;
    $("rankchip").hidden = false;
    $("rankchip").textContent = "Rank " + nf.format(rank) + " of " + nf.format(DATA.count);
    countUp($("score"), total);
    $("scorecap").textContent = "Estimated total points";
    $("s-arcade").textContent = fmt(arcade);
    $("s-ms").textContent = "+" + msPts;
    $("s-bonus").textContent = "+" + agentPts;

    $("res-title").textContent = ms > 0 ? THRESH[ms - 1].name + " earned" : "Your progress so far";
    $("res-sub").textContent = games + " arcade " + (games === 1 ? "game" : "games") + " and " + badges +
      " skill " + (badges === 1 ? "badge" : "badges") + " completed as of " + DATA.updated + ".";
    $("pills").innerHTML =
      '<span class="pill' + (ms > 0 ? " yes" : "") + '">Milestone: ' + (ms > 0 ? THRESH[ms - 1].name : "not yet") + '</span>' +
      '<span class="pill' + (bonus ? " yes" : "") + '">AI agent bonus: ' + (bonus ? "earned" : "not yet") + '</span>' +
      '<span class="pill' + (agent ? " yes" : "") + '">Agent project: ' + (agent ? "verified" : "not verified") + '</span>';

    if (ms < 4) {
      var nx = THRESH[ms];
      $("next-title").textContent = "Next up: " + nx.name;
      $("bars").innerHTML = bar("Arcade games", games, nx.g) + bar("Skill badges", badges, nx.b);
    } else {
      $("next-title").textContent = "Top milestone reached";
      $("bars").innerHTML = '<p class="muted" style="margin-top:12px">You have unlocked every milestone. Congratulations!</p>';
    }
    $("c-games").textContent = games;
    $("c-badges").textContent = badges;
    fillList($("l-games"), gi, DATA.games);
    fillList($("l-badges"), bi, DATA.badges);
    $("d-games").style.display = games ? "" : "none";
    $("d-badges").style.display = badges ? "" : "none";
    $("result").classList.add("show");

    if (games + badges === 0) {
      say("You are on the list but have no games or skill badges recorded yet. Start with the Arcade link below.", "warn");
    }
  }

  $("finder").addEventListener("submit", function (ev) {
    ev.preventDefault();
    clearMsg();
    var v = $("email").value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      say("Enter a valid email address, for example name@gmail.com.");
      return;
    }
    if (!DATA) { say("The score list did not load. Refresh the page and try again."); return; }
    var row = DATA.rows[keyFor(v)];
    if (!row) {
      $("result").classList.remove("show");
      var board = $("board"); board.classList.add("idle");
      $("who").textContent = "No match found"; $("rankchip").hidden = true;
      $("score").textContent = "0"; $("scorecap").textContent = "Total points";
      ["s-arcade", "s-ms", "s-bonus"].forEach(function (id) { $(id).textContent = "-"; });
      say("We could not find that email. Check the spelling and use the email linked to your Google Skills account. This list covers the Facilitator batches in the report dated " + DATA.updated + ".");
      return;
    }
    render(row);
    $("board").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  $("share").addEventListener("click", function () {
    if (!current) return;
    var url = location.href.split("#")[0].split("?")[0];
    var text = "I have " + fmt(current.total) + " points in the Google Cloud Arcade. Check your score on B Tecky:";
    if (navigator.share) {
      navigator.share({ title: "My Arcade score", text: text, url: url }).catch(function () {});
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + url), "_blank", "noopener");
    }
  });

  /* ---- email passed from the home page quick check (kept only in this tab, never in the URL) ---- */
  (function () {
    var pre = null;
    try { pre = sessionStorage.getItem("btecky-email"); sessionStorage.removeItem("btecky-email"); } catch (e) {}
    if (pre) {
      $("email").value = pre;
      $("finder").dispatchEvent(new Event("submit", { cancelable: true }));
    }
  })();
})();
