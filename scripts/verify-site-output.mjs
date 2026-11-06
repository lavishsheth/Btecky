import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const required = [
  'index.html',
  '404.html',
  'about/index.html',
  'privacy/index.html',
  'terms/index.html',
  'cookies/index.html',
  'advertising/index.html',
  'disclaimer/index.html',
  'partners/index.html',
  'contact/index.html',
  'playlists/index.html',
  'write-lavii-9f21k2/index.html',
  'blog/index.html',
  'blog/posts.json',
  'arcade.html',
  'arcade-calculator.html',
  'arcade-calculator.js',
  'skill-badges/index.html',
  'style.css',
  'additions.css',
  'data.js',
  'config.js',
  'site.js',
  'community.js',
  'channel.js',
  'dynamic-posts.js',
  'posts.js',
  'assets/js/playlists.js',
  'assets/js/studio-enhancements.js',
  'robots.txt',
  'ads.txt',
  'sitemap.xml',
  'editorial-policy/index.html',
];
const missing = required.filter((path) => !existsSync(join(dist, path)));
if (missing.length) {
  console.error('Missing required site output:', missing.join(', '));
  process.exitCode = 1;
} else {
  const homepage = readFileSync(join(dist, 'index.html'), 'utf8');
  const footerOf = (html) => html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0]?.replace(/\s+/g, ' ').trim() || '';
  const headerOf = (html) => html.match(/<header class="site-header" id="site-header">[\s\S]*?<\/header>/)?.[0]?.replace(/\s+/g, ' ').trim() || '';
  const expectedFooter = footerOf(homepage);
  const expectedHeader = headerOf(homepage);
  const arcadePages = ['arcade.html', 'arcade-calculator.html'];
  const footerMismatches = arcadePages.filter((path) => {
    const file = join(dist, path);
    return !existsSync(file) || !expectedFooter || footerOf(readFileSync(file, 'utf8')) !== expectedFooter;
  });
  const headerMismatches = arcadePages.filter((path) => {
    const file = join(dist, path);
    if (!existsSync(file)) return true;
    const html = readFileSync(file, 'utf8');
    return !expectedHeader || headerOf(html) !== expectedHeader ||
      !html.includes('/assets/css/site-header.css') ||
      !html.includes('/assets/js/site-header.js') ||
      /<header class="site-head"/.test(html);
  });
  if (headerMismatches.length) {
    console.error('Arcade pages do not use the exact homepage navigation:', headerMismatches.join(', '));
    process.exitCode = 1;
  }
  if (footerMismatches.length) {
    console.error('Arcade pages do not share the exact homepage footer:', footerMismatches.join(', '));
    process.exitCode = 1;
  }
  const adCodePages = ['index.html', 'about/index.html', 'arcade.html', 'arcade-calculator.html', 'blog/index.html'];
  const missingAdCode = adCodePages.filter((path) => {
    const html = readFileSync(join(dist, path), 'utf8');
    return !html.includes('name="google-adsense-account"') ||
      !html.includes('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2101092613299647');
  });
  if (missingAdCode.length) {
    console.error('AdSense account code is missing from generated pages:', missingAdCode.join(', '));
    process.exitCode = 1;
  }
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  if (!robots.includes('https://www.btecky.tech/sitemap.xml') || !sitemap.includes('https://www.btecky.tech/')) {
    console.error('Robots.txt or sitemap.xml does not use the canonical production domain.');
    process.exitCode = 1;
  }
  const ads = readFileSync(join(dist, 'ads.txt'), 'utf8');
  if (!/^google\.com,\s*pub-\d+,\s*DIRECT,\s*[a-f0-9]{16}$/m.test(ads)) {
    console.error('ads.txt is present but its Google publisher record is invalid or missing.');
    process.exitCode = 1;
  }
  const catalogue = JSON.parse(readFileSync(join(root, 'blog/posts.json'), 'utf8'));
  const publicPosts = catalogue.posts.filter((post) => post.status !== 'draft');
  const missingArticles = publicPosts
    .filter((post) => !existsSync(join(dist, 'blog', post.slug, 'index.html')))
    .map((post) => post.slug);
  if (missingArticles.length) {
    console.error('Missing generated article routes:', missingArticles.join(', '));
    process.exitCode = 1;
  } else {
    console.log(`Site output verified: ${required.length} required paths and ${publicPosts.length} article routes present.`);
  }
}
