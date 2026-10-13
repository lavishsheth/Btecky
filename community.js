/* B Tecky shared community/mentorship footer enhancement. */
(function () {
  "use strict";
  var LINKS = {
    linkedin: "https://www.linkedin.com/in/lavish-sheth-163844215/",
    telegram: "https://t.me/bteckyls",
    whatsapp: "https://whatsapp.com/channel/0029Va7uSWT7oQhlRVJKka1Q",
    youtube: "https://www.youtube.com/channel/UCS9BcPpwy1W5Xorp0KU23aQ/",
    mentorship: "https://unstop.com/mentor/lavish?ref=wyOK0QY"
  };
  var ICONS = {
    linkedin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2 2 0 1 0 5.25 6.38 2 2 0 0 0 5.25 3ZM20.44 13.42c0-3.46-1.85-5.07-4.31-5.07a3.72 3.72 0 0 0-3.39 1.87h-.05V8.5H9.31V20h3.38v-5.69c0-1.5.28-2.96 2.15-2.96 1.85 0 1.87 1.73 1.87 3.06V20h3.38l.35-6.58Z"/></svg>',
    telegram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m21.6 4.1-3.1 15.1c-.24 1.07-.87 1.34-1.76.84l-4.85-3.58-2.34 2.25c-.26.26-.48.48-.98.48l.35-4.95 9.01-8.14c.39-.35-.08-.54-.61-.19L6.18 12.7 1.41 11.2c-1.04-.33-1.06-1.04.22-1.54L20.28 2.4c.88-.33 1.65.2 1.32 1.7Z"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.5 3.5A11.85 11.85 0 0 0 12.06 0C5.51 0 .18 5.32.18 11.87c0 2.09.55 4.13 1.59 5.93L.08 24l6.34-1.66a11.86 11.86 0 0 0 5.64 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.15-3.45-8.39ZM12.07 21.75h-.01a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.76.99 1-3.66-.23-.38a9.82 9.82 0 0 1-1.51-5.24c0-5.44 4.43-9.86 9.88-9.86a9.8 9.8 0 0 1 6.98 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.44-4.43 9.85-9.86 9.85Zm5.41-7.38c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.63-.93-2.23-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.69.25-1.29.18-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.58A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.87.58 9.38.58 9.38.58s7.51 0 9.38-.58a3 3 0 0 0 2.12-2.12A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.5 3.8-6.5 3.8Z"/></svg>'
  };
  function el(html){var d=document.createElement('div');d.innerHTML=html.trim();return d.firstElementChild;}
  var nav=document.getElementById('nav');
  if(nav&&!nav.querySelector('.mentor-link')){
    var sub=nav.querySelector('.head-sub');
    var a=el('<a class="btn btn-line mentor-link" href="'+LINKS.mentorship+'" target="_blank" rel="noopener noreferrer">Mentorship</a>');
    if(sub) nav.insertBefore(a,sub); else nav.appendChild(a);
  }
  var footer=document.querySelector('footer');
  if(footer&&!footer.querySelector('.community-footer-block')){
    var wrap=el('<div class="community-footer-block"><div><p class="eyebrow">Stay connected</p><h2>Join the B Tecky community</h2><p>New videos, tech opportunities, learning resources and community updates.</p></div><div class="community-footer-links"></div></div>');
    var links=wrap.querySelector('.community-footer-links');
    [['linkedin','LinkedIn'],['telegram','Telegram'],['whatsapp','WhatsApp Channel'],['youtube','YouTube']].forEach(function(x){links.appendChild(el('<a href="'+LINKS[x[0]]+'" target="_blank" rel="noopener noreferrer"><span class="community-footer-icon">'+ICONS[x[0]]+'</span><span>'+x[1]+'</span></a>'));});
    var footInner=footer.querySelector('.wrap')||footer.firstElementChild;
    if(footInner) footInner.insertBefore(wrap,footInner.firstChild);
  }
})();
