/* Add real, locally hosted editorial artwork to blog cards without external image dependencies. */
(() => {
  const cards = document.querySelectorAll('.post-card');
  const coverFor = (card) => {
    const label = ((card.getAttribute('data-tags') || '') + ' ' + (card.querySelector('.chip-t')?.textContent || '') + ' ' + (card.querySelector('h3')?.textContent || '')).toLowerCase();
    if (/arcade|points|score|prize|badge/.test(label)) return 'arcade.svg';
    if (/ai agent|artificial intelligence|agent/.test(label)) return 'ai.svg';
    if (/apple|news|iphone|ceo|tech news/.test(label)) return 'news.svg';
    if (/google cloud|cloud/.test(label)) return 'cloud.svg';
    if (/learning|roadmap|welcome|b tecky|channel|guide/.test(label)) return 'learning.svg';
    return 'btecky.svg';
  };
  cards.forEach((card) => {
    const cover = card.querySelector('.cv');
    if (!cover || cover.querySelector('img')) return;
    const img = document.createElement('img');
    img.src = '/assets/images/blog-covers/' + coverFor(card);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    cover.appendChild(img);
  });
})();
