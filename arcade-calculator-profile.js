(function () {
  "use strict";

  var form = document.getElementById("profile-form");
  if (!form) return;

  var input = document.getElementById("profile-url");
  var button = document.getElementById("calculate-btn");
  var status = document.getElementById("profile-status");
  var dashboard = document.getElementById("dashboard");
  var rules = window.ARCADE_RULES || {};
  var catalog = window.ARCADE_CATALOG || { games: [], badges: [] };
  var tiers = Array.isArray(rules.tiers) ? rules.tiers : [
    { name: "Trooper", min: 50 }, { name: "Ranger", min: 75 },
    { name: "Champion", min: 95 }, { name: "Legend", min: 120 }
  ];
  var gameNames = new Set((catalog.games || []).map(normalize));
  var skillNames = new Set((catalog.badges || []).map(normalize));
  var number = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/&amp;/g, "&")
      .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  }

  function classify(badge) {
    var title = String(badge.title || "").trim();
    var key = normalize(title);
    if (gameNames.has(key) || /\b(arcade|game badge|trivia|sprint|certification zone)\b/i.test(title)) return "game";
    if (skillNames.has(key) || /\bskill badge\b/i.test(title)) return "skill";
    if (badge.type === "game" || badge.type === "skill") return badge.type;
    return "other";
  }

  function setStatus(message, kind) {
    status.textContent = message;
    status.className = "ap-status show" + (kind ? " " + kind : "");
  }

  function setLoading(loading) {
    button.disabled = loading;
    button.innerHTML = loading ? '<span class="ap-loading" aria-hidden="true"></span> Checking profile…' : "Calculate points";
  }

  function tierFor(points) {
    var current = null;
    tiers.forEach(function (tier) { if (points >= Number(tier.min)) current = tier; });
    return current;
  }

  function render(data) {
    var badges = Array.isArray(data.badges) ? data.badges : [];
    if (!badges.length) {
      dashboard.classList.remove("show");
      setStatus("Google Skills returned the public profile page, but no badge cards could be read from its page data. This is not a zero score. Please try again later; the profile parser needs to recognise the current Google Skills page format.", "error");
      return;
    }

    var unique = new Map();
    badges.forEach(function (badge) {
      if (!badge || !badge.title) return;
      var key = normalize(badge.title);
      if (key && !unique.has(key)) unique.set(key, { title: String(badge.title).trim(), url: badge.url || "", type: classify(badge) });
    });
    var all = Array.from(unique.values());
    var games = all.filter(function (badge) { return badge.type === "game"; });
    var skills = all.filter(function (badge) { return badge.type === "skill"; });
    var other = all.filter(function (badge) { return badge.type === "other"; });
    var gamePoints = games.length * Number((rules.points || {}).game || 1);
    var skillPoints = skills.length * Number((rules.points || {}).skillBadge || 0.5);
    var total = gamePoints + skillPoints;
    var tier = tierFor(total);
    var next = tiers.find(function (item) { return total < Number(item.min); });
    var base = tier ? Number(tier.min) : 0;
    var progress = next ? Math.max(0, Math.min(100, ((total - base) / (Number(next.min) - base)) * 100)) : 100;

    document.getElementById("profile-name").textContent = data.name || "Google Skills public profile";
    document.getElementById("score-total").textContent = number.format(total);
    document.getElementById("score-tier").textContent = tier ? tier.name + " tier" : "Below " + tiers[0].name;
    document.getElementById("score-progress").style.width = progress + "%";
    document.getElementById("score-next").textContent = next ? number.format(Number(next.min) - total) + " points to " + next.name : "Top tier threshold reached";
    document.getElementById("game-count").textContent = number.format(games.length);
    document.getElementById("game-points").textContent = number.format(gamePoints);
    document.getElementById("skill-count").textContent = number.format(skills.length);
    document.getElementById("skill-points").textContent = number.format(skillPoints);
    document.getElementById("bonus-points").textContent = "Not verified";
    document.getElementById("badge-total").textContent = number.format(all.length);
    document.getElementById("last-sync").textContent = data.fetchedAt ? new Date(data.fetchedAt).toLocaleString() : "Just now";

    var list = document.getElementById("badge-list");
    list.innerHTML = "";
    all.forEach(function (badge) {
      var item = document.createElement("div");
      item.className = "ap-badge" + (badge.type === "other" ? "" : " done");
      var title = document.createElement("strong");
      title.textContent = badge.title;
      var kind = document.createElement("small");
      kind.textContent = badge.type === "game" ? "Game badge · 1 point" : badge.type === "skill" ? "Skill badge · 0.5 points" : "Not classified · excluded from score";
      item.appendChild(title);
      item.appendChild(kind);
      if (badge.url) {
        var link = document.createElement("a");
        link.href = badge.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View badge ↗";
        item.appendChild(link);
      }
      list.appendChild(item);
    });

    dashboard.classList.add("show");
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
    if (other.length) {
      setStatus("Profile loaded. " + games.length + " game badges and " + skills.length + " skill badges were counted. " + other.length + " other entries were left out rather than guessed. Facilitator bonuses are not verified from a public profile.", "success");
    } else {
      setStatus("Profile loaded. " + games.length + " game badges and " + skills.length + " skill badges were counted. Facilitator bonuses remain unverified and are not included.", "success");
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var url = input.value.trim();
    if (!url) {
      setStatus("Paste your Google Skills public profile URL first.", "error");
      input.focus();
      return;
    }
    try {
      var parsed = new URL(url);
      if (parsed.protocol !== "https:" || !/^(www\.)?(skills\.google|cloudskillsboost\.google)$/.test(parsed.hostname) || !/^\/public_profiles\/[A-Za-z0-9_-]+\/?$/.test(parsed.pathname)) {
        throw new Error("Use the full HTTPS Google Skills public profile link, including /public_profiles/…");
      }
    } catch (error) {
      setStatus(error.message || "Enter a valid Google Skills public profile URL.", "error");
      return;
    }

    setLoading(true);
    setStatus("Connecting to your public Google Skills profile…");
    dashboard.classList.remove("show");
    fetch("/api/arcade-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ url: url })
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok) throw new Error(body.error || "Google Skills could not return this profile. Please try again.");
        return body;
      });
    }).then(render).catch(function (error) {
      setStatus(error.message || "Could not read the public profile. Please try again.", "error");
    }).finally(function () {
      setLoading(false);
    });
  });
})();
