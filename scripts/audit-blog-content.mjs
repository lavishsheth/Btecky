import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const cataloguePath = resolve('blog/posts.json');
if (!existsSync(cataloguePath)) {
  console.error('Could not find blog/posts.json. Run this command from the repository root.');
  process.exit(1);
}

const catalogue = JSON.parse(readFileSync(cataloguePath, 'utf8'));
const posts = (catalogue.posts || []).filter((post) => post.status !== 'draft');
const words = (value = '') => String(value).replace(/\`[^\`]*\`/g, ' ').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean);
const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const titleCounts = new Map();
const summaryCounts = new Map();
for (const post of posts) {
  const title = normalize(post.title);
  const summary = normalize(post.summary);
  titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
  if (summary) summaryCounts.set(summary, (summaryCounts.get(summary) || 0) + 1);
}

const findings = posts.map((post) => {
  const bodyWords = words(post.body).length;
  const summaryWords = words(post.summary).length;
  const issues = [];
  if (!post.title || !post.slug) issues.push('missing title or slug');
  if (!post.summary || summaryWords < 12) issues.push('missing or very short summary');
  if (!post.body || bodyWords < 300) issues.push(`very short body (${bodyWords} words)`);
  else if (bodyWords < 600) issues.push(`short body; editorial review recommended (${bodyWords} words)`);
  if (words(post.body).filter((word) => /^https?:\/\//i.test(word)).length === 0) {
    issues.push('no visible external references; verify sources or explain original basis');
  }
  if ((titleCounts.get(normalize(post.title)) || 0) > 1) issues.push('duplicate title');
  if ((summaryCounts.get(normalize(post.summary)) || 0) > 1) issues.push('duplicate summary');
  if (/apply now|register now|hurry up|free swag|win .* for free/i.test(post.title || '') &&
      !/(deadline|eligib|official|terms|verified|updated)/i.test(post.body || '')) {
    issues.push('time-sensitive opportunity: verify eligibility, deadline, official terms and current status');
  }
  return { post, bodyWords, summaryWords, issues };
});

const flagged = findings.filter((item) => item.issues.length);
const categories = [...new Set(posts.flatMap((post) => post.tags || []))].sort((a,b) => a.localeCompare(b));
const report = [
  '# B Tecky blog content quality audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '> This is an editorial triage report, not a Google policy test or an AdSense approval prediction. Word-count bands are internal review signals only; Google does not publish a minimum article length.',
  '',
  '## Catalogue overview',
  '',
  `- Published posts reviewed: **${posts.length}**`,
  `- Drafts excluded: **${(catalogue.posts || []).length - posts.length}**`,
  `- Posts flagged for human review: **${flagged.length}**`,
  `- Topic labels: **${categories.length}**`,
  '',
  '## Priority review list',
  '',
  '| Article | Words | Editorial flags |',
  '|---|---:|---|',
  ...flagged.sort((a,b) => a.bodyWords - b.bodyWords).map(({post,bodyWords,issues}) =>
    `| [${String(post.title || post.slug).replace(/\|/g,'\\|')}](https://www.btecky.tech/blog/${post.slug}) | ${bodyWords} | ${issues.join('; ').replace(/\|/g,'\\|')} |`),
  '',
  '## Category cleanup candidates',
  '',
  'Review near-duplicate labels and consolidate them only when the articles genuinely cover the same subject. Do not merge categories solely to reduce their count.',
  '',
  categories.map((category) => `- ${category}`).join('\n'),
  '',
  '## Human review checklist',
  '',
  '- Does the article answer a specific reader question with enough detail to act?',
  '- Are examples, commands, code, calculations and claims correct for the versions named?',
  '- Are external claims linked to authoritative primary sources where possible?',
  '- Does the article add original explanation, experience, comparison, testing or practical context?',
  '- Is time-sensitive information dated and checked against the organizer or vendor source?',
  '- Is the page distinct from other B Tecky articles, or should the overlapping pages be consolidated?',
  '- Are links, images, code blocks and interactive examples working and accessible?',
  '- Would a reader still find the page useful if search traffic and advertising were not involved?',
  '',
  '## Important',
  '',
  'Do not automatically delete or noindex flagged articles. Review each page, then improve, consolidate, update, or remove it based on its actual usefulness and accuracy. Do not inflate articles with filler to cross a word threshold.',
  ''
].join('\n');

console.log(`Audited ${posts.length} published posts; ${flagged.length} flagged for editorial review.`);
console.log(flagged.slice(0, 20).map(({post,bodyWords,issues}) => `- ${post.slug}: ${bodyWords} words — ${issues.join('; ')}`).join('\n'));
if (process.argv.includes('--write')) {
  const outputPath = resolve('reports/blog-content-audit.md');
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, report);
  console.log(`Wrote ${outputPath}`);
}
