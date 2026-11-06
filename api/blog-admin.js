// B Tecky blog admin API. Shared-secret admin check; GitHub PAT remains server-side.
const OWNER = process.env.GITHUB_OWNER || 'lavishsheth';
const REPO = process.env.GITHUB_REPO || 'Btecky';
const BRANCH = 'main'; // Blog Studio publishes directly to the production catalogue on main
const API = 'https://api.github.com';

const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[ch]));

function safeUrl(value) {
  const url = String(value || '').trim();
  return /^(https?:\/\/|mailto:|\/|#)/i.test(url) && !/^\/\//.test(url) ? url : '';
}

function inlineMarkdown(source) {
  let text = esc(source);
  const code = [], images = [], links = [], rawLinks = [];
  text = text.replace(/\x60([^\x60]+)\x60/g, (_, value) => {
    const key = '\u0000CODE' + code.length + '\u0000';
    code.push('<code>' + value + '</code>');
    return key;
  });
  text = text.replace(/!\[([^\]]*)\]\(([^ )]+)(?:\s+"([^"]*)")?\)/g, (_, alt, rawUrl, caption) => {
    const key = '\u0000IMAGE' + images.length + '\u0000';
    const url = safeUrl(rawUrl);
    images.push(url ? '<figure><img src="' + url + '" alt="' + alt + '" loading="lazy" decoding="async">' +
      (caption ? '<figcaption>' + caption + '</figcaption>' : '') + '</figure>' : alt);
    return key;
  });
  text = text.replace(/\[([^\]]+)\]\(([^ )]+)(?:\s+"([^"]*)")?\)/g, (_, label, rawUrl) => {
    const key = '\u0000LINK' + links.length + '\u0000';
    const url = safeUrl(rawUrl);
    links.push(url ? '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>' : label);
    return key;
  });
  text = text.replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g, (_, prefix, url) => {
    const key = '\u0000RAWLINK' + rawLinks.length + '\u0000';
    const clean = url.replace(/[),.]+$/, '');
    rawLinks.push('<a href="' + clean + '" target="_blank" rel="noopener noreferrer">' + clean + '</a>' + url.slice(clean.length));
    return prefix + key;
  });
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>');
  text = text.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => code[Number(index)])
    .replace(/\u0000IMAGE(\d+)\u0000/g, (_, index) => images[Number(index)])
    .replace(/\u0000LINK(\d+)\u0000/g, (_, index) => links[Number(index)])
    .replace(/\u0000RAWLINK(\d+)\u0000/g, (_, index) => rawLinks[Number(index)]);
  return text;
}

function splitTableRow(line) {
  let value = String(line || '').trim();
  if (value.startsWith('|')) value = value.slice(1);
  if (value.endsWith('|')) value = value.slice(0, -1);
  return value.split(/(?<!\\)\|/).map(cell => cell.replace(/\\\|/g, '|').trim());
}
function isTableDivider(line) {
  return splitTableRow(line).every(cell => /^:?-{3,}:?$/.test(cell.replace(/\s/g, '')));
}

