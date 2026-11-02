/**
 * Preserve the original B Tecky site while Astro routes are migrated.
 * Astro owns generated routes (notably / and /blog); this copies legacy
 * pages, assets and data into dist without overwriting generated files.
 */
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const output = join(root, 'dist');
const legacyPaths = [
  'about', 'partners', 'contact', 'terms', 'playlists',
  'write-lavii-9f21k2', 'blog', 'assets', 'snippets',
  'style.css', 'additions.css', 'data.js', 'config.js', 'site.js', 'community.js',
  'channel.js', 'dynamic-posts.js', 'posts.js',
  'arcade.js', 'arcade-calculator.js', 'arcade-calc.js', 'arcade-catalog.js', 'arcade-rules.js',
  'blog.html', 'arcade.html', 'arcade-calculator.html',
  'privacy.html', 'robots.txt', 'sitemap.xml', 'sitemap-additions.xml', 'ads.txt',
];

mkdirSync(output, { recursive: true });
let copied = 0;
for (const relative of legacyPaths) {
  const source = join(root, relative);
  if (!existsSync(source)) continue;
  const destination = join(output, relative);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, {
    recursive: true,
    force: false,
    errorOnExist: false,
    dereference: false,
  });
  copied += 1;
}
console.log(`Preserved ${copied} legacy paths in dist (generated Astro files take precedence).`);
