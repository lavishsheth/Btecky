(() => {
  const API_URL = "/api/youtube-playlists";
  const CHANNEL_PLAYLISTS_URL = "https://www.youtube.com/channel/UCS9BcPpwy1W5Xorp0KU23aQ/playlists";
  const FALLBACK_PAYLOAD = {
    channels: [{
      key: "btecky",
      name: "B Tecky",
      url: CHANNEL_PLAYLISTS_URL,
      playlists: [
        { id: "PLCwYbB8UztgM", title: "Google Learn With Communities 2026", videoCount: 6, firstVideoId: "v4lLhiqyG_Q" },
        { id: "PLWiIoKE_Juj8", title: "Google Cloud Study Jam 2026", videoCount: 1, firstVideoId: "Dl9fAEnoI5s" },
        { id: "PLHfG5z55qcXs", title: "Kestra Hacktoberfest 2026", videoCount: 2, firstVideoId: "U2BPgdxc3I4" },
        { id: "PLbJhMRo_rEjs", title: "Arcade Adventure: Google Cloud ML APIs", videoCount: 7, firstVideoId: "Kc3pKJMH7n8" },
        { id: "PLTIuaqKWnLCw", title: "Arcade Trail: Containers & Load Balancing", videoCount: 6, firstVideoId: "VCSm5Qoy4OA" },
        { id: "PLFVx8GUEltNc", title: "Arcade Voyage: Language, Voice, and Multimodal Processing", videoCount: 7, firstVideoId: "dI_KrIWO86c" },
        { id: "PLaFQYHjgd-vA", title: "Arcade Base Camp October 2026", videoCount: 6, firstVideoId: "C-M9rzhvsUI" },
        { id: "PLUE6B4qQsZKc", title: "Arcade Simulator: Site Reliability Engineer", videoCount: 6, firstVideoId: "3KMUUhZhaqM" },
        { id: "PLPs7XUAcZhTc", title: "Trick-or-Metric", videoCount: 6, firstVideoId: "PeD5iiIJz8g" },
        { id: "PLB3Ug3UvAO5A", title: "Google DevFest 2026", videoCount: 3, firstVideoId: "kWLOARdcNh4" }
      ].map((playlist) => ({
        ...playlist,
        thumbnail: `https://i.ytimg.com/vi/${playlist.firstVideoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/playlist?list=${playlist.id}`
      }))
    }]
  };
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

  const render = (payload, isFallback = false) => {
    const playlistCount = payload.channels.reduce(
      (count, channel) => count + channel.playlists.length,
      0
    );
    root.innerHTML = `
      <div class="playlist-feed-status ${isFallback ? "is-fallback" : ""}" role="status">
        <span class="playlist-status-dot" aria-hidden="true"></span>
        ${isFallback ? "" : "<span>Public playlists from B Tecky</span>"}
        <span class="playlist-feed-count">${playlistCount} playlists</span>
      </div>
      <div class="playlist-sections">
        ${payload.channels.map(channelSection).join("")}
      </div>
      ${isFallback ? `<div class="playlist-fallback-actions"><a class="text-link" href="${CHANNEL_PLAYLISTS_URL}" target="_blank" rel="noopener noreferrer">See all current playlists on YouTube ↗</a><button class="button button-secondary" type="button" data-playlist-retry>Retry live feed</button></div>` : ""}
    `;
    root.querySelector("[data-playlist-retry]")?.addEventListener("click", load);
  };

  const renderError = () => {
    root.innerHTML = `
      <div class="playlist-error">
        <p class="eyebrow">Temporarily unavailable</p>
        <h1>Playlist feed couldn't load</h1>
        <p>You can still browse the public playlists on the B Tecky YouTube channel.</p>
        <p><a class="button" href="${CHANNEL_PLAYLISTS_URL}" target="_blank" rel="noopener noreferrer">Open B Tecky playlists ↗</a></p>
        <button class="button button-secondary" type="button" data-playlist-retry>Try again</button>
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
      console.warn(error);
      render(FALLBACK_PAYLOAD, true);
    } finally {
      root.setAttribute("aria-busy", "false");
    }
  }

  load();
})();
