const queryString = require("querystring");
const { generateRandomString } = require("../utils/stringUtils");
const axios = require("axios");
const redis = require("../utils/redisUtils");
const express = require("express");
const router = express.Router();

router.get("/auth-status", (req, res) => {
  const userId = req.cookies.userId;

  res.status(200).json({ loggedIn: userId != undefined });
})

router.delete("/logout", function (req, res) {
  res.clearCookie("userId", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  res.status(200).json()
})

router.get("/login", function (req, res) {
  var state = generateRandomString(16);
  var scope =
    "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify user-read-recently-played";

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = "http://localhost:3000/callback";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
    queryString.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    })
  );
});

router.get("/callback", async function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = "http://localhost:3000/callback";

  if (state === null) {
    res.redirect(
      "/#" +
      querystring.stringify({
        error: "state_mismatch",
      })
    );
  } else {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    const tokenResponse = await axios.post(authOptions.url, authOptions.form, {
      headers: authOptions.headers,
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    const expiresIn = Date.now() + tokenResponse.data.expires_in * 1000;

    try {
      const userProfileResponse = await axios.get(
        "https://api.spotify.com/v1/me",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      const userId = userProfileResponse.data.id;

      await redis.saveTokens(userId, accessToken, refreshToken, expiresIn);

      res.cookie("userId", userId, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      res.redirect("http://localhost:5173/");
    } catch (error) {
      console.error("Failed", error);
    }
  }
});

module.exports = router;
