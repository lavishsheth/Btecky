/* Google Skills Arcade 2026 rules used by the Arcade Points Calculator.
   If Google changes a rule, edit the numbers here and re-upload this file.
   Sources: see the "sources" list below (also shown on the calculator page). */
window.ARCADE_RULES = {
  season: 2026,
  lastVerified: "20 September 2026",
  seasonEnd: "2026-12-31",                 // Prize Counter opens shortly after the season ends (end of the year)
  points: { game: 1, skillBadge: 0.5 },    // every game = 1 point since April 2026; every 2 skill badges = 1 point
  bonusMilestone: 10,                      // Facilitator 2026 Bonus Milestone (build your first AI agent)
  facilitator: { start: "2026-07-13", end: "2026-09-14" },
  milestones: [                            // only the highest milestone you earned gives its bonus
    { name: "Milestone 1",       games: 6,  badges: 18, bonus: 5  },
    { name: "Milestone 2",       games: 8,  badges: 34, bonus: 15 },
    { name: "Milestone 3",       games: 10, badges: 50, bonus: 25 },
    { name: "Ultimate Milestone", games: 12, badges: 66, bonus: 35 }
  ],
  tiers: [                                 // ordered lowest to highest; "cap" = number of prize spots
    { name: "Trooper",  min: 50,  max: 74,   cap: 6000 },
    { name: "Ranger",   min: 75,  max: 94,   cap: 4000 },
    { name: "Champion", min: 95,  max: 119,  cap: 3000 },
    { name: "Legend",   min: 120, max: null, cap: 2500 }
  ],
  sources: [
    { label: "Google Skills Arcade 2026 Tiers (official)", url: "https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066" },
    { label: "What's changing in the Google Skills Arcade from April 2026 (official)", url: "https://discuss.google.dev/t/what-s-changing-in-the-google-skills-arcade-from-april-2026/345557" },
    { label: "Arcade Facilitator 2026 Bonus Milestone (official)", url: "https://discuss.google.dev/t/arcade-facilitator-2026-bonus-milestone/386412" },
    { label: "The Arcade Facilitators 2026 (official)", url: "https://discuss.google.dev/t/the-arcade-facilitators-2026/380704" },
    { label: "Clarification: your 2026 Arcade Points and the Prize Counter (official)", url: "https://discuss.google.dev/t/clarification-your-2026-arcade-points-the-prize-counter/349716" },
    { label: "Facilitator milestone table (community-run reference)", url: "https://arcadepoints.vercel.app/facilitator-program" }
  ]
};
