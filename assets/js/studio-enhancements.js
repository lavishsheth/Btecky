/* Small progressive enhancements for the existing private writer. */
(function(){
  'use strict';
  var $=function(id){return document.getElementById(id);};
  var app=$('app'),list=$('post-list'),filter=$('post-filter'),stats=$('studio-stats'),active='all';
  if(!app||!list)return;
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function refresh(){
    var rows=Array.isArray(window.__bteckyPosts)?window.__bteckyPosts:[];
    var counts={all:rows.length,published:rows.filter(function(p){return !p.status||p.status==='published';}).length,draft:rows.filter(function(p){return p.status==='draft';}).length};
    if(stats)stats.innerHTML=['all','published','draft'].map(function(k){return '<div class="studio-stat"><span>'+({all:'Total articles',published:'Published',draft:'Drafts'}[k])+'</span><strong>'+counts[k]+'</strong></div>';}).join('');
    var q=filter?filter.value.trim().toLowerCase():'';
    var shown=rows.filter(function(p){var st=p.status||'published';return (active==='all'||st===active)&&(!q||[p.title,p.slug,(p.tags||[]).join(' '),p.summary].join(' ').toLowerCase().indexOf(q)>-1);});
    list.innerHTML='';
    if(!shown.length){list.innerHTML='<p class="studio-empty">No articles match this view.</p>';return;}
    shown.slice(0,250).forEach(function(p){
      var row=document.createElement('article');row.className='studio-post-row';
      var info=document.createElement('div');info.className='studio-post-info';
      info.innerHTML='<strong>'+esc(p.title)+'</strong><span>'+esc(p.date||'No date')+' · '+esc((p.tags||[]).join(', '))+'</span>';
      var badge=document.createElement('span');badge.className='studio-state '+((p.status||'published')==='draft'?'is-draft':'is-live');badge.textContent=p.status||'published';
      var actions=document.createElement('div');actions.className='studio-post-actions';
      var edit=document.createElement('button');edit.type='button';edit.className='btn btn-line';edit.textContent='Edit';edit.addEventListener('click',function(){var all=Array.prototype.slice.call(document.querySelectorAll('#post-list .post-row'));var target=all.find(function(x){return x.querySelector('.studio-post-info strong')&&x.querySelector('.studio-post-info strong').textContent===p.title;});if(target){var button=target.querySelector('[data-edit-slug]');if(button)button.click();}});
      var view=document.createElement('a');view.className='btn btn-line';view.textContent='View';view.href='/blog/'+encodeURIComponent(p.slug)+'.html';view.target='_blank';view.rel='noopener';
      actions.append(badge,edit,view);row.append(info,actions);list.appendChild(row);
    });
  }
  window.BteckyStudioRefresh=refresh;\n  function wire(){
    var all=document.querySelectorAll('[data-status]');
    all.forEach(function(b){b.addEventListener('click',function(){active=b.dataset.status;all.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});refresh();});});
    if(filter)filter.addEventListener('input',refresh);
    var original=window.renderList;
  }
  wire();
  var login=$('login');
  if(login)login.addEventListener('click',function(){setTimeout(function(){var appVisible=!app.classList.contains('hidden');if(appVisible){var old=$('status');if(old&&window.MutationObserver){new MutationObserver(function(){refresh();}).observe(old,{childList:true,subtree:true,characterData:true});}var listEl=$('post-list');if(listEl&&window.MutationObserver)new MutationObserver(refresh).observe(listEl,{childList:true,subtree:true});refresh();}},250);});
  document.addEventListener('click',function(e){if(e.target&&e.target.id==='clear')setTimeout(refresh,100);});
})();
