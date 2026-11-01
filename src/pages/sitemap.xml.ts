import catalogue from '../../blog/posts.json';

export function GET() {
  const origin = 'https://btecky-sigma.vercel.app';
  const staticPaths = ['/', '/about/', '/contact/', '/terms/', '/playlists/', '/arcade.html', '/arcade-calculator.html', '/arcade/guide/', '/blog/'];
  const articlePaths = catalogue.posts
    .filter((post) => post.status !== 'draft' && post.slug)
    .map((post) => `/blog/${post.slug}/`);
  const urls = [...new Set([...staticPaths, ...articlePaths])];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
