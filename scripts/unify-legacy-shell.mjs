/**
 * Apply the shared B Tecky navigation and footer styling to retained legacy pages.
 * Page-specific markup and functionality remain intact.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'dist');
const pages = [
  'about/index.html', 'partners/index.html', 'contact/index.html',
  'terms/index.html', 'playlists/index.html', 'arcade.html',
  'arcade-calculator.html', 'privacy.html',
];
const blogMenu = `<div class="nav-dropdown btecky-blog-dropdown">
  <button type="button" class="nav-drop-toggle" aria-expanded="false">Blog <span aria-hidden="true">▾</span></button>
  <div class="nav-drop-menu">
    <a href="/blog">All stories <small>Latest from B Tecky</small></a>
    <a href="/blog?type=tech">Tech blogs <small>Guides, explainers &amp; tutorials</small></a>
    <a href="/blog?type=events">Events &amp; opportunities <small>Hackathons, internships &amp; more</small></a>
  </div>
</div>`;
const sharedStyles = `
<style id="btecky-shared-shell">
.site-head{position:sticky!important;top:0!important;z-index:100!important;background:rgba(255,255,255,.96)!important;backdrop-filter:blur(18px)!important;border-bottom:1px solid #e7ebf3!important;box-shadow:0 5px 22px rgba(16,24,40,.035)!important}
.site-head>.wrap,.site-head .wrap{max-width:1240px!important;margin-inline:auto!important;padding-inline:24px!important;min-height:72px!important;display:flex!important;align-items:center!important;gap:24px!important}
.site-head .brand{display:inline-flex!important;align-items:center!important;gap:10px!important;font-weight:900!important;letter-spacing:-.045em!important;color:#101828!important;flex-shrink:0!important}
.site-head .brand svg{width:36px!important;height:36px!important;display:block!important}
.site-head .nav{align-items:center!important;gap:clamp(10px,1.4vw,20px)!important;font-size:.84rem!important;font-weight:700!important}
.site-head .nav>a,.site-head .nav-drop-toggle{padding:10px 0!important;color:#475467!important}
.site-head .nav>a:hover,.site-head .nav-drop-toggle:hover{color:#315efb!important}
.site-head .nav-dropdown{position:relative!important}
.site-head .nav-drop-toggle{border:0!important;background:transparent!important;font:inherit!important;cursor:pointer!important}
.site-head .nav-drop-menu{position:absolute!important;top:calc(100% + 10px)!important;left:-18px!important;z-index:110!important;width:255px!important;padding:8px!important;background:#fff!important;border:1px solid #e5eaf3!important;border-radius:14px!important;box-shadow:0 18px 45px rgba(19,35,75,.14)!important;display:none!important}
.site-head .nav-dropdown:hover .nav-drop-menu,.site-head .nav-dropdown:focus-within .nav-drop-menu,.site-head .nav-dropdown.open .nav-drop-menu{display:block!important}
.site-head .nav-drop-menu a{display:block!important;padding:12px!important;border-radius:9px!important;color:#17233f!important;font-weight:800!important}
.site-head .nav-drop-menu a:hover{background:#f2f5ff!important}
.site-head .nav-drop-menu small{display:block!important;color:#8993a5!important;font-size:.68rem!important;font-weight:500!important;margin-top:4px!important}
body>footer{margin-top:0!important;padding:55px 0 25px!important;background:#0d1628!important;color:#fff!important;border:0!important}
body>footer .wrap{max-width:1240px!important;margin-inline:auto!important;padding-inline:24px!important;display:grid!important;grid-template-columns:1.35fr 1fr!important;gap:25px 45px!important;align-items:start!important}
body>footer p{color:#bdc7d8!important;line-height:1.7!important}
body>footer .foot-links{display:flex!important;flex-wrap:wrap!important;gap:12px 20px!important;align-content:start!important}
body>footer a{color:#d5dced!important;font-size:.84rem!important}
body>footer a:hover{color:#fff!important}
@media(max-width:900px){
.site-head>.wrap,.site-head .wrap{min-height:66px!important;flex-wrap:wrap!important;gap:12px!important}
.site-head .nav{top:100%!important;left:0!important;right:0!important;padding:12px 18px!important;background:#fff!important;border:1px solid #e7ebf3!important;border-radius:0 0 15px 15px!important;box-shadow:0 18px 38px rgba(20,35,70,.12)!important;align-items:stretch!important}
.site-head .nav-dropdown{width:100%!important}
.site-head .nav-drop-toggle{width:100%!important;display:flex!important;justify-content:space-between!important;padding:12px 0!important}
.site-head .nav-drop-menu{position:static!important;width:100%!important;box-shadow:none!important;border:0!important;background:#f6f8fc!important;padding:6px 10px!important}
body>footer .wrap{grid-template-columns:1fr!important}
}
</style>`;
let changed = 0;
for (const relative of pages) {
  const path = join(root, relative);
  if (!existsSync(path)) continue;
  let html = readFileSync(path, 'utf8');
  if (!html.includes('btecky-shared-shell')) {
    html = html.replace('</head>', sharedStyles + '\n</head>');
  }
  if (html.includes('<nav class="nav"') && !html.includes('btecky-blog-dropdown')) {
    const arcadeMenu = html.indexOf('<div class="nav-dropdown">');
    if (arcadeMenu >= 0) html = html.slice(0, arcadeMenu) + blogMenu + '\n      ' + html.slice(arcadeMenu);
    else html = html.replace('</nav>', blogMenu + '\n    </nav>');
  }
  html = html.replace(/<script>document\.querySelector\('.nav-drop-toggle'\)\?\.addEventListener\('click',[\s\S]*?<\/script>/g, '');
  if (!html.includes('btecky-legacy-dropdowns')) {
    const dropdownScript = `<script id="btecky-legacy-dropdowns">
document.querySelectorAll('.nav-drop-toggle').forEach(function(button){button.addEventListener('click',function(){var menu=this.closest('.nav-dropdown');var open=!menu.classList.contains('open');document.querySelectorAll('.nav-dropdown.open').forEach(function(item){item.classList.remove('open');item.querySelector('.nav-drop-toggle')?.setAttribute('aria-expanded','false');});menu.classList.toggle('open',open);this.setAttribute('aria-expanded',String(open));});});
document.addEventListener('keydown',function(event){if(event.key==='Escape')document.querySelectorAll('.nav-dropdown.open').forEach(function(item){item.classList.remove('open');item.querySelector('.nav-drop-toggle')?.setAttribute('aria-expanded','false');});});
</script>`;
    html = html.replace('</body>', dropdownScript + '\n</body>');
  }
  writeFileSync(path, html);
  changed++;
}
console.log(`Unified shared navigation and footer styling on ${changed} retained pages.`);
