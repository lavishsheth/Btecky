import assert from "node:assert/strict";
import profileApi from "../api/arcade-profile.js";

const base = "https://www.skills.google/public_profiles/example";
const html = `
  <main>
    <div class="credential-card">
      <h3>Build a Website on Google Cloud</h3>
      <a href="/public_profiles/example/badges/one">View badge</a>
    </div>
    <article data-testid="badge-card">
      <img alt="Analyze BigQuery Data in Connected Sheets" src="/badge.png">
    </article>
    <a href="/badges/arcade-adventure-data-vault">
      <img alt="Arcade Adventure: Data Vault" src="/arcade.png">
    </a>
    <script id="profile-state" type="application/json">
      {"profile":{"earnedBadges":[{"badgeName":"Use Machine Learning APIs on Google Cloud","badgeUrl":"/badges/ml"}]}}
    </script>
  </main>`;

const badges = profileApi._extractBadges(html, base);
const titles = badges.map(item => item.title);
assert.ok(titles.includes("Build a Website on Google Cloud"), "reads credential card headings");
assert.ok(titles.includes("Analyze BigQuery Data in Connected Sheets"), "reads accessible image labels");
assert.ok(titles.includes("Arcade Adventure: Data Vault"), "reads linked badge image labels");
assert.ok(titles.includes("Use Machine Learning APIs on Google Cloud"), "reads embedded profile JSON");
assert.equal(new Set(titles.map(title => title.toLowerCase())).size, titles.length, "deduplicates badge titles");
assert.equal(profileApi._safeProfileUrl(base), base, "accepts a supported public profile URL");
assert.throws(() => profileApi._safeProfileUrl("https://example.com/public_profiles/example"), /Google Skills public profile URL/);
console.log("Arcade profile parser fixtures passed:", titles.length, "badge candidates.");
