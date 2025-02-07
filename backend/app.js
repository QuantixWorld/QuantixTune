const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const playerRoutes = require("./routes/player");
const tracksRoutes = require("./routes/tracks");
const playlistRoutes = require("./routes/playlist");
const errorHandler = require("./utils/errorHandler");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use(authRoutes);
app.use(playerRoutes);
app.use(tracksRoutes);
app.use(playlistRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
