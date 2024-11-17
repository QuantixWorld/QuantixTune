const axios = require("axios");
const redis = require("./redisUtils");
const queryString = require("querystring");

async function refreshTokenIfNeeded(userId) {
  var client_id = process.env.SPOTIFY_CLIENT_ID;
  var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const tokens = await redis.getTokens(userId);
  if (!tokens) {
    throw new Error("No tokens found for user");
  }

  const currentTime = Date.now();
  const expiryTime = parseInt(tokens.expiry, 10);

  if (currentTime > expiryTime - 5 * 60 * 1000) {
    const refreshOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
      },
      form: queryString.stringify({
        grant_type: "refresh_token",
        refresh_token: tokens.refreshToken,
      }),
      json: true,
    };

    const refreshResponse = await axios.post(
      refreshOptions.url,
      refreshOptions.form,
      {
        headers: refreshOptions.headers,
      }
    );

    const newAccessToken = refreshResponse.data.access_token;
    const newExpiresIn = Date.now() + refreshResponse.data.expires_in * 1000;

    await redis.saveTokens(
      userId,
      newAccessToken,
      tokens.refreshToken,
      newExpiresIn
    );
    /**/
  }
}

module.exports = { refreshTokenIfNeeded };
