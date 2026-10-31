(function(){
'use strict';
var $=function(id){return document.getElementById(id);};
var list=$('post-list'),filter=$('post-filter'),stats=$('studio-stats'),active='all';
if(!list)return;
function count(posts){
 var all=posts.length,published=posts.filter(function(p){return !p.status||p.status==='published';}).length,drafts=posts.filter(function(p){return p.status==='draft';}).length;
 if(stats)stats.innerHTML='<div class="studio-stat"><span>Total articles</span><strong>'+all+'</strong></div><div class="studio-stat"><span>Published</span><strong>'+published+'</strong></div><div class="studio-stat"><span>Drafts</span><strong>'+drafts+'</strong></div>';
}
function apply(){
 var rows=Array.prototype.slice.call(list.querySelectorAll('.post-row')),q=filter?filter.value.trim().toLowerCase():'';
 rows.forEach(function(row){var text=row.textContent.toLowerCase(),status=row.querySelector('.studio-state');var state=status?status.textContent:'published';row.hidden=!( (active==='all'||state===active) && (!q||text.indexOf(q)>-1));});
}
function controls(){
 document.querySelectorAll('[data-status]').forEach(function(button){button.addEventListener('click',function(){active=button.dataset.status;document.querySelectorAll('[data-status]').forEach(function(b){b.setAttribute('aria-pressed',String(b===button));});apply();});});
 if(filter)filter.addEventListener('input',apply);
}
var listObserver=new MutationObserver(function(){var posts=window.__bteckyPosts||[];count(posts);apply();});
listObserver.observe(list,{childList:true,subtree:true});
controls();
window.BteckyStudioRefresh=function(){count(window.__bteckyPosts||[]);apply();};
})();
