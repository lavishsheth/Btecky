(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  if (!header || header.dataset.initialized === 'true') return;
  header.dataset.initialized = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const nav = header.querySelector('.site-nav');
  const mobileToggle = header.querySelector('[data-mobile-toggle]');
  const searchDialog = document.querySelector('[data-search-dialog]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  const updatesPanel = header.querySelector('#site-updates');
  const updatesList = header.querySelector('[data-updates-list]');
  const updatesToggle = header.querySelector('[data-updates-toggle]');
  try { localStorage.removeItem('btecky-theme'); } catch {}
  root.removeAttribute('data-theme');
  let posts = [];
  let activeResult = -1;
  let lastScrollY = window.scrollY;
  let scrollTicking = false;



  const closeMenus = () => {
    header.querySelectorAll('.site-nav__item').forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.site-nav__chevron')?.setAttribute('aria-expanded', 'false');
      item.querySelector('[data-menu-toggle]')?.setAttribute('aria-expanded', 'false');
      const menu = item.querySelector('.mega-menu');
      if (menu) menu.hidden = true;
    });
  };
  const toggleMenu = (item, force) => {
    if (!item) return;
    const open = typeof force === 'boolean' ? force : !item.classList.contains('is-open');
    closeMenus();
    item.classList.toggle('is-open', open);
    const trigger = item.querySelector('.site-nav__chevron');
    const label = item.querySelector('[data-menu-toggle]');
    trigger?.setAttribute('aria-expanded', String(open));
    label?.setAttribute('aria-expanded', String(open));
    const menu = item.querySelector('.mega-menu');
    if (menu) menu.hidden = !open;
  };
  header.querySelectorAll('.site-nav__chevron').forEach((button) => {
    const item = button.closest('.site-nav__item');
    button.addEventListener('click', () => toggleMenu(item));
  });
  header.querySelectorAll('[data-menu-toggle]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      toggleMenu(link.closest('.site-nav__item'));
    });
  });

  const closeMobile = () => {
    nav?.classList.remove('is-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileToggle?.setAttribute('aria-label', 'Open navigation');
  };
  mobileToggle?.addEventListener('click', () => {
    const open = mobileToggle.getAttribute('aria-expanded') !== 'true';
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('is-open', open);
    if (open) header.classList.remove('is-hidden');
  });
  nav?.querySelectorAll('a:not([data-menu-toggle])').forEach((link) => link.addEventListener('click', () => {
    closeMobile(); closeMenus();
  }));

  const loadPosts = async () => {
    if (posts.length) return posts;
    try {
      const response = await fetch('/blog/posts.json', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Unable to load the journal');
      const data = await response.json();
      posts = Array.isArray(data.posts) ? data.posts.filter((post) => post.status !== 'draft') : [];
    } catch { posts = []; }
    return posts;
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
  const staticResults = [
    { title: 'About B Tecky', summary: 'Learn about the team and our work', url: '/about', kind: 'Company' },
    { title: 'Arcade Score Checker', summary: 'Check your Google Cloud Arcade progress', url: '/arcade', kind: 'Tool' },
    { title: 'Facilitator Score Calculator', summary: 'Calculate your Facilitator milestone and bonus score', url: '/arcade/facilitator-calculator', kind: 'Tool' },
    { title: 'Full Arcade Points Calculator', summary: 'Calculate games, skill badges, bonuses and prize-tier progress', url: '/arcade-calculator.html', kind: 'Tool' },
    { title: 'Skill Badge Directory', summary: 'Browse Google Cloud skill badges by topic and level', url: '/skill-badges', kind: 'Learning' },
    { title: 'Contact B Tecky', summary: 'Start a conversation', url: '/contact', kind: 'Company' }
  ];
  const renderResults = async (query) => {
    const q = query.trim().toLowerCase();
    const catalogue = await loadPosts();
    const articleResults = catalogue.map((post) => ({
      title: post.title, summary: post.summary || (post.tags || []).join(' · '),
      url: '/blog/' + encodeURIComponent(post.slug), kind: 'Article'
    }));
    const matches = [...staticResults, ...articleResults].filter((item) =>
      !q || (item.title + ' ' + item.summary + ' ' + item.kind).toLowerCase().includes(q)
    ).slice(0, 9);
    activeResult = matches.length ? 0 : -1;
    searchResults.innerHTML = matches.length ? matches.map((item, index) =>
      '<a href="' + escapeHtml(item.url) + '" data-result-index="' + index + '"' + (index === 0 ? ' aria-selected="true"' : '') + '>' +
      '<span class="site-search__result-icon">' + (item.kind === 'Article' ? '▤' : '✦') + '</span>' +
      '<span><b>' + escapeHtml(item.title) + '</b><small>' + escapeHtml(item.kind + ' · ' + item.summary) + '</small></span><span>↗</span></a>'
    ).join('') : '<p class="site-search__empty">No matches yet. Try another keyword or browse the <a href="/blog">journal</a>.</p>';
  };
  const openSearch = async () => {
    closeMenus(); closeMobile(); updatesPanel.hidden = true;
    if (!searchDialog.open) searchDialog.showModal();
    await renderResults('');
    searchInput?.focus();
  };
  header.querySelector('[data-search-open]')?.addEventListener('click', openSearch);
  header.querySelector('[data-search-close]')?.addEventListener('click', () => searchDialog.close());
  searchDialog?.addEventListener('click', (event) => {
    if (event.target === searchDialog) searchDialog.close();
  });
  searchInput?.addEventListener('input', () => renderResults(searchInput.value));
  searchInput?.addEventListener('keydown', (event) => {
    const links = [...searchResults.querySelectorAll('a[data-result-index]')];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!links.length) return;
      activeResult = (activeResult + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((link, index) => link.setAttribute('aria-selected', String(index === activeResult)));
      links[activeResult].scrollIntoView({ block: 'nearest' });
    }
    if (event.key === 'Enter' && links[activeResult]) {
      event.preventDefault(); window.location.href = links[activeResult].href;
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); openSearch();
    }
    if (event.key === 'Escape') {
      closeMenus(); closeMobile(); updatesPanel.hidden = true;
    }
  });

  const loadUpdates = async () => {
    if (updatesList.dataset.loaded === 'true') return;
    const catalogue = await loadPosts();
    const latest = catalogue.slice().sort((a,b) => String(b.updatedAt || b.date || '').localeCompare(String(a.updatedAt || a.date || ''))).slice(0,3);
    updatesList.innerHTML = latest.length ? latest.map((post) =>
      '<a href="/blog/' + encodeURIComponent(post.slug) + '"><b>' + escapeHtml(post.title) + '</b><small>' +
      escapeHtml(post.updatedAt || post.date || 'Latest article') + ' · ' + escapeHtml((post.tags || []).slice(0,2).join(' · ') || 'B Tecky Journal') +
      '</small></a>'
    ).join('') : '<p>New articles and product updates will appear here.</p>';
    updatesList.dataset.loaded = 'true';
  };
  updatesToggle?.addEventListener('click', async () => {
    const open = updatesPanel.hidden;
    updatesPanel.hidden = !open;
    updatesToggle.setAttribute('aria-expanded', String(open));
    if (open) { closeMenus(); closeMobile(); header.classList.remove('is-hidden'); await loadUpdates(); }
  });
  header.querySelector('[data-updates-close]')?.addEventListener('click', () => {
    updatesPanel.hidden = true; updatesToggle?.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) {
      updatesPanel.hidden = true; updatesToggle?.setAttribute('aria-expanded', 'false');
      closeMenus();
    }
  });

  const progress = document.querySelector('[data-scroll-progress]');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
    if (progress) progress.style.width = percent + '%';
    const y = window.scrollY;
    const menuOpen = nav?.classList.contains('is-open') || !updatesPanel.hidden || searchDialog?.open;
    if (!reducedMotion && !menuOpen && y > 140 && y > lastScrollY + 5) header.classList.add('is-hidden');
    else if (y < lastScrollY - 4 || y < 70 || menuOpen) header.classList.remove('is-hidden');
    lastScrollY = y;
    scrollTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollTicking) { window.requestAnimationFrame(onScroll); scrollTicking = true; }
  }, { passive: true });
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMobile(); });

  if (finePointer && !reducedMotion) {
    header.querySelectorAll('[data-magnetic]').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
        element.style.transform = 'translate(' + (x * 4) + 'px,' + (y * 3) + 'px)';
      });
      element.addEventListener('pointerleave', () => { element.style.transform = ''; });
    });
  }
  onScroll();
})();