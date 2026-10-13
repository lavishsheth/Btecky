/* Honest community ribbon: never publish fabricated testimonials. */
(() => {
  const root = document.querySelector("[data-testimonials]");
  if (!root) return;
  const items = ["Practical tools", "Learning in public", "Built one useful step at a time", "Clear technology guides", "Community-led improvement"];
  root.innerHTML = `
    <section class="community-ribbon-section" aria-labelledby="community-ribbon-title">
      <div class="section-intro"><p class="eyebrow">The B Tecky approach</p><h2 id="community-ribbon-title">Useful by design. Growing with the community.</h2><p>We're collecting genuine feedback as people use our tools. Until then, here's what we're building toward.</p></div>
      <div class="value-ribbon" aria-label="B Tecky values"><div class="value-ribbon-track">${[...items, ...items].map((item) => `<span class="value-ribbon-item"><i aria-hidden="true">✦</i>${item}</span>`).join("")}</div></div>
    </section>`;
})();
