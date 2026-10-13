(() => {
  const API_URL = "/.netlify/functions/youtube-playlists";
  const root = document.querySelector("[data-playlists-root]");
  if (!root) return;

  const escapeHtml = (value = "") =>
    value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));

  const channelIcon = (channel) => `
    <div class="playlist-channel-icon" aria-hidden="true">
      ${escapeHtml(channel.name.slice(0, 1))}
    </div>
  `;

  const playlistCard = (playlist) => `
    <article class="playlist-card">
      <a class="playlist-thumb-link"
         href="${playlist.url}"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="Open ${escapeHtml(playlist.title)} on YouTube">
        <img
          src="${playlist.thumbnail}"
          alt=""
          loading="lazy"
          width="640"
          height="360"
        />
        <span class="playlist-count">${playlist.videoCount} ${playlist.videoCount === 1 ? "video" : "videos"}</span>
      </a>
      <div class="playlist-card-body">
        <h3>${escapeHtml(playlist.title)}</h3>
        <a class="text-link"
           href="${playlist.url}"
           target="_blank"
           rel="noopener noreferrer">
          Watch on YouTube ↗
        </a>
      </div>
    </article>
  `;

  const channelSection = (channel) => {
    const cards = channel.playlists.map(playlistCard).join("");

    return `
      <section class="playlist-channel" aria-labelledby="channel-${channel.key}">
        <div class="playlist-channel-heading">
          <div class="playlist-channel-title">
            ${channelIcon(channel)}
            <div>
              <h2 id="channel-${channel.key}">${escapeHtml(channel.name)}</h2>
              <p>${channel.playlists.length} public ${channel.playlists.length === 1 ? "playlist" : "playlists"}</p>
            </div>
          </div>
          <a class="button button-secondary"
             href="${channel.url}"
             target="_blank"
             rel="noopener noreferrer">
            Visit channel ↗
          </a>
        </div>
        ${
          channel.playlists.length
            ? `<div class="playlist-grid">${cards}</div>`
            : `<p class="playlist-empty">No public playlists were returned for this channel.</p>`
        }
      </section>
    `;
  };

  const render = (payload) => {
    root.innerHTML = `
      <div class="section-intro">
        <p class="eyebrow">YouTube library</p>
        <h1>Playlists</h1>
        <p>Browse playlists across the B Tecky creator network — all in one place.</p>
      </div>
      <div class="playlist-sections">
        ${payload.channels.map(channelSection).join("")}
      </div>
    `;
  };

  const renderError = () => {
    root.innerHTML = `
      <div class="playlist-error">
        <p class="eyebrow">Temporarily unavailable</p>
        <h1>Playlists couldn't load</h1>
        <p>Please try again in a little while. The YouTube feed is cached so normal page loads do not hit the API directly.</p>
        <button class="button" type="button" data-playlist-retry>Try again</button>
      </div>
    `;
    root.querySelector("[data-playlist-retry]")?.addEventListener("click", load);
  };

  async function load() {
    root.setAttribute("aria-busy", "true");
    try {
      const response = await fetch(API_URL, {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Playlist request failed");
      const payload = await response.json();
      if (!Array.isArray(payload.channels)) throw new Error("Invalid playlist response");
      render(payload);
    } catch (error) {
      console.error(error);
      renderError();
    } finally {
      root.setAttribute("aria-busy", "false");
    }
  }

  load();
})();
