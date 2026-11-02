/* Pure calculation functions for the Arcade Points Calculator (no page code here, so they can be tested). */
(function (root) {
  "use strict";
  function num(v) { v = Number(v); return isFinite(v) ? v : 0; }

  function tierFor(R, total) {
    var t = null;
    R.tiers.forEach(function (x) { if (total >= x.min) t = x; });
    return t;
  }
  function nextTier(R, total) {
    for (var i = 0; i < R.tiers.length; i++) if (total < R.tiers[i].min) return R.tiers[i];
    return null;
  }
  /* highest facilitator milestone (1-4) whose games AND badges requirements are both met, or 0 */
  function suggestMilestone(R, games, badges) {
    var best = 0;
    R.milestones.forEach(function (m, i) { if (games >= m.games && badges >= m.badges) best = i + 1; });
    return best;
  }
  /* s: {games, badges, extra, milestone (0-4), bonusMilestone (bool)} */
  function compute(R, s) {
    var games = Math.max(0, Math.floor(num(s.games))), badges = Math.max(0, Math.floor(num(s.badges))), extra = num(s.extra);
    var ms = Math.min(R.milestones.length, Math.max(0, Math.floor(num(s.milestone))));
    var msBonus = ms > 0 ? R.milestones[ms - 1].bonus : 0;
    var bonus = s.bonusMilestone ? R.bonusMilestone : 0;
    var gamePts = games * R.points.game, badgePts = badges * R.points.skillBadge;
    var total = gamePts + badgePts + msBonus + bonus + extra;
    return { games: games, badges: badges, extra: extra, milestone: ms, gamePts: gamePts, badgePts: badgePts, msBonus: msBonus, bonus: bonus,
      total: total, tier: tierFor(R, total), next: nextTier(R, total) };
  }
  /* what is needed to reach a target number of points */
  function need(R, total, target) {
    var gap = Math.max(0, target - total);
    return { gap: gap, games: Math.ceil(gap / R.points.game - 1e-9), badges: Math.ceil(gap / R.points.skillBadge - 1e-9) };
  }
  function daysLeft(R, now) {
    var end = new Date(R.seasonEnd + "T23:59:59"), ms = end - now;
    return ms <= 0 ? 0 : Math.ceil(ms / 86400000);
  }
  /* what-if: current result plus games per month and badges per week until the season ends */
  function project(R, s, gamesPerMonth, badgesPerWeek, days) {
    var addGames = Math.floor(Math.max(0, num(gamesPerMonth)) * (days / 30.4375) + 1e-9);
    var addBadges = Math.floor(Math.max(0, num(badgesPerWeek)) * (days / 7) + 1e-9);
    var r = compute(R, Object.assign({}, s, { games: num(s.games) + addGames, badges: num(s.badges) + addBadges }));
    r.addGames = addGames; r.addBadges = addBadges;
    return r;
  }
  function fmt(n) { return Number.isInteger(n) ? String(n) : (Math.round(n * 10) / 10).toFixed(1); }

  var api = { compute: compute, tierFor: tierFor, nextTier: nextTier, suggestMilestone: suggestMilestone, need: need, daysLeft: daysLeft, project: project, fmt: fmt };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.ArcadeCalc = api;
})(typeof window !== "undefined" ? window : this);