function renderMarkdown(source) {
  const lines = String(source || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const blockStart = line => /^ {0,3}(\x60{3,}|~~~|#{1,6}\s|>|[-*_]{3,}\s*$)/.test(line) ||
    /^ {0,3}([-+*]|\d+[.)])\s+/.test(line);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    const callout = line.match(/^\s*:::(info|tip|warning|takeaway)(?:\s+(.+))?\s*$/i);
    if (callout) {
      const kind = callout[1].toLowerCase();
      const heading = callout[2] ? '<strong class="publication-callout-title">' + inlineMarkdown(callout[2]) + '</strong>' : '';
      i++;
      const content = [];
      while (i < lines.length && !/^\s*:::\s*$/.test(lines[i])) { content.push(lines[i]); i++; }
      if (i < lines.length) i++;
      const icons = {info:'i',tip:'✓',warning:'!',takeaway:'★'};
      out.push('<aside class="publication-callout publication-callout--' + kind + '"><span class="publication-callout-icon" aria-hidden="true">' + icons[kind] + '</span><div class="publication-callout-content">' + heading + renderMarkdown(content.join('\n')) + '</div></aside>');
      continue;
    }

    const fence = line.match(/^ {0,3}(\x60{3,}|~~~)\s*([a-zA-Z0-9+#._-]*)\s*$/);
    if (fence) {
      const marker = fence[1][0], language = fence[2] || '';
      i++;
      const code = [];
      while (i < lines.length && !new RegExp('^ {0,3}' + marker + '{3,}\\s*$').test(lines[i])) {
        code.push(lines[i]); i++;
      }
      if (i < lines.length) i++;
      out.push('<pre><code' + (language ? ' class="language-' + esc(language) + '"' : '') + '>' +
        esc(code.join('\n')) + '</code></pre>');
      continue;
    }

    const heading = line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const level = heading[1].length;
      out.push('<h' + level + '>' + inlineMarkdown(heading[2]) + '</h' + level + '>');
      i++; continue;
    }
    if (/^ {0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      out.push('<hr>'); i++; continue;
    }
    if (/^ {0,3}>/.test(line)) {
      const quote = [];
      while (i < lines.length && /^ {0,3}>/.test(lines[i])) {
        quote.push(lines[i].replace(/^ {0,3}>\s?/, '')); i++;
      }
      out.push('<blockquote>' + renderMarkdown(quote.join('\n')) + '</blockquote>');
      continue;
    }

    if (i + 1 < lines.length && line.includes('|') && isTableDivider(lines[i + 1])) {
      const headers = splitTableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
        rows.push(splitTableRow(lines[i])); i++;
      }
      out.push('<div class="publication-table-wrap"><table><thead><tr>' +
        headers.map(cell => '<th scope="col">' + inlineMarkdown(cell) + '</th>').join('') +
        '</tr></thead><tbody>' + rows.map(row => '<tr>' + headers.map((_, index) =>
          '<td>' + inlineMarkdown(row[index] || '') + '</td>').join('') + '</tr>').join('') +
        '</tbody></table></div>');
      continue;
    }

    const listMatch = line.match(/^(\s*)([-+*]|\d+[.)])\s+(.+)$/);
    if (listMatch) {
      const ordered = /^\d/.test(listMatch[2]);
      const items = [];
      while (i < lines.length) {
        const current = lines[i].match(/^(\s*)([-+*]|\d+[.)])\s+(.+)$/);
        if (!current || /^\d/.test(current[2]) !== ordered) break;
        items.push('<li>' + inlineMarkdown(current[3]) + '</li>'); i++;
      }
      out.push('<' + (ordered ? 'ol' : 'ul') + '>' + items.join('') + '</' + (ordered ? 'ol' : 'ul') + '>');
      continue;
    }

    if (/^(    |\t)/.test(line)) {
      const code = [];
      while (i < lines.length && (/^(    |\t)/.test(lines[i]) || !lines[i].trim())) {
        code.push(lines[i].replace(/^(    |\t)/, '')); i++;
      }
      out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
      continue;
    }

    const paragraph = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !blockStart(lines[i]) &&
      !(i + 1 < lines.length && lines[i].includes('|') && isTableDivider(lines[i + 1]))) {
      paragraph.push(lines[i].trim()); i++;
    }
    out.push('<p>' + inlineMarkdown(paragraph.join(' ')) + '</p>');
  }
  return out.join('\n');
}

function coverSvg(post) {
  const title = esc(post.title).replace(/&amp;/g, '&amp;');
  const category = esc((post.tags || [])[0] || 'Technology');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#101a3a"/><stop offset=".72" stop-color="#2456ff"/></linearGradient></defs>' +
    '<rect width="1200" height="675" rx="28" fill="url(#g)"/><rect x="42" y="42" width="310" height="44" rx="22" fill="#ffcf3f"/>' +
    '<text x="62" y="71" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#101a3a">' + category + '</text>' +
    '<text x="42" y="180" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#fff">' + title.slice(0,62) + '</text>' +
    '<text x="42" y="620" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#fff">B TECKY · FIELD NOTES</text></svg>';
}

