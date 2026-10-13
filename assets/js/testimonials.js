/**
 * Reusable testimonials component.
 *
 * Production data is intentionally empty.
 * Add only real, permission-cleared quotes in the array below.
 */
(() => {
  const root = document.querySelector("[data-testimonials]");
  if (!root) return;

  // Keep this empty until real quotes are approved for public use.
  const testimonials = [];

  const escapeHtml = (value = "") =>
    value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));

  root.innerHTML = `
    <section class="testimonials-section" aria-labelledby="testimonials-title">
      <div class="section-intro">
        <p class="eyebrow">Community feedback</p>
        <h2 id="testimonials-title">What the community says</h2>
      </div>
      ${
        testimonials.length
          ? `<div class="testimonial-grid">${testimonials.map((item) => `
              <article class="testimonial-card">
                <div class="testimonial-quote">“${escapeHtml(item.quote)}”</div>
                <div class="testimonial-author">
                  ${item.avatar ? `<img src="${item.avatar}" alt="" loading="lazy">` : ""}
                  <div>
                    <strong>${escapeHtml(item.name)}</strong>
                    <span>${escapeHtml(item.context || "")}</span>
                  </div>
                </div>
                ${item.url ? `<a class="text-link" href="${item.url}" target="_blank" rel="noopener noreferrer">View original ↗</a>` : ""}
              </article>
            `).join("")}</div>`
          : `<div class="testimonials-empty">
              <p>Real community feedback will be added here as it is collected and cleared for public use.</p>
            </div>`
      }
    </section>
  `;
})();
