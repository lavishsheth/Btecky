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
const flagged = findings.filter((item) => item.issues.length);
const categories = [...new Set(posts.flatMap((post) => post.tags || []))].sort();
const countIssue = (text) => findings.filter((item) => item.issues.some((issue) => issue.includes(text))).length;
const markdown = [
  '# B Tecky content quality audit', '', 'Generated: ' + new Date().toISOString(), '',
  '> Automated editorial triage only. This is not a factual accuracy, originality, policy-compliance or AdSense eligibility verdict. Word-count bands are internal signals, not Google requirements.', '',
  '## Catalogue overview', '',
  '- Published posts reviewed: **' + posts.length + '**',
  '- Opportunity announcements: **' + posts.filter((post) => post.contentType === 'events').length + '**',
  '- Posts with one or more review flags: **' + flagged.length + '**',
  '- Under 300 words: **' + countIssue('Very short body') + '**',
  '- Under 600 words: **' + findings.filter((item) => item.words < 600).length + '**',
  '- No source link detected: **' + countIssue('No source link') + '**',
  '- Opportunities needing a checked update date: **' + countIssue('checked update date') + '**',
  '- Topic labels: **' + categories.length + '**', '',
  '## Priority review list', '', '| Article | Words | Type | Editorial flags |', '|---|---:|---|---|',
  ...flagged.sort((a, b) => a.words - b.words).map((item) => '| [' + String(item.title || item.slug).replace(/\|/g, '\\|') + '](https://www.btecky.tech/blog/' + item.slug + '/) | ' + item.words + ' | ' + item.type + ' | ' + item.issues.join('; ').replace(/\|/g, '\\|') + ' |'),
  '', '## Human review checklist', '',
  '- Does the page answer a specific reader question with enough detail to act?',
  '- Are claims, code, commands, calculations and version-specific details correct?',
  '- Are external claims linked to primary documentation, official announcements or original research?',
  '- Does the article add original explanation, testing, comparison, examples or practical context?',
  '- Are opportunities checked against the organizer/employer page, with eligibility, deadline, geography and reward conditions stated?',
  '- Are older opportunity pages clearly marked as potentially expired or updated after checking?',
  '- Are similar articles genuinely distinct, or should they be consolidated with redirects?',
  '- Do images, links, code samples, interactive examples and mobile layouts work?',
  '- Would the page remain useful if it received no search traffic or advertising?', '',
  '## Handling findings', '',
  'Do not automatically delete, noindex or expand flagged articles. Review each page. Improve useful pages with real examples and primary sources; consolidate overlapping pages with redirects; clearly mark expired opportunities; remove or noindex pages only after editorial review. Never add filler to reach a word count.', '',
  '## Topic labels', '', ...categories.map((category) => '- ' + category), ''
].join('\\n');
const report = { generatedAt: new Date().toISOString(), totalPublished: posts.length, flaggedCount: flagged.length, findings };
console.log('Audited ' + posts.length + ' published posts; ' + flagged.length + ' need editorial review.');
if (process.argv.includes('--write')) {
  const markdownPath = resolve('reports/blog-content-audit.md');
  const jsonPath = resolve('reports/blog-content-audit.json');
  mkdirSync(dirname(markdownPath), { recursive: true });
  writeFileSync(markdownPath, markdown + '\\n');
  writeFileSync(jsonPath, JSON.stringify(report, null, 2) + '\\n');
  console.log('Wrote ' + markdownPath + ' and ' + jsonPath);
}