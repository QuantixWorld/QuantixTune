const express = require("express");
const { spotifyRequest, reversiveRequest } = require("../utils/spotifyRequest");
const router = express.Router();

router.get("/playlists", async (req, res) => {
  const userId = req.cookies.userId;
  const limit = req.query.limit;
  const offset = req.query.offset;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  const response = await reversiveRequest(userId, "me/playlists", {
    limit,
    offset
  });

  res.json(response);
});

router.get("/playlists/tracks", async (req, res) => {
  const userId = req.cookies.userId;
  const playlistId = req.query.playlistId;

  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  const response = await reversiveRequest(userId, `playlists/${playlistId}/tracks`);

  res.json(response);
});

module.exports = router;
