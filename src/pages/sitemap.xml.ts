import catalogue from '../../blog/posts.json';
import { courses } from '../data/learn/courses';

const origin = 'https://www.btecky.tech';

export function GET() {
  const staticPaths = [
    '/', '/about/', '/contact/', '/terms/', '/playlists/',
    '/arcade.html', '/arcade-calculator.html', '/skill-badges/',
    '/privacy/', '/cookies/', '/advertising/', '/disclaimer/',
    '/editorial-policy/', '/blog/', '/learn/', '/learn/paths/', '/learn/practice/',
  ];
  const staticUrls = [...new Set(staticPaths)].map((path) => `  <url><loc>${origin}${path}</loc></url>`);
  const articleUrls = catalogue.posts
    .filter((post) => post.status !== 'draft' && post.slug)
    .map((post) => {
      const lastmod = post.updatedAt || post.date;
      const lastmodTag = lastmod && /^\d{4}-\d{2}-\d{2}$/.test(lastmod) ? `<lastmod>${lastmod}</lastmod>` : '';
      return `  <url><loc>${origin}/blog/${encodeURIComponent(post.slug)}/</loc>${lastmodTag}</url>`;
    });
  const learnUrls = courses.flatMap((course) => [
    `  <url><loc>${origin}/learn/${course.slug}/</loc></url>`,
    ...course.lessons.flatMap((lesson) => [\n      `  <url><loc>${origin}/learn/${course.slug}/${lesson.slug}/</loc></url>`,\n      `  <url><loc>${origin}/learn/${course.slug}/${lesson.slug}/project/</loc></url>`,\n    ]),
  ]);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrls, ...articleUrls, ...learnUrls].join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
