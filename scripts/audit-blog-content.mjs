import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const input = resolve('blog/posts.json');
if (!existsSync(input)) { console.error('Missing blog/posts.json'); process.exit(1); }
const catalogue = JSON.parse(readFileSync(input, 'utf8'));
const posts = (catalogue.posts || []).filter((post) => post.status !== 'draft');
const words = (value = '') => String(value).replace(/`[^`]*`/g, ' ').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const titleCounts = new Map();
for (const post of posts) { const key = normalize(post.title); titleCounts.set(key, (titleCounts.get(key) || 0) + 1); }
const findings = posts.map((post) => {
  const body = String(post.body || ''); const count = words(body); const issues = [];
  if (!post.title || !post.slug) issues.push('Missing title or slug');
  if (!post.summary || words(post.summary) < 12) issues.push('Missing or short summary');
  if (count < 300) issues.push('Very short body (' + count + ' words)'); else if (count < 600) issues.push('Short body; review usefulness (' + count + ' words)');
  if (!/https?:\/\//i.test(body) && !/\[[^\]]+\]\((https?:\/\/|\/)/i.test(body)) issues.push('No source link detected');
  if ((titleCounts.get(normalize(post.title)) || 0) > 1) issues.push('Duplicate title');
  if (post.contentType === 'events' && !post.updatedAt) issues.push('Opportunity needs a checked update date');
  if (post.contentType === 'events' && !/(deadline|eligib|official|terms|verified|updated|subject to|not guaranteed)/i.test(body)) issues.push('Opportunity terms need review');
  if (!post.cover && !post.videoThumbnail) issues.push('No cover/thumbnail');
  return { slug: post.slug, title: post.title, words: count, type: post.contentType || 'unclassified', date: post.date || '', issues };
});
const report = { generatedAt: new Date().toISOString(), totalPublished: posts.length, flaggedCount: findings.filter((item) => item.issues.length).length, findings };
console.log('Audited ' + posts.length + ' published posts; ' + report.flaggedCount + ' need editorial review.');
if (process.argv.includes('--write')) {
  const output = resolve('reports/blog-content-audit.json'); mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(report, null, 2) + '\n'); console.log('Wrote ' + output);
}