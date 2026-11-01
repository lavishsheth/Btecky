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
  const add = (rawTitle, rawUrl, context, earnedAt) => {
    const title = clean(rawTitle);
    if (title.length < 5 || title.length > 180) return;
    if (/^(google skills|credentials|completions|certifications)$/i.test(title)) return;
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
    found.set(key, { title, url, type, earnedAt: earnedAt || null });
  };

  // New Google Skills public profiles render credential cards without stable
  // "badge-card" class names. Walk the HTML element tree and identify the
  // smallest container that has a completion date, image and credential link.
  const tokens = html.match(/<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>|[^<]+/g) || [];
  const stack = [];
  const voidTags = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
  const datePattern = /(?:earned(?:\s+on)?|completed(?:\s+on)?)\s*:?\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sept?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4})/i;
  const parseEarnedDate = value => {
    const match = String(value || "").match(datePattern);
    if (!match) return null;
    const parsed = new Date(match[1].replace(/(\d{1,2})\s+(\d{4})$/, "$1, $2") + " 00:00:00 UTC");
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
  };
  const finishNode = node => {
    const date = parseEarnedDate(node.text);
    if (!date || !node.images.length || !node.links.length) return;
    const lines = node.text.split(/\s{2,}|\n/).map(clean).filter(Boolean)
      .filter(line => !datePattern.test(line) && !/^(learn more|view badge|share|completed|credentials?)$/i.test(line));
    const heading = node.headings.find(line => line.length >= 5 && !/^(google skills|credentials|completions|certifications)$/i.test(line));
    let title = heading || lines.find(line => line.length >= 5 && line.length <= 180 &&
      !/^(google skills|credentials|completions|certifications|learn more|view badge)$/i.test(line));
    if (!title) {
      const beforeDate = clean(node.text.split(datePattern)[0]);
      title = beforeDate.split(/learn more|view badge/i)[0].trim();
    }
    title = clean(title);
    if (!title || /^(google skills|credentials|completions|certifications)$/i.test(title)) return;
    const link = node.links.find(item => item.href && !/learn.?more|share/i.test(item.label)) || node.links[0];
    add(title, link && link.href, "public credential card " + node.context, date);
  };
  for (const token of tokens) {
    if (/^<!--|^<!/i.test(token)) continue;
    if (/^<\//.test(token)) {
      const tag = token.match(/^<\/\s*([\w:-]+)/);
      if (!tag) continue;
      const name = tag[1].toLowerCase();
      let node;
      while (stack.length) {
        node = stack.pop();
        finishNode(node);
        if (node.name === name) break;
        if (stack.length) {
          const parent = stack[stack.length - 1];
          parent.text += " " + node.text;
          parent.images.push(...node.images);
          parent.links.push(...node.links);
          parent.headings.push(...node.headings);
        }
      }
      if (stack.length && node && node.name === name) {
        const parent = stack[stack.length - 1];
        parent.text += " " + node.text;
        parent.images.push(...node.images);
        parent.links.push(...node.links);
        parent.headings.push(...node.headings);
      }
      continue;
    }
    if (/^</.test(token)) {
      const tag = token.match(/^<\s*([\w:-]+)/);
      if (!tag) continue;
      const name = tag[1].toLowerCase();
      const a = attrs(token);
      const node = { name, text: "", images: [], links: [], headings: [], context: [a.class,a.id,a["data-testid"],a["aria-label"]].filter(Boolean).join(" ") };
      if (name === "img" && a.alt) node.images.push(a.alt);
      if (name === "a") node.links.push({ href: a.href || "", label: "" });
      if (/^h[1-6]$/.test(name) && a["aria-label"]) node.headings.push(a["aria-label"]);
      if (!voidTags.has(name) && !/\/>$/.test(token)) stack.push(node);
      else if (stack.length) {
        const parent = stack[stack.length - 1];
        parent.images.push(...node.images);
        parent.links.push(...node.links);
      }
      continue;
    }
    if (stack.length) {
      const value = clean(token);
      if (value) {
        const node = stack[stack.length - 1];
        node.text += " " + value;
        if (node.name === "a" && node.links.length) node.links[node.links.length - 1].label += " " + value;
        if (/^h[1-6]$/.test(node.name)) node.headings.push(value);
      }
    }
  }
  while (stack.length) {
    const node = stack.pop();
    finishNode(node);
    if (stack.length) {
      const parent = stack[stack.length - 1];
      parent.text += " " + node.text;
      parent.images.push(...node.images);
      parent.links.push(...node.links);
      parent.headings.push(...node.headings);
    }
  }

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
    const earnedAt = parseEarnedDate(body.replace(/<[^>]*>/g, " "));
    const hasCredentialSignals = Boolean(earnedAt && imageAlt.length && /<a\\b/i.test(body));
    if (/badge|credential|achievement|award|course.?card|activity.?card|tile/i.test(context) || hasCredentialSignals) {
      const title = heading ? clean(heading[1]) : imageAlt[0];
      const linkTag = match[1].toLowerCase() === "a" ? match[2] : (body.match(/<a\\b([^>]*)>/i) || [])[1];
      const href = linkTag ? (attrs(linkTag).href || "") : "";
      add(title, href, context + " " + body.slice(0, 500), earnedAt);
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
