/**
 * B Tecky — cached YouTube playlist feed
 *
 * Netlify Function:
 *   GET /.netlify/functions/youtube-playlists
 *
 * Required Netlify environment variable:
 *   YOUTUBE_API_KEY
 *
 * The API key is never sent to the browser.
 * CDN cache: 8 hours, with stale-while-revalidate for 24 hours.
 */
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

const CHANNELS = [
  {
    key: "btecky",
    name: "B Tecky",
    channelId: "UCS9BcPpwy1W5Xorp0KU23aQ",
    url: "https://www.youtube.com/channel/UCS9BcPpwy1W5Xorp0KU23aQ"
  },
  {
    key: "algorithms-code",
    name: "Algorithms & Code",
    handle: "@Algorithm-Code",
    url: "https://www.youtube.com/@Algorithm-Code"
  },
  {
    key: "kalkaengineer",
    name: "KalkaEngineer",
    channelId: "UCzzC_uXopXyECc6prGABCCA",
    url: "https://www.youtube.com/channel/UCzzC_uXopXyECc6prGABCCA"
  },
  {
    key: "job-dekho",
    name: "Job Dekho",
    handle: "@placeadda",
    url: "https://www.youtube.com/@placeadda"
  }
];

const json = (body, status = 200, headers = {}) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control":
      "public, s-maxage=28800, stale-while-revalidate=86400",
    ...headers
  },
  body: JSON.stringify(body)
});

async function yt(path, params) {
  const url = new URL(`${YOUTUBE_API}/${path}`);
  Object.entries({ ...params, key: process.env.YOUTUBE_API_KEY }).forEach(
    ([key, value]) => url.searchParams.set(key, value)
  );

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || `YouTube API error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function resolveChannel(channel) {
  if (channel.channelId) return channel.channelId;

  // YouTube's channels.list supports handles for public channel lookup.
  const data = await yt("channels", {
    part: "id,snippet",
    forHandle: channel.handle
  });

  const item = data.items?.[0];
  if (!item) throw new Error(`Could not resolve ${channel.handle}`);

  return item.id;
}

async function getPlaylists(channel) {
  const channelId = await resolveChannel(channel);
  const playlists = [];

  let pageToken = "";

  do {
    const data = await yt("playlists", {
      part: "snippet,contentDetails",
      channelId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {})
    });

    for (const item of data.items || []) {
      if (item.snippet?.title === "Uploads") continue;

      // playlistItems.list is intentionally used to verify that the playlist
      // has publicly accessible items and to get the first item's video ID.
      const items = await yt("playlistItems", {
        part: "snippet,contentDetails",
        playlistId: item.id,
        maxResults: "1"
      });

      const first = items.items?.[0];
      playlists.push({
        id: item.id,
        title: item.snippet?.title || "Untitled playlist",
        description: item.snippet?.description || "",
        thumbnail:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          "",
        videoCount: Number(item.contentDetails?.itemCount || 0),
        firstVideoId: first?.contentDetails?.videoId || null,
        url: `https://www.youtube.com/playlist?list=${encodeURIComponent(item.id)}`
      });
    }

    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return {
    ...channel,
    channelId,
    playlists
  };
}

exports.handler = async () => {
  if (!process.env.YOUTUBE_API_KEY) {
    return json(
      {
        error: "YOUTUBE_API_KEY is not configured in Netlify environment variables."
      },
      500,
      { "Cache-Control": "no-store" }
    );
  }

  try {
    const channels = [];
    for (const channel of CHANNELS) {
      channels.push(await getPlaylists(channel));
    }

    return json({
      generatedAt: new Date().toISOString(),
      ttlSeconds: 28800,
      channels
    });
  } catch (error) {
    console.error(error);
    return json(
      {
        error: "Unable to load YouTube playlists right now.",
        detail:
          process.env.CONTEXT === "deploy-preview" ? error.message : undefined
      },
      502,
      { "Cache-Control": "no-store" }
    );
  }
};
