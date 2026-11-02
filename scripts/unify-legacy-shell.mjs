/**
 * Build-time normalizer: every retained legacy HTML page gets the same
 * B Tecky header, logo and footer as Astro pages.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const root=join(process.cwd(),'dist');
const shellSourcePath=join(root,'blog','index.html');
if(!existsSync(shellSourcePath))throw new Error('Cannot find the built Astro journal shell at '+shellSourcePath);
const shellSource=readFileSync(shellSourcePath,'utf8');
const canonicalHeaderMatch=shellSource.match(/<header class="site-header"[\s\S]*?<div class="site-scroll-progress"[\s\S]*?<\/div>/i);
const canonicalFooterMatch=shellSource.match(/<footer class="site-footer"[\s\S]*?<\/footer>/i);
if(!canonicalHeaderMatch||!canonicalFooterMatch)throw new Error('Could not extract the shared B Tecky header/footer from the Astro journal.');
const canonicalHeader=canonicalHeaderMatch[0];
const canonicalFooter=canonicalFooterMatch[0];
function walk(dir){if(!existsSync(dir))return[];return readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=join(dir,e.name);return e.isDirectory()?walk(p):e.isFile()&&e.name.endsWith('.html')?[p]:[];});}
let updated=0;
for(const path of walk(root)){
 if(path.includes('/write-lavii-9f21k2/'))continue;
 let html=readFileSync(path,'utf8');
 const blocks=[...html.matchAll(/<header\b[^>]*>[\s\S]*?<\/header>/gi)];
 const brand=blocks.find(m=>/class=["'][^"']*\bbrand\b/.test(m[0])&&/href=["']\//.test(m[0]));
 if(brand)html=html.replace(brand[0],canonicalHeader);
 else if(!html.includes('id="site-header"'))html=html.replace(/<body\b[^>]*>/i,m=>m+canonicalHeader);
 const footers=[...html.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)];
 for(const footer of footers) {
  if(/class=["'][^"']*\barticle-footer\b/.test(footer[0]))continue;
  html=html.replace(footer[0],'');
 }
 html=html.replace(/<\/body>/i,canonicalFooter+'</body>');
 if(!html.includes('/assets/css/site-header.css'))html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="/assets/css/site-header.css"></head>');
 if(!html.includes('/assets/css/site-footer.css'))html=html.replace(/<\/head>/i,'<link rel="stylesheet" href="/assets/css/site-footer.css"></head>');
 if(!html.includes('/assets/js/site-header.js'))html=html.replace(/<\/body>/i,'<script src="/assets/js/site-header.js" defer></script></body>');
 writeFileSync(path,html);updated++;
}
console.log('Applied the shared B Tecky header and footer to '+updated+' legacy pages.');