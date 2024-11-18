const express = require("express");
const { spotifyRequest } = require("../utils/spotifyRequest");
const router = express.Router();

router.get("/is-liked", async (req, res) => {
  const userId = req.cookies.userId;
  const ids = req.query.ids;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");
  if (!ids) return res.status(400).send('Missing ids');

  const response = await spotifyRequest(userId, "get", "me/tracks/contains", {
    ids,
  });

  const isLiked = response[0];
  res.status(200).send(isLiked);
});

router.put("/tracks", async (req, res) => {
  const userId = req.cookies.userId;
  const ids = req.body.ids;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "put", "me/tracks", {}, { ids });
});

router.delete("/tracks", async (req, res) => {
  const userId = req.cookies.userId;
  const ids = req.body.ids;
  if (!userId) return res.status(401).send("Unauthorized: Missing user ID");

  await spotifyRequest(userId, "delete", "me/tracks", {}, { ids });
});

module.exports = router;
