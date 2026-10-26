const { handler } = require("../netlify/functions/youtube-playlists");

module.exports = async (_req, res) => {
  try {
    const result = await handler();
    Object.entries(result.headers || {}).forEach(([name, value]) => {
      res.setHeader(name, value);
    });
    return res.status(result.statusCode || 200).send(result.body);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unable to load YouTube playlists right now." });
  }
};