function article(post) {
  const videoMatch = String(post.videoUrl || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  const videoId = videoMatch ? videoMatch[1] : '';
  const title = esc(post.title), summary = esc(post.summary || ''), slug = esc(post.slug);
  const seoTitle = esc(post.seoTitle || post.title);
  const seoDescription = esc(post.seoDescription || post.summary || '').slice(0,300);
  const category = esc((post.tags || ['Technology'])[0] || 'Technology');
  const date = String(post.date || new Date().toISOString().slice(0,10));
  const updated = String(post.updatedAt || post.updated || date).slice(0,10);
  const author = esc(post.author || 'Lavish Sheth');
  const coverAlt = esc(post.coverAlt || post.title);
  const cover = esc(post.videoThumbnail || (videoId ? 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg' : (post.cover || '/assets/images/blog-covers/' + post.slug + '.svg')));
  const canonical = '/blog/' + slug + '.html';
  const minutes = Math.max(1,Math.ceil(String(post.body || '').trim().split(/\s+/).filter(Boolean).length/210));
  const jsonLd = JSON.stringify({
    '@context':'https://schema.org','@type':'Article',headline:post.title,description:post.summary || '',
    image:cover,datePublished:date,dateModified:updated,
    author:{'@type':'Person',name:post.author || 'Lavish Sheth'},
    publisher:{'@type':'Organization',name:'B Tecky'},
    mainEntityOfPage:{'@type':'WebPage','@id':canonical}
  }).replace(/</g,'\\u003c');
  const video = videoId
    ? '<section class="publication-video"><h2>Watch the video</h2><div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/' +
      esc(videoId) + '?rel=0" title="' + title + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>' +
      '<p><a href="https://www.youtube.com/watch?v=' + esc(videoId) + '" target="_blank" rel="noopener noreferrer">Open video on YouTube ↗</a></p></section>' : '';
  return [
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>' + seoTitle + ' | B Tecky</title><meta name="description" content="' + seoDescription + '">',
    '<meta name="theme-color" content="#101a3a"><meta name="robots" content="index,follow">',
    '<meta property="og:type" content="article"><meta property="og:site_name" content="B Tecky"><meta property="og:title" content="' + seoTitle + '">',
    '<meta property="og:description" content="' + seoDescription + '"><meta property="og:image" content="' + cover + '">',
    '<meta property="article:published_time" content="' + esc(date) + '"><meta property="article:modified_time" content="' + esc(updated) + '">',
    '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + seoTitle + '"><meta name="twitter:description" content="' + seoDescription + '"><meta name="twitter:image" content="' + cover + '">',
    '<link rel="canonical" href="' + canonical + '"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">',
    '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2040%2040%22%3E%3Crect%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%229%22%20fill%3D%22%232456ff%22%2F%3E%3Ctext%20x%3D%2220%22%20y%3D%2229%22%20font-size%3D%2228%22%20font-family%3D%22Arial%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3EB%3C%2Ftext%3E%3C%2Fsvg%3E"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/additions.css"><script type="application/ld+json">' + jsonLd + '</script></head><body>',
    '<header class="site-head"><div class="wrap"><a class="brand" href="/" aria-label="B Tecky home"><svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#2456ff"/><g fill="#fff"><rect x="10" y="6" width="16" height="4"/><rect x="10" y="10" width="4" height="8"/><rect x="26" y="10" width="4" height="8"/><rect x="10" y="18" width="16" height="4"/><rect x="10" y="22" width="4" height="8"/><rect x="26" y="22" width="4" height="8"/><rect x="10" y="30" width="16" height="4"/></g></svg><span>B Tecky</span></a>',
    '<button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg></button>',
    '<nav class="nav" id="nav" aria-label="Main"><a href="/">Home</a><a href="/about">About</a><a href="/#services">Services</a><a href="/#products">Products</a><a href="/blog" aria-label="Blog and guides">Blog</a><div class="nav-dropdown"><button type="button" class="nav-drop-toggle" aria-expanded="false">Arcade <span aria-hidden="true">▾</span></button><div class="nav-drop-menu"><a href="/arcade">Score Checker</a><a href="/arcade-calculator">Points Calculator</a><a href="/playlists">Learning Playlists</a></div></div><a href="/partners">Partnerships</a><a href="/contact">Contact</a></nav></div></header>',
    '<main class="article-wrap publication-shell"><a class="publication-back" href="/blog"><span aria-hidden="true">←</span><span>Back</span></a>',
    '<header class="article-head"><div class="article-meta"><span>' + esc(date) + '</span><span>·</span><span>' + category + '</span><span>·</span><span>By ' + author + '</span></div>',
    '<span class="publication-updated" data-updated="' + esc(updated) + '" hidden></span><h1>' + title + '</h1><p class="lede">' + summary + '</p>',
    '<img class="article-cover publication-cover" src="' + cover + '" alt="' + esc(post.coverAlt || post.title) + ' — featured image" loading="eager" decoding="async">',
    '<article class="article-body publication-body">' + renderMarkdown(post.body) + '</article>' + video + '</main>',
    '<footer><div class="wrap"><div><p><b style="color:#fff">B Tecky</b> is a technology-led initiative exploring digital products, software solutions and practical technology services.</p><p>Independent creator site. Not affiliated with or endorsed by Google. Google Cloud, Google Skills and Arcade are trademarks of Google LLC.</p><div class="social" data-social aria-label="B Tecky on social media"></div></div><div class="foot-links"><a href="/">Home</a><a href="/blog">Blog</a><a href="/arcade">Score Checker</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy policy</a></div></div></footer>',
    '<script src="/config.js"></script><script src="/site.js"></script><script src="/community.js"></script>',
    '<script>document.querySelector(".nav-drop-toggle")?.addEventListener("click",function(){const d=this.closest(".nav-dropdown");d.classList.toggle("open");this.setAttribute("aria-expanded",d.classList.contains("open")?"true":"false")});</script>',
    '<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};</script><script defer src="/_vercel/insights/script.js"></script></body></html>'
  ].join('\n');
}

async function gh(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not configured in Vercel.');
  const response = await fetch(API + path, {
    ...options,
    headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer ' + token,
      'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json',...(options.headers || {})}
  });
  const raw = await response.text();
  let data = {};
  try { data = JSON.parse(raw); } catch (_) {}
  if (!response.ok) throw new Error(data.message || ('GitHub API failed (' + response.status + ')'));
  return data;
}

async function readRepoFile(path) {
  const data = await gh('/repos/' + OWNER + '/' + REPO + '/contents/' + path + '?ref=' + BRANCH);
  return {sha:data.sha,text:Buffer.from(data.content.replace(/\n/g,''),'base64').toString('utf8')};
}

async function commitFiles(files, message) {
  const ref = await gh('/repos/' + OWNER + '/' + REPO + '/git/ref/heads/' + BRANCH);
  const head = await gh('/repos/' + OWNER + '/' + REPO + '/git/commits/' + ref.object.sha);
  const entries = [];
  for (const file of files) {
    const blob = await gh('/repos/' + OWNER + '/' + REPO + '/git/blobs', {
      method:'POST',body:JSON.stringify({content:file.content,encoding:file.encoding || 'utf-8'})
    });
    entries.push({path:file.path,mode:'100644',type:'blob',sha:blob.sha});
  }
  const tree = await gh('/repos/' + OWNER + '/' + REPO + '/git/trees', {
    method:'POST',body:JSON.stringify({base_tree:head.tree.sha,tree:entries})
  });
  const commit = await gh('/repos/' + OWNER + '/' + REPO + '/git/commits', {
    method:'POST',body:JSON.stringify({message,tree:tree.sha,parents:[ref.object.sha]})
  });
  await gh('/repos/' + OWNER + '/' + REPO + '/git/refs/heads/' + BRANCH, {
    method:'PATCH',body:JSON.stringify({sha:commit.sha,force:false})
  });
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  const suppliedKey = req.headers['x-btecky-key'] || (req.body && req.body.key) || '';
  const configuredPassword = process.env.BLOG_ADMIN_PASSWORD || '';
  if (!configuredPassword.trim()) return res.status(503).json({error:'BLOG_ADMIN_PASSWORD is not configured in Vercel.'});
  // Trim accidental whitespace/newlines copied into Vercel's secret field.
  if (String(suppliedKey).trim() !== configuredPassword.trim()) {
    return res.status(401).json({error:'Invalid passphrase. Check the BLOG_ADMIN_PASSWORD value in Vercel Production and redeploy.'});
  }
  try {
    if (req.method === 'GET') {
      const file = await readRepoFile('blog/posts.json');
      const data = JSON.parse(file.text);
      const slug = req.query && req.query.slug;
      if (slug) {
        const post = (data.posts || []).find(item => item.slug === slug);
        return post ? res.status(200).json(post) : res.status(404).json({error:'Post not found'});
      }
      return res.status(200).json((data.posts || []).map(({slug,title,date,status,tags,videoUrl,updatedAt}) =>
        ({slug,title,date,status,tags,videoUrl,updatedAt})));
    }
    if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const action = body.action || 'save';
    if (action === 'upload') {
      const types = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif','image/gif':'gif'};
      const type = String(body.contentType || '').toLowerCase();
      const ext = types[type];
      const encoded = String(body.contentBase64 || '');
      if (!ext || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return res.status(400).json({error:'Choose a valid JPG, PNG, WebP, AVIF, or GIF image.'});
      if (encoded.length > 4 * 1024 * 1024) return res.status(413).json({error:'Images must be 3 MB or smaller.'});
      const filename = String(body.filename || 'cover').split(/[\\/]/).pop().toLowerCase().replace(/\\.[^.]+$/,'').replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48) || 'cover';
      const path = 'assets/images/blog-uploads/' + Date.now() + '-' + filename + '.' + ext;
      await commitFiles([{path,content:encoded,encoding:'base64'}],'Upload blog image: ' + filename);
      return res.status(200).json({ok:true,path:'/' + path});
    }
    const file = await readRepoFile('blog/posts.json');
    const data = JSON.parse(file.text);
    data.posts = data.posts || [];

    if (action === 'delete') {
      const slug = String(body.slug || '');
      const before = data.posts.length;
      data.posts = data.posts.filter(post => post.slug !== slug);
      if (before === data.posts.length) return res.status(404).json({error:'Post not found'});
      await commitFiles([
        {path:'blog/posts.json',content:JSON.stringify(data,null,2)},
        {path:'blog/' + slug + '.html',content:'<!doctype html><html><head><meta http-equiv="refresh" content="0;url=/blog"></head><body>Article removed. <a href="/blog">Back to blog</a></body></html>'}
      ],'Remove blog post: ' + slug);
      return res.status(200).json({ok:true,deleted:slug});
    }

    const input = body.post || {};
    const title = String(input.title || '').trim();
    const bodyText = String(input.body || '').trim();
    if (!title || !bodyText) return res.status(400).json({error:'Title and body are required.'});
    const status = String(input.status || 'published');
    const contentType = input.contentType === 'events' ? 'events' : 'tech';
    const minimumWords = contentType === 'events' ? 600 : 1200;
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
    if (status === 'published' && wordCount < minimumWords) {
      return res.status(400).json({error:(contentType === 'events' ? 'Event articles' : 'Tech articles') + ' must contain at least ' + minimumWords + ' words before publishing. Current count: ' + wordCount + '. Add useful detail, examples, steps and caveats, or save as draft.'});
    }
    const slug = String(input.slug || title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,88));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return res.status(400).json({error:'Slug must contain lowercase letters, numbers, and hyphens.'});
    const originalSlug = String(input.originalSlug || slug);
    const oldIndex = data.posts.findIndex(post => post.slug === originalSlug);
    const oldPost = oldIndex >= 0 ? data.posts[oldIndex] : null;
    const videoId = (String(input.videoUrl || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/) || [])[1] || '';
    const tags = Array.isArray(input.tags) ? input.tags : [String(input.category || 'Technology')];
    const today = new Date().toISOString().slice(0,10);
    const savedContentType = contentType;
    const post = {
      slug,title,contentType:savedContentType,date:String(input.date || (oldPost && oldPost.date) || today),updatedAt:today,tags,
      summary:String(input.summary || input.excerpt || '').trim(),body:bodyText,
      videoUrl:String(input.videoUrl || '').trim(),
      videoThumbnail:videoId ? 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg' : ((oldPost && oldPost.videoThumbnail) || ''),
      cover:String(input.cover || (oldPost && oldPost.cover) || '/assets/images/blog-covers/' + slug + '.svg'),
      seoTitle:String(input.seoTitle || (oldPost && oldPost.seoTitle) || '').trim(),
      seoDescription:String(input.seoDescription || (oldPost && oldPost.seoDescription) || '').trim(),
      coverAlt:String(input.coverAlt || (oldPost && oldPost.coverAlt) || title).trim(),
      author:String(input.author || (oldPost && oldPost.author) || 'Lavish Sheth'),status
    };
    if (oldIndex >= 0) data.posts.splice(oldIndex,1);
    data.posts.unshift(post);
    const files = [
      {path:'blog/posts.json',content:JSON.stringify(data,null,2)},
      {path:'blog/' + slug + '.html',content:article(post,data.posts)}
    ];
    if (!videoId && post.cover === '/assets/images/blog-covers/' + slug + '.svg') files.push({path:'assets/images/blog-covers/' + slug + '.svg',content:coverSvg(post)});
    if (oldIndex >= 0 && originalSlug !== slug) {
      files.push({path:'blog/' + originalSlug + '.html',content:'<!doctype html><html><head><meta http-equiv="refresh" content="0;url=/blog"></head><body>Article moved. <a href="/blog">Back to blog</a></body></html>'});
    }
    await commitFiles(files,(oldIndex >= 0 ? 'Update' : 'Publish') + ' blog post: ' + title);
    return res.status(200).json({ok:true,post,deployTriggered:true});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error:error.message || 'Blog operation failed.'});
  }
};
