(() => {
  const root = document.querySelector("[data-partners]");
  if (!root) return;

  /*
   * Relationships supplied for this site are presented as
   * collaborations, based on B Tecky/Lavish content and participation.
   * This wording does not imply sponsorship, endorsement, or an exclusive
   * commercial partnership.
   */
  const partners = [
    {
      name: "be10x",
      relationship: "Creator collaboration",
      url: "https://be10x.com/",
      logo: "https://www.google.com/s2/favicons?domain=be10x.com&sz=128"
    },
    {
      name: "Hack2Skill",
      relationship: "Technology ecosystem",
      url: "https://hack2skill.com/",
      logo: "https://www.google.com/s2/favicons?domain=hack2skill.com&sz=128"
    },
    {
      name: "Scaler",
      relationship: "Learning ecosystem",
      url: "https://www.scaler.com/",
      logo: "https://www.google.com/s2/favicons?domain=scaler.com&sz=128"
    },
    {
      name: "Masai School",
      relationship: "Learning ecosystem",
      url: "https://www.masaischool.com/",
      logo: "https://www.google.com/s2/favicons?domain=masaischool.com&sz=128"
    },
    {
      name: "NVIDIA",
      relationship: "Creator / learning activity",
      url: "https://www.nvidia.com/",
      logo: "https://cdn.simpleicons.org/nvidia"
    },
    {
      name: "Coding Ninjas",
      relationship: "Learning ecosystem",
      url: "https://www.codingninjas.com/",
      logo: "https://www.google.com/s2/favicons?domain=codingninjas.com&sz=128"
    }
  ];

  root.innerHTML = `
    <section class="partners-section" aria-labelledby="partners-title">
      <div class="section-intro">
        <p class="eyebrow">Partners & collaborations</p>
        <h2 id="partners-title">Organisations in our technology ecosystem</h2>
        <p>A mix of creator collaborations, learning platforms and technology communities. These relationships are not all formal partnerships.</p>
      </div>
      <div class="partner-grid">
        ${partners.map((partner) => `
          <a class="partner-card"
             href="${partner.url}"
             target="_blank"
             rel="noopener noreferrer"
             title="${partner.name}">
            <div class="partner-logo-wrap">
              <img src="${partner.logo}" alt="${partner.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${partner.name.charAt(0)}'">
            </div>
            <strong>${partner.name}</strong>
            <span>${partner.relationship}</span>
          </a>
        `).join("")}
      </div>
    </section>
  `;
})();
