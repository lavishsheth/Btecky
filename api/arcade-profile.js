// Read-only public Google Skills profile fetcher for the B Tecky Arcade calculator.
// No API key, Google login, cookies, or credentials are used.
const PROFILE_HOSTS = new Set(["skills.google", "www.skills.google", "www.cloudskillsboost.google", "cloudskillsboost.google"]);
const clean = value => String(value || "").replace(/<(?:img|meta|a|div|span)[^>]*\\b(?:alt|aria-label|title)=["']([^"']+)["'][^>]*>/gi, " $1 ").replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/\\s+/g, " ").trim();
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
  // Public profile pages expose badge names through their visible card titles and links.
  const patterns = [
    /<(?:a|div|article)[^>]*(?:class|aria-label|title)=["'][^"']*(?:badge|achievement|credential)[^"']*["'][^>]*>([\s\S]{0,1800}?)<\/(?:a|div|article)>/gi,
    /<a[^>]+href=["']([^"']*(?:course_templates|public_profiles|badges)[^"']*)["'][^>]*>([\s\S]{0,1200}?)<\/a>/gi
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      const href = m.length > 2 && m[2] !== undefined ? m[1] : "";
      const body = m.length > 2 && m[2] !== undefined ? m[2] : m[1];
      const title = clean(body.replace(/<svg[\s\S]*?<\/svg>/gi," ").replace(/<script[\s\S]*?<\/script>/gi," "));
      if (title.length < 5 || title.length > 180 || /^(view|share|completed|badge|skills)$/i.test(title)) continue;
      const key = title.toLowerCase();
      if (!found.has(key)) {
        let url = "";
        if (href) { try { const parsed = new URL(href, base); if (parsed.protocol === "https:" && PROFILE_HOSTS.has(parsed.hostname)) url = parsed.toString(); } catch (_) {} }
        found.set(key,{title,url,type:/skill badge/i.test(body)?"skill":/arcade|game badge|trivia|sprint|certification zone/i.test(body)?"game":"other"});
      }
    }
  }
  // Also inspect structured data, which is more stable than styling classes.
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of jsonLd) {
    try {
      const parsed = JSON.parse(block[1]);
      const visit = value => {
        if (!value || typeof value !== "object") return;
        if (Array.isArray(value)) return value.forEach(visit);
        const title = value.name || value.headline || value.title;
        if (typeof title === "string" && /badge|arcade|cloud|google|skill|game|trivia/i.test(title)) {
          const key = clean(title).toLowerCase();
          if (!found.has(key)) found.set(key,{title:clean(title),url:typeof value.url==="string"?value.url:"",type:/skill badge/i.test(JSON.stringify(value))?"skill":/arcade|game badge|trivia|sprint|certification zone/i.test(JSON.stringify(value))?"game":"other"});
        }
        Object.values(value).forEach(visit);
      };
      visit(parsed);
    } catch (_) {}
  }
  return [...found.values()];
}
module.exports = async (req,res) => {
  if (req.method !== "POST") return res.status(405).json({error:"Method not allowed."});
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const profileUrl = safeProfileUrl(body.url);
    let target=profileUrl,response;
    for(let hop=0;hop<4;hop++){ response=await fetch(target,{headers:{"User-Agent":"BTecky-ArcadeCalculator/1.0 (+https://btecky.tech)","Accept":"text/html,application/xhtml+xml"},redirect:"manual"}); if(response.status>=300&&response.status<400){const loc=response.headers.get("location");if(!loc)break;const next=new URL(loc,target);if(next.protocol!=="https:"||!PROFILE_HOSTS.has(next.hostname))return res.status(400).json({error:"The profile redirected to an unsupported host."});target=next.toString();continue;}break;}
    if (!response.ok) return res.status(response.status===404?404:502).json({error:response.status===404?"Profile not found. Check that it is public and the URL is correct.":"Google Skills could not return this profile right now. Try again later."});
    const finalUrl = new URL(target);
    if (finalUrl.protocol!=="https:" || !PROFILE_HOSTS.has(finalUrl.hostname)) return res.status(400).json({error:"The profile URL redirected to an unsupported host."});
    const html = await response.text();
    if (html.length > 8_000_000) return res.status(502).json({error:"The public profile response was too large to analyse."});
    const nameMatch = html.match(/<meta[^>]+(?:property|name)=["'](?:og:title|twitter:title)["'][^>]+content=["']([^"']+)/i) || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const badges = extractBadges(html,finalUrl.toString());
    res.setHeader("Cache-Control","public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({profileUrl:profileUrl,name:nameMatch?clean(nameMatch[1]):"Google Skills learner",badges,source:"public-profile",fetchedAt:new Date().toISOString(),notice:badges.length?"Badge entries extracted from the public profile page.":"The page loaded, but no badge cards could be confidently extracted."});
  } catch (error) {
    return res.status(400).json({error:error.message || "Unable to analyse this profile."});
  }
};