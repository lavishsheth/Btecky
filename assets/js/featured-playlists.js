(() => {
  const root = document.querySelector("[data-featured-playlists]");
  if (!root) return;

  const escapeHtml = (value = "") =>
    value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));

  fetch("/.netlify/functions/youtube-playlists", {
    headers: { Accept: "application/json" }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Featured playlists unavailable");
      return response.json();
    })
    .then((payload) => {
      const main = payload.channels?.find((channel) => channel.key === "btecky");
      const featured = (main?.playlists || []).slice(0, 4);

      if (!featured.length) {
        root.closest("section")?.remove();
        return;
      }

      root.innerHTML = featured.map((playlist) => `
        <a class="featured-playlist-card"
           href="${playlist.url}"
           target="_blank"
           rel="noopener noreferrer">
          <img src="${playlist.thumbnail}" alt="" loading="lazy" width="480" height="270">
          <span class="featured-playlist-title">${escapeHtml(playlist.title)}</span>
          <span class="featured-playlist-meta">${playlist.videoCount} videos · Watch on YouTube ↗</span>
        </a>
      `).join("");
    })
    .catch((error) => {
      console.warn(error);
      root.closest("section")?.remove();
    });
})();
