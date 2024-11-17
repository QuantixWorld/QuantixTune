const express = require("express");
const { spotifyRequest } = require("../utils/spotifyRequest");
const router = express.Router();

router.get("/player", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  const playerState = await spotifyRequest(userId, "get", "me/player");
  res.json(playerState);
});

router.post("/next", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "post", "me/player/next");
});

router.put("/pause", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "put", "me/player/pause");
});

router.put("/play", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "put", "me/player/play");
});

router.post("/previous", async (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "post", "me/player/previous");
});

router.put("/shuffle", async (req, res) => {
  const userId = req.cookies.userId;
  const state = req.query.state;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "put", "me/player/shuffle", { state });
});

router.put("/repeat", async (req, res) => {
  const userId = req.cookies.userId;
  const state = req.query.state;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "put", "me/player/repeat", { state });
});

router.put("/seek", async (req, res) => {
  const userId = req.cookies.userId;
  const position_ms = req.query.position_ms;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "put", "me/player/seek", { position_ms });
});

router.put("/volume", async (req, res) => {
  const userId = req.cookies.userId;
  const volume_percent = req.query.volume_percent;
  if (!userId) return res.status(401).send("Unauthroized: Missing user ID");

  await spotifyRequest(userId, "put", "me/player/volume", { volume_percent });
});

module.exports = router;
