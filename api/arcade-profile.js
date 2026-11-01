// Read-only public Google Skills profile fetcher for the B Tecky Arcade calculator.
// No API key, Google login, cookies, or credentials are used.
const PROFILE_HOSTS = new Set(["skills.google", "www.skills.google", "www.cloudskillsboost.google", "cloudskillsboost.google"]);

function decode(value) {
  return String(value || "")
    .replace(/&amp;/gi, "&").replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"').replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
function clean(value) {
  return decode(String(value || "")
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " "))
    .replace(/[\u200b-\u200f\ufeff]/g, "")
    .replace(/\s+/g, " ").trim();
}
function attrs(tag) {
  const out = {};
  const re = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let m;
  while ((m = re.exec(tag))) out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? "");
  return out;
}
function safeProfileUrl(value) {
  let u;
  try { u = new URL(value); } catch (_) { throw new Error("Enter a valid Google Skills public profile URL."); }
  if (u.protocol !== "https:" || !PROFILE_HOSTS.has(u.hostname) || !/^\/public_profiles\/[A-Za-z0-9_-]+\/?$/.test(u.pathname)) {
    throw new Error("Use a Google Skills public profile URL, for example https://www.skills.google/public_profiles/…");
  }
  return u.toString();
}
function extractBadges(html, base) {
  const found = new Map();
  const add = (rawTitle, rawUrl, context) => {
    const title = clean(rawTitle);
    if (title.length < 5 || title.length > 180) return;
    if (/^(view|share|completed|badge|badges|skills|all badges|profile|paths|activities|leaderboard|learn more)$/i.test(title)) return;
    if (/^(https?:|www\.)/i.test(title)) return;
    const key = title.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    if (!key || found.has(key)) return;
    let url = "";
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl, base);
        if (parsed.protocol === "https:" && PROFILE_HOSTS.has(parsed.hostname)) url = parsed.toString();
      } catch (_) {}
    }
    const hint = String(context || "").toLowerCase();
    const type = /skill.?badge|skill_badge/.test(hint) ? "skill"
      : /arcade|game.?badge|trivia|sprint|certification.?zone/.test(hint) ? "game" : "other";
    found.set(key, { title, url, type });
  };

  // Card wrappers: support both the older badge-named classes and newer generic
  // card components whose data attributes identify a credential.
  const cardRe = /<(a|article|div|li|section)\b([^>]*)>([\s\S]{0,5000}?)<\/\1>/gi;
  let match;
  while ((match = cardRe.exec(html))) {
    const a = attrs(match[2]);
    const context = [a.class, a.id, a["aria-label"], a.title, a["data-testid"], a["data-type"], a["data-kind"]].join(" ");
    const body = match[3];
    const imageAlt = [...body.matchAll(/<img\b([^>]*)>/gi)].map(x => attrs(x[0])["alt"]).filter(Boolean);
    const heading = body.match(/<(?:h[1-6]|strong|a)\b[^>]*>([\s\S]{1,500}?)<\/(?:h[1-6]|strong|a)>/i);
    if (/badge|credential|achievement|award|course.?card|activity.?card/i.test(context)) {
      const title = heading ? clean(heading[1]) : imageAlt[0];
      const link = match[1].toLowerCase() === "a" ? a.href : (body.match(/<a\b([^>]*)>/i) || [])[1];
      add(title, link ? (typeof link === "string" ? (attrs(link).href || link) : "") : "", context + " " + body.slice(0, 500));
    }
  }

  // Image labels and accessible names are frequently the only textual badge
  // labels in responsive Google Skills cards.
  const tagRe = /<(img|a|button|div|span)\b([^>]*)>/gi;
  while ((match = tagRe.exec(html))) {
    const a = attrs(match[0]);
    const context = [a.class, a.id, a["data-testid"], a["data-type"], a["data-kind"], a["aria-label"], a.title].join(" ");
    const label = a.alt || a["data-badge-name"] || a["data-credential-name"] || a["data-title"] ||
      (/badge|credential|achievement|award/i.test(context) ? (a.title || a["aria-label"]) : "");
    if (label) add(label, a.href || a["data-url"], context);
  }

  // Links can expose the badge title even when the surrounding card has no
  // badge-related class name.
  const linkRe = /<a\b([^>]*)>([\s\S]{0,2400}?)<\/a>/gi;
  while ((match = linkRe.exec(html))) {
    const a = attrs(match[1]);
    const context = [a.href, a.class, a["aria-label"], a.title, a["data-testid"]].join(" ");
    const body = match[2];
    if (/badge|credential|achievement|award|course_templates/i.test(context) || /<img\b/i.test(body)) {
      const title = clean(body) || a["aria-label"] || a.title;
      add(title, a.href, context);
    }
  }

  // Google may serialize profile data into JSON/hydration scripts rather than
  // render badge names as conventional HTML text.
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const visit = (value, path) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) return value.forEach((item, i) => visit(item, path + "[" + i + "]"));
    const context = path + " " + Object.keys(value).join(" ");
    const badgeContext = /badge|credential|achievement|award/i.test(context);
    const title = value.badgeName || value.credentialName || value.achievementName ||
      (badgeContext && (value.name || value.title || value.label || value.displayName));
    if (typeof title === "string") {
      const url = value.url || value.href || value.badgeUrl || value.credentialUrl || "";
      add(title, url, context + " " + JSON.stringify(value).slice(0, 700));
    }
    Object.keys(value).forEach(key => visit(value[key], path + "." + key));
  };
  for (const block of scripts) {
    const a = attrs(block[1]);
    if (!/application\/(?:ld\+json|json)/i.test(a.type || "") && !/__NEXT_DATA__|__NUXT__|initial-state|bootstrap/i.test(a.id || "")) continue;
    try { visit(JSON.parse(block[2]), "script " + (a.id || a.type || "")); } catch (_) {}
  }

  return [...found.values()];
}
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const profileUrl = safeProfileUrl(body.url);
    let target = profileUrl, response;
    for (let hop = 0; hop < 4; hop++) {
      response = await fetch(target, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BTecky-ArcadeCalculator/1.0; +https://btecky.tech)",
          "Accept": "text/html,application/xhtml+xml"
        },
        redirect: "manual"
      });
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) break;
        const next = new URL(location, target);
        if (next.protocol !== "https:" || !PROFILE_HOSTS.has(next.hostname)) {
          return res.status(400).json({ error: "The profile redirected to an unsupported host." });
        }
        target = next.toString();
        continue;
      }
      break;
    }
    if (!response || !response.ok) {
      const status = response && response.status;
      return res.status(status === 404 ? 404 : 502).json({
        error: status === 404
          ? "Profile not found. Check that it is public and the URL is correct."
          : "Google Skills could not return this profile right now. Try again later."
      });
    }
    const finalUrl = new URL(target);
    if (finalUrl.protocol !== "https:" || !PROFILE_HOSTS.has(finalUrl.hostname)) {
      return res.status(400).json({ error: "The profile URL redirected to an unsupported host." });
    }
    const html = await response.text();
    if (html.length > 8_000_000) return res.status(502).json({ error: "The public profile response was too large to analyse." });
    const nameMatch = html.match(/<meta\b[^>]*\b(?:property|name)=["'](?:og:title|twitter:title)["'][^>]*\bcontent=["']([^"']+)/i)
      || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const badges = extractBadges(html, finalUrl.toString());
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({
      profileUrl,
      name: nameMatch ? clean(nameMatch[1]) : "Google Skills learner",
      badges,
      source: "public-profile",
      fetchedAt: new Date().toISOString(),
      diagnostics: { responseBytes: html.length, candidateCount: badges.length, finalHost: finalUrl.hostname },
      notice: badges.length
        ? "Badge candidates extracted from the public profile page."
        : "The profile loaded, but no badge entries were found in its server-rendered HTML or embedded profile data."
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Unable to analyse this profile." });
  }
};

// Export pure helpers for local fixture tests; Vercel ignores these properties.
module.exports._extractBadges = extractBadges;
module.exports._safeProfileUrl = safeProfileUrl;
