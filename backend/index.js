const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Backend server running'));

// Placeholder for Spotify OAuth routes (e.g., /login, /callback)
app.get('/login', (req, res) => {
  res.send('Login route - Redirect to Spotify OAuth');
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
