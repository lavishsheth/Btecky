(function () {
  "use strict";

  /* ---- mobile menu ---- */
  var t = document.querySelector(".nav-toggle"), n = document.getElementById("nav");
  if (t && n) {
    t.addEventListener("click", function () {
      var open = n.classList.toggle("open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
      t.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    n.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { n.classList.remove("open"); t.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- social links (from config.js) ---- */
  (function initSocial() {
    var S = window.BTECKY_SOCIAL || {};
    var defs = [["youtube", "YouTube"], ["linkedin", "LinkedIn"], ["instagram", "Instagram"], ["x", "X"], ["telegram", "Telegram"], ["whatsapp", "WhatsApp"], ["github", "GitHub"]];
    document.querySelectorAll("[data-social]").forEach(function (box) {
      box.innerHTML = "";
      defs.forEach(function (d) {
        var u = S[d[0]];
        if (!u || !/^https:\/\//.test(u)) return;
        var a = document.createElement("a");
        a.href = u; a.textContent = d[1]; a.target = "_blank"; a.rel = "noopener me"; a.setAttribute("data-k", d[0]);
        a.setAttribute("aria-label", "B Tecky on " + d[1]);
        box.appendChild(a);
      });
    });
  })();

  /* ---- latest blog posts on the home page (reads posts.js) ---- */
  var grid = document.getElementById("latest-posts-grid"), sec = document.getElementById("latest-posts");
  if (grid && sec) {
    var B = window.BTECKY_BLOG, posts = (B && Array.isArray(B.posts)) ? B.posts.slice(0, 3) : [];
    if (posts.length) {
      posts.forEach(function (p) {
        var a = document.createElement("a"); a.className = "post-card"; a.href = "blog/" + p.slug + ".html";
        var cv = document.createElement("div"); cv.className = "cv";
        if (p.cover) { var im = document.createElement("img"); im.src = p.cover; im.alt = ""; im.loading = "lazy"; cv.appendChild(im); }
        var bd = document.createElement("div"); bd.className = "bd";
        if (p.tags && p.tags.length) { var ch = document.createElement("div"); ch.className = "chips"; var tg = document.createElement("span"); tg.className = "chip-t"; tg.textContent = p.tags[0]; ch.appendChild(tg); bd.appendChild(ch); }
        var h = document.createElement("h3"); h.textContent = p.title; bd.appendChild(h);
        if (p.summary) { var pp = document.createElement("p"); pp.textContent = p.summary; bd.appendChild(pp); }
        var m = document.createElement("div"); m.className = "meta";
        var d = new Date(p.date + "T00:00:00");
        m.textContent = isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        bd.appendChild(m);
        a.appendChild(cv); a.appendChild(bd); grid.appendChild(a);
      });
      sec.hidden = false;
    }
  }

  /* ---- ads: shown only once a real AdSense ID is in the <head> script ---- */
  (function initAds() {
    var s = document.querySelector('script[src*="adsbygoogle.js"]');
    var m = s && /client=(ca-pub-\d{10,})/.exec(s.src);
    if (!m) return;                       // placeholder ID: keep ad boxes hidden
    document.documentElement.classList.add("ads-on");
    document.querySelectorAll(".ad").forEach(function (box) {
      var slot = box.getAttribute("data-ad-slot");
      if (!slot || /^(\d)\1+$/.test(slot)) { box.style.display = "none"; return; }   // slot ID not set yet
      var ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", m[1]);
      ins.setAttribute("data-ad-slot", slot);
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");
      box.appendChild(ins);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  })();
})();


/* ---- publication reading experience (shared by all article HTML pages) ---- */
(function publicationExperience(){
  "use strict";
  var started = false;

  function text(el){ return el ? (el.textContent || "").trim() : ""; }
  function slugify(value){
    return String(value || "").toLowerCase().normalize("NFKD")
      .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,72) || "section";
  }
  function formatDate(value){
    if(!value) return "";
    var d = new Date(String(value).slice(0,10) + "T00:00:00");
    return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
  }
  function readingMinutes(body){
    var words = text(body).split(/\s+/).filter(Boolean).length;
    return Math.max(1,Math.ceil(words/210));
  }
  function make(tag,cls,content){
    var el=document.createElement(tag);
    if(cls) el.className=cls;
    if(content!==undefined) el.textContent=content;
    return el;
  }
  function escapeCode(value){
    return String(value).replace(/[&<>"']/g,function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  }
  function highlightCode(source){
    var pattern=/\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|let|var|function|return|if|else|for|while|class|new|async|await|import|export|from|try|catch|throw|true|false|null|None|def|print|public|private|static|void|int|string|SELECT|FROM|WHERE|JOIN|CREATE|TABLE|INSERT|UPDATE|DELETE|AND|OR)\b|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*(?=\s*\()/gi;
    var html="",last=0,match;
    while((match=pattern.exec(source))!==null){
      html+=escapeCode(source.slice(last,match.index));
      var token=match[0],kind="tok-function";
      if(token.slice(0,2)==="//"||token.slice(0,2)==="/*"||token.charAt(0)==="#")kind="tok-comment";
      else if(token.charAt(0)==='"'||token.charAt(0)==="'")kind="tok-string";
      else if(/^\d/.test(token))kind="tok-number";
      else if(/^(const|let|var|function|return|if|else|for|while|class|new|async|await|import|export|from|try|catch|throw|true|false|null|None|def|print|public|private|static|void|int|string|SELECT|FROM|WHERE|JOIN|CREATE|TABLE|INSERT|UPDATE|DELETE|AND|OR)$/i.test(token))kind="tok-keyword";
      html+='<span class="'+kind+'">'+escapeCode(token)+'</span>';
      last=pattern.lastIndex;
    }
    return html+escapeCode(source.slice(last));
  }
  function enhanceCode(body){
    body.querySelectorAll("pre").forEach(function(pre){
      if(pre.closest(".publication-code")) return;
      var code=pre.querySelector("code");
      var source=code ? code.textContent : pre.textContent;
      var language="";
      if(code){
        var match=(code.className+" "+pre.className).match(/(?:language-|lang-)([a-z0-9+#-]+)/i);
        language=match?match[1]:"";
        code.innerHTML=highlightCode(source);
      }
      var frame=make("div","publication-code");
      var head=make("div","publication-code-head");
      head.appendChild(make("span","",language || "Code"));
      var copy=make("button","","Copy code");
      copy.type="button";
      copy.addEventListener("click",function(){
        var finish=function(){copy.textContent="Copied";setTimeout(function(){copy.textContent="Copy code";},1500);};
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(source).then(finish).catch(function(){copy.textContent="Copy unavailable";});
        }else{
          var area=make("textarea");area.value=source;document.body.appendChild(area);area.select();
          try{document.execCommand("copy");finish();}catch(e){copy.textContent="Copy unavailable";}
          area.remove();
        }
      });
      head.appendChild(copy);
      pre.parentNode.insertBefore(frame,pre);
      frame.appendChild(head);frame.appendChild(pre);
    });
  }
  function enhanceTables(body){
    body.querySelectorAll("table").forEach(function(table){
      if(table.parentElement.classList.contains("publication-table-wrap")) return;
      var wrap=make("div","publication-table-wrap");
      table.parentNode.insertBefore(wrap,table);wrap.appendChild(table);
    });
  }
  function makeToc(body,layout){
    var headings=Array.prototype.slice.call(body.querySelectorAll("h2,h3"));
    if(headings.length<2){layout.classList.add("publication-layout--no-toc");return;}
    var sidebar=make("aside","publication-sidebar");
    sidebar.appendChild(make("p","publication-toc-title","On this page"));
    var nav=make("nav","publication-toc");nav.setAttribute("aria-label","Article contents");
    headings.forEach(function(h,i){
      var id=h.id || slugify(text(h));
      var base=id,n=2;
      while(document.getElementById(id) && document.getElementById(id)!==h){id=base+"-"+n++;}
      h.id=id;
      var a=make("a",h.tagName==="H3"?"toc-h3":"",text(h));
      a.href="#"+id;
      a.addEventListener("click",function(){nav.querySelectorAll("a").forEach(function(x){x.classList.remove("is-active");});a.classList.add("is-active");});
      nav.appendChild(a);
    });
    sidebar.appendChild(nav);
    layout.appendChild(sidebar);
    var mobile=make("details","publication-mobile-toc");
    var summary=make("summary","","On this page");
    mobile.appendChild(summary);
    var mobileNav=nav.cloneNode(true);
    mobileNav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){mobile.open=false;});});
    mobile.appendChild(mobileNav);
    var main=layout.querySelector(".publication-main");
    main.insertBefore(mobile,main.firstChild);
    if("IntersectionObserver" in window){
      var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var id=entry.target.id;
            nav.querySelectorAll("a").forEach(function(a){a.classList.toggle("is-active",a.getAttribute("href")==="#"+id);});
          }
        });
      },{rootMargin:"-18% 0px -70% 0px"});
      headings.forEach(function(h){observer.observe(h);});
    }
  }
  function actionLink(label,url){
    var a=make("a","publication-action",label);a.href=url;a.target="_blank";a.rel="noopener noreferrer";return a;
  }
  function addActions(parent){
    var bar=make("div","publication-actions");
    bar.appendChild(make("span","publication-actions-label","Share this guide"));
    var pageUrl=location.href.split("#")[0];
    var title=document.title;
    bar.appendChild(actionLink("LinkedIn","https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(pageUrl)));
    bar.appendChild(actionLink("X","https://twitter.com/intent/tweet?url="+encodeURIComponent(pageUrl)+"&text="+encodeURIComponent(title)));
    var copy=make("button","publication-action","Copy link");copy.type="button";
    copy.addEventListener("click",function(){
      var done=function(){copy.textContent="Link copied";setTimeout(function(){copy.textContent="Copy link";},1600);};
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(pageUrl).then(done).catch(function(){copy.textContent="Copy unavailable";});
      else{var area=make("textarea");area.value=pageUrl;document.body.appendChild(area);area.select();try{document.execCommand("copy");done();}catch(e){copy.textContent="Copy unavailable";}area.remove();}
    });
    bar.appendChild(copy);parent.appendChild(bar);
  }
  function addAuthor(parent){
    var box=make("section","publication-author");
    var avatar=make("img","publication-avatar");
    avatar.src="/assets/images/lavish-btecky-founder.png";
    avatar.alt="Lavish Sheth, founder of B Tecky";
    avatar.loading="lazy";
    avatar.decoding="async";
    box.appendChild(avatar);
    var details=make("div");
    details.appendChild(make("h3","","Lavish Sheth"));
    var p=make("p","","Founder of B Tecky. Writing practical guides on software, cloud, AI and developer skills.");
    var a=make("a","","More about B Tecky");a.href="/about";p.appendChild(document.createTextNode(" "));p.appendChild(a);
    details.appendChild(p);box.appendChild(details);parent.appendChild(box);
  }
  function renderPostNavigation(parent,posts,slug,currentTags){
    if(!Array.isArray(posts)||!posts.length) return;
    posts=posts.filter(function(post){return !post.status || post.status==="published";});
    var index=posts.findIndex(function(p){return p.slug===slug;});
    if(index<0) return;
    var same=posts.filter(function(p){return p.slug!==slug && (p.tags||[]).some(function(tag){return currentTags.indexOf(tag)>=0;});});
    var chosen=(same.concat(posts.filter(function(p){return p.slug!==slug&&!same.some(function(x){return x.slug===p.slug;});}))).slice(0,2);
    if(chosen.length){
      var section=make("section","publication-related");
      var head=make("div","publication-section-head");
      head.appendChild(make("h2","","Related guides"));
      var all=make("a","","View all articles");all.href="/blog";head.appendChild(all);section.appendChild(head);
      var grid=make("div","publication-related-grid");
      chosen.forEach(function(p){
        var a=make("a","publication-related-card");a.href="/blog/"+p.slug+".html";
        a.appendChild(make("small","",((p.tags||[])[0]||"B Tecky")));
        a.appendChild(make("strong","",p.title||"Read article"));
        if(p.date)a.appendChild(make("span","",formatDate(p.date)));
        grid.appendChild(a);
      });
      section.appendChild(grid);parent.appendChild(section);
    }
    var neighbors=make("nav","publication-neighbors");neighbors.setAttribute("aria-label","More articles");
    var older=posts[index+1],newer=posts[index-1];
    [[older,"Previous article"],[newer,"Next article"]].forEach(function(pair){
      var p=pair[0];if(!p)return;
      var a=make("a","publication-neighbor");a.href="/blog/"+p.slug+".html";
      a.appendChild(make("small","",pair[1]));a.appendChild(make("strong","",p.title||"Read article"));neighbors.appendChild(a);
    });
    if(neighbors.children.length) parent.appendChild(neighbors);
  }
  function enhance(root){
    root=root||document;
    var shell=root.querySelector(".article-wrap") || root.querySelector("#post-root");
    if(!shell){
      var legacyArticle=root.querySelector("article");
      if(legacyArticle && legacyArticle.querySelector(".post-head") && legacyArticle.querySelector(".post-body .prose")) shell=legacyArticle;
    }
    var body=root.querySelector(".article-body") || root.querySelector(".post-body .prose");
    if(!shell||!body||shell.dataset.publicationEnhanced==="true") return false;
    var heading=shell.querySelector("h1");
    if(!heading) return false;
    shell.dataset.publicationEnhanced="true";
    shell.classList.add("publication-shell");
    body.classList.add("publication-body");
    var back=shell.querySelector('a[href="/blog"]');
    if(back){back.classList.add("publication-back");}
    var head=shell.querySelector(".article-head") || shell.querySelector(".post-head");
    var eyebrow=shell.querySelector(".eyebrow");
    var meta=shell.querySelector(".article-meta") || shell.querySelector(".post-meta");
    var metaSpans=meta?Array.prototype.slice.call(meta.querySelectorAll("span")):[];
    var crumbs=shell.querySelector(".crumbs");
    var crumbText=text(crumbs).split("/").slice(-1)[0].trim();
    var dateNode=meta?meta.querySelector("time[datetime]"):null;
    var date=dateNode ? (dateNode.getAttribute("datetime") || text(dateNode)) :
      (metaSpans.length ? (meta.classList.contains("post-meta") ? text(metaSpans[1]) : text(metaSpans[0])) : "");
    var chip=shell.querySelector(".post-head .chips .chip-t,.post-head .chip-t");
    var category=metaSpans.length ? (meta.classList.contains("post-meta") ? (crumbText && crumbText!=="Blog" ? crumbText : text(chip)) : text(metaSpans[2]||metaSpans[1])) : text(chip);
    var author="Lavish Sheth";
    if(metaSpans.length && !meta.classList.contains("post-meta")){
      author=text(metaSpans[metaSpans.length-1]).replace(/^By\s*/i,"") || author;
    }else if(metaSpans.length){
      var bylineText=metaSpans.find(function(item){return /^By\s+/i.test(text(item));});
      if(bylineText)author=text(bylineText).replace(/^By\s*/i,"");
    }
    var oldUpdated=shell.querySelector("[data-updated],.publication-updated");
    var updated=oldUpdated?(oldUpdated.getAttribute("data-updated")||text(oldUpdated)):date;
    var lede=shell.querySelector(".lede");
    if(!head){
      head=make("header","article-head");
      if(eyebrow)eyebrow.remove();
      shell.insertBefore(head,heading);
    }
    var oldChips=shell.querySelector(".post-head .chips");
    if(oldChips)oldChips.remove();
    if(meta){
      meta.innerHTML="";
      meta.appendChild(make("span","publication-category",category||"B Tecky"));
    }else{
      meta=make("div","article-meta");
      meta.appendChild(make("span","publication-category",category||"B Tecky"));
    }
    if(meta.parentNode!==head)head.insertBefore(meta,head.firstChild);
    if(heading.parentNode!==head)head.appendChild(heading);
    if(lede && lede.parentNode!==head)head.appendChild(lede);
    var cover=shell.querySelector(".article-cover");
    if(cover){cover.classList.add("publication-cover");if(!cover.getAttribute("alt")||cover.getAttribute("alt").trim()==="")cover.alt=text(heading)+" — featured image";}
    var count=readingMinutes(body);
    var byline=make("div","publication-byline");
    byline.appendChild(make("span","", "By "+(author||"Lavish Sheth")));
    if(date)byline.appendChild(make("span","","Published "+formatDate(date)));
    if(updated)byline.appendChild(make("span","","Updated "+formatDate(updated)));
    byline.appendChild(make("span","",""+count+" min read"));
    if(head)head.appendChild(byline);
    var layout=make("div","publication-layout");
    var main=make("div","publication-main");
    shell.appendChild(layout);layout.appendChild(main);
    [body].concat(Array.prototype.slice.call(shell.querySelectorAll(".video-box,.publication-video,.article-actions"))).forEach(function(el){
      if(el && el.parentNode!==main) main.appendChild(el);
    });
    var videoBox=main.querySelector(".video-box");
    if(videoBox) videoBox.classList.add("publication-video");
    enhanceCode(body);enhanceTables(body);makeToc(body,layout);
    var existingShare=shell.querySelector(".share");
    if(existingShare){
      existingShare.classList.add("publication-actions");
      var shareLabel=existingShare.querySelector("b");
      if(shareLabel)shareLabel.classList.add("publication-actions-label");
      existingShare.querySelectorAll("a,button").forEach(function(control){control.classList.add("publication-action");});
      main.appendChild(existingShare);
    }else{
      addActions(main);
    }
    var existingAuthor=shell.querySelector(".author");
    if(existingAuthor){
      existingAuthor.classList.add("publication-author");
      var oldAvatar=existingAuthor.querySelector(".publication-avatar");
      if(oldAvatar && oldAvatar.tagName!=="IMG"){
        var authorImage=make("img","publication-avatar");
        authorImage.src="/assets/images/lavish-btecky-founder.png";
        authorImage.alt="Lavish Sheth, founder of B Tecky";
        authorImage.loading="lazy";
        authorImage.decoding="async";
        oldAvatar.replaceWith(authorImage);
      }else if(!oldAvatar){
        var authorImage=make("img","publication-avatar");
        authorImage.src="/assets/images/lavish-btecky-founder.png";
        authorImage.alt="Lavish Sheth, founder of B Tecky";
        authorImage.loading="lazy";
        authorImage.decoding="async";
        existingAuthor.insertBefore(authorImage,existingAuthor.firstChild);
      }
      main.appendChild(existingAuthor);
    }else{
      addAuthor(main);
    }
    var footer=make("div","publication-footer");
    var link=make("a","btn btn-blue","Explore more guides");link.href="/blog";
    var follow=make("a","btn btn-line","Follow B Tecky");follow.href="https://www.youtube.com/@btecky";follow.target="_blank";follow.rel="noopener noreferrer";
    footer.appendChild(link);footer.appendChild(follow);main.appendChild(footer);
    var canonical=document.querySelector('link[rel="canonical"]');
    var slug=canonical ? canonical.href : location.pathname;
    slug=String(slug).split("/").pop().replace(/\.html(?:\?.*)?$/,"");
    if(slug==="index" || slug==="post"){
      var querySlug=new URLSearchParams(location.search).get("slug");
      if(querySlug)slug=querySlug;
    }
    var tags=category?[category]:[];
    if(window.fetch){
      fetch("/blog/posts.json").then(function(r){if(!r.ok)throw new Error("posts unavailable");return r.json();})
        .then(function(data){renderPostNavigation(main,data.posts||[],slug,tags);})
        .catch(function(){});
    }
    var progress=make("div","publication-progress");progress.setAttribute("aria-hidden","true");progress.appendChild(make("span"));
    document.body.insertBefore(progress,document.body.firstChild);
    var fill=progress.firstChild;
    function update(){
      var max=document.documentElement.scrollHeight-window.innerHeight;
      var amount=max>0?Math.min(100,Math.max(0,(window.scrollY/max)*100)):0;
      fill.style.width=amount+"%";
    }
    window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);update();
    var articleNav=document.querySelector(".site-head .nav");
    if(articleNav && !document.querySelector(".site-head .nav-toggle")){
      if(!articleNav.id) articleNav.id="nav";
      var toggle=make("button","nav-toggle");toggle.type="button";toggle.setAttribute("aria-label","Open menu");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-controls",articleNav.id);
      toggle.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
      articleNav.parentNode.insertBefore(toggle,articleNav);
      toggle.addEventListener("click",function(){var open=articleNav.classList.toggle("open");toggle.setAttribute("aria-expanded",open?"true":"false");toggle.setAttribute("aria-label",open?"Close menu":"Open menu");});
      articleNav.addEventListener("click",function(event){if(event.target.tagName==="A"){articleNav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}});
    }
    return true;
  }
  function start(){
    if(enhance(document)) return;
    var root=document.getElementById("post-root");
    if(root&&"MutationObserver" in window){
      var observer=new MutationObserver(function(){if(enhance(root))observer.disconnect();});
      observer.observe(root,{childList:true,subtree:true});
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
