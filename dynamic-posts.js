/* dynamic-posts.js
   Add this to blog.html (and optionally index.html) right after
   site.js:
     <script src="dynamic-posts.js"></script>

   On page load, fetches every PUBLISHED post from the self-publish
   system (/.netlify/functions/list-posts) and prepends a matching
   .post-card into #post-grid, so posts written from /write-lavii-9f21k2
   show up on /blog immediately — no redeploy needed. Cards link to
   /blog/post/?slug=... (the dynamic renderer), not a static file.

   Safe no-op if #post-grid isn't on the page.
*/
(function () {
  "use strict";
  var grid = document.getElementById("post-grid");
  if (!grid) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  fetch("/.netlify/functions/list-posts")
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (posts) {
      posts.forEach(function (p) {
        var a = document.createElement("a");
        a.className = "post-card";
        a.href = "/blog/post/?slug=" + encodeURIComponent(p.slug);
        a.setAttribute("data-tags", p.category || "");
        var d = new Date(p.date + "T00:00:00");
        var dateStr = isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        a.innerHTML =
          '<div class="cv"></div><div class="bd"><div class="chips"><span class="chip-t">' +
          esc(p.category || "") + '</span></div><h3>' + esc(p.title) +
          '</h3><p>' + esc(p.excerpt || "") + '</p><div class="meta">' + dateStr + "</div></div>";
        grid.insertBefore(a, grid.firstChild);
      });
      // Let the existing filter script (inline in blog.html) recount
      // visible cards now that new ones exist, if it's already run.
      var evt = new Event("btecky:posts-updated");
      document.dispatchEvent(evt);
    })
    .catch(function () {});
})();
