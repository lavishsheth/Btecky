/**
 * Apply the one canonical B Tecky header to every retained legacy HTML route.
 * Astro-rendered pages already use SiteHeader.astro and are left untouched.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(process.cwd(), 'dist');
const canonicalHeader = `<header class="site-header" id="site-header">
  <div class="site-header__inner">
    <a class="site-brand" href="/" aria-label="B Tecky home"><img src="/assets/images/btecky-logo.svg" width="44" height="44" alt="" fetchpriority="high"><span>B Tecky</span></a>
    <nav class="site-nav" id="primary-navigation" aria-label="Main navigation">
      <a class="site-nav__link" href="/">Home</a><a class="site-nav__link" href="/about">About</a>
      <div class="site-nav__item" data-menu="products"><a href="/#explore">Products</a><button class="site-nav__chevron" type="button" aria-label="Open Products menu" aria-expanded="false" aria-controls="mega-products"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4"/></svg></button><div class="mega-menu" id="mega-products" hidden><div class="mega-menu__grid">
        <a class="mega-card" href="/arcade"><span class="mega-card__icon">✦</span><span><b>Arcade Score Checker</b><small>Track your progress and scores</small></span><span class="mega-card__arrow">↗</span></a>
        <a class="mega-card" href="/arcade-calculator"><span class="mega-card__icon">＋</span><span><b>Points Calculator</b><small>Plan points and prize tiers</small></span><span class="mega-card__arrow">↗</span></a>
        <a class="mega-card" href="/playlists"><span class="mega-card__icon">▶</span><span><b>Learning Playlists</b><small>Curated video learning</small></span><span class="mega-card__arrow">↗</span></a>
      </div></div></div>
      <div class="site-nav__item" data-menu="blog"><a href="/blog">Blog</a><button class="site-nav__chevron" type="button" aria-label="Open Blog menu" aria-expanded="false" aria-controls="mega-blog"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4"/></svg></button><div class="mega-menu" id="mega-blog" hidden><div class="mega-menu__grid">
        <a class="mega-card" href="/blog"><span class="mega-card__icon">▤</span><span><b>All stories</b><small>Explore the B Tecky journal</small></span><span class="mega-card__arrow">↗</span></a>
        <a class="mega-card" href="/blog?type=tech"><span class="mega-card__icon">⌘</span><span><b>Tech guides</b><small>Practical explainers and tutorials</small></span><span class="mega-card__arrow">↗</span></a>
        <a class="mega-card" href="/blog?type=events"><span class="mega-card__icon">✳</span><span><b>Events &amp; opportunities</b><small>Challenges, events and opportunities</small></span><span class="mega-card__arrow">↗</span></a>
      </div></div></div>
      <div class="site-nav__item" data-menu="arcade"><a href="/arcade">Arcade</a><button class="site-nav__chevron" type="button" aria-label="Open Arcade menu" aria-expanded="false" aria-controls="mega-arcade"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4"/></svg></button><div class="mega-menu" id="mega-arcade" hidden><div class="mega-menu__grid">
        <a class="mega-card" href="/arcade"><span class="mega-card__icon">✦</span><span><b>Score Checker</b><small>Check your Arcade progress</small></span><span class="mega-card__arrow">↗</span></a>
        <a class="mega-card" href="/arcade-calculator"><span class="mega-card__icon">＋</span><span><b>Points Calculator</b><small>Estimate points and tiers</small></span><span class="mega-card__arrow">↗</span></a>
        <a class="mega-card" href="/playlists"><span class="mega-card__icon">▶</span><span><b>Learning Playlists</b><small>Learn with curated videos</small></span><span class="mega-card__arrow">↗</span></a>
      </div></div></div>
      <a class="site-nav__link" href="/arcade-calculator">Calculator</a><a class="site-nav__link" href="/playlists">Playlists</a><a class="site-nav__link" href="/partners">Partners</a><a class="site-nav__link" href="/contact">Contact</a>
      <a class="site-nav__mobile-cta" href="/contact">Let's talk <span>↗</span></a>
    </nav>
    <div class="site-tools"><button class="site-tool" type="button" data-search-open aria-label="Search B Tecky" title="Search (Ctrl K)"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></button><button class="site-tool" type="button" data-updates-toggle aria-label="What's new" aria-expanded="false" aria-controls="site-updates"><svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span class="site-tool__dot"></span></button><button class="site-tool" type="button" data-theme-toggle aria-label="Switch theme"><svg class="theme-icon theme-icon--sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg><svg class="theme-icon theme-icon--moon" viewBox="0 0 24 24"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/></svg></button></div>
    <a class="site-header__cta" href="/contact" data-magnetic>Let's talk <span>↗</span></a>
    <button class="site-menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-navigation" data-mobile-toggle><span></span><span></span><span></span></button>
  </div>
  <div class="site-updates" id="site-updates" hidden><div class="site-updates__head"><div><span class="site-updates__eyebrow">THE LATEST</span><h2>What's new</h2></div><button type="button" data-updates-close aria-label="Close updates">×</button></div><div class="site-updates__list" data-updates-list><p>Loading the latest from B Tecky…</p></div><a class="site-updates__all" href="/blog">Explore all updates <span>↗</span></a></div>
</header>
<dialog class="site-search" data-search-dialog aria-label="Search B Tecky"><div class="site-search__panel"><div class="site-search__top"><div class="site-search__input-wrap"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input type="search" data-search-input placeholder="Search blogs, products, tools…" autocomplete="off" aria-label="Search B Tecky"><kbd>ESC</kbd></div><button type="button" class="site-search__close" data-search-close aria-label="Close search">×</button></div><p class="site-search__hint">SEARCH THE B TECKY LIBRARY</p><div class="site-search__results" data-search-results aria-live="polite"><a href="/blog"><span class="site-search__result-icon">▤</span><span><b>Browse the journal</b><small>Explore all technology guides and updates</small></span><span>↗</span></a></div><div class="site-search__foot"><span>↑ ↓ to navigate</span><span>ENTER to open</span><span>ESC to close</span></div></div></dialog><div class="site-scroll-progress" aria-hidden="true"><span data-scroll-progress></span></div>`;

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
  });
}
const htmlFiles = walk(root);
let replaced = 0;
for (const path of htmlFiles) {
  let html = readFileSync(path, 'utf8');
  if (html.includes('id="site-header"') && html.includes('site-search')) continue;
  const headerBlocks = [...html.matchAll(/<header\\b[^>]*>[\\s\\S]*?<\\/header>/gi)];
  const brandHeader = headerBlocks.find((match) =>
    /class=["'][^"']*\\bbrand\\b/.test(match[0]) && /href=["']\\//.test(match[0])
  );
  if (brandHeader) {
    html = html.replace(brandHeader[0], canonicalHeader);
  } else if (!/<header[^>]*id=["']site-header["']/.test(html)) {
    html = html.replace(/<body\\b[^>]*>/i, (bodyTag) => bodyTag + canonicalHeader);
  } else {
    continue;
  }
  if (!html.includes('/assets/css/site-header.css')) {
    html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="/assets/css/site-header.css"></head>');
  }
  if (!html.includes('/assets/js/site-header.js')) {
    html = html.replace(/<\/body>/i, '<script src="/assets/js/site-header.js" defer></script></body>');
  }
  writeFileSync(path, html);
  replaced++;
}
console.log(`Applied the shared B Tecky header to ${replaced} legacy HTML pages (Astro pages use SiteHeader.astro).`);
