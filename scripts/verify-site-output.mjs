import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const required = [
  'index.html',
  '404.html',
  'about/index.html',
  'partners/index.html',
  'contact/index.html',
  'terms/index.html',
  'playlists/index.html',
  'write-lavii-9f21k2/index.html',
  'blog/index.html',
  'blog/posts.json',
  'arcade.html',
  'arcade-calculator.html',
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
];
const missing = required.filter((path) => !existsSync(join(dist, path)));
if (missing.length) {
  console.error('Missing required site output:', missing.join(', '));
  process.exitCode = 1;
} else {
  const ads = readFileSync(join(dist, 'ads.txt'), 'utf8');
  if (!/^google\\.com,\\s*pub-\\d+,\\s*DIRECT,\\s*[a-f0-9]{16}$/m.test(ads)) {
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
