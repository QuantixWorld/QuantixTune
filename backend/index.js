const queryString = require('querystring');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('ioredis');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const redis = new Redis();

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var redirect_uri = 'http://localhost:3000/callback'

const port = 3000;

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());

app.get('/login', function(req, res) {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read user-library-modify';

    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
});

app.get('/callback', async function(req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            queryString.stringify({
                error: 'state_mismatch'
            })
        );
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        try {
            const tokenResponse = await axios.post(authOptions.url, authOptions.form, {
                headers: authOptions.headers,
            });

            const accessToken = tokenResponse.data.access_token;
            const refreshToken = tokenResponse.data.refresh_token;
            const expiresIn = tokenResponse.data.expires_in;

            const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
	    
            const userId = userProfileResponse.data.id;

            await redis.hmset(`tokens:${userId}`, {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiry: Date.now() + expiresIn * 1000
            });

            await redis.expire(`tokens:${userId}`, 60 * 60 * 24 * 7);
	    
            res.cookie('userId', userId, { httpOnly: true, sameSite: 'strict', secure: true });
            res.redirect('http://localhost:5173/');
        } catch (error) {
            console.error('Error during token exchange: ', error);
            res.redirect('#' + 
                queryString.stringify({
                    error: 'invalid_token'
                })
            );
        }
    }
});

app.get('/player', async (req, res) => {
    const userId = req.cookies.userId;
    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);
        
        const response = await axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error accessing Spotify API:', error);
        res.status(401).send('Unauthorized');
    }
});

app.get('/is-liked', async (req, res) => {
    const userId = req.cookies.userId;
    const ids = req.query.ids;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        const response = await  axios.get('https://api.spotify.com/v1/me/tracks/contains', {
            params: { ids },
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        });

        const isLiked = response.data[0];
        res.status(200).send(isLiked);
    } catch (error) {
        console.error('Error checking liked tracks', error)
        res.status(401).send('Unauthorized')
    }
})

app.put('/pause', async (req, res) => {
    const userId = req.cookies.userId;
    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.put('https://api.spotify.com/v1/me/player/pause', 
            {},
            {
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        });
    } catch (error) {
        console.error('Error accessing Spotify API: ', error);
        res.status(401).send('Unauthorized');
    }
});

app.put('/play', async (req, res) => {
    const userId = req.cookies.userId;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.put('https://api.spotify.com/v1/me/player/play', 
            {},
            {
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        });
    } catch (error) {
        console.error('Error accessing Spotify API: ', error);
        res.status(401).send('Unauthorized');
    }
})

app.post('/next', async (req, res) => {
    const userId = req.cookies.userId;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.post('https://api.spotify.com/v1/me/player/next', 
            {},
            {
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        });
    } catch (error) {
        console.error('Error accessing Spotify API: ', error);
        res.status(401).send('Unauthorized');
    }
})

app.post('/previous', async (req, res) => {
    const userId = req.cookies.userId;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.post('https://api.spotify.com/v1/me/player/previous', 
            {},
            {
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        });
    } catch (error) {
        console.error('Error accessing Spotify API: ', error);
        res.status(401).send('Unauthorized');
    }
})

app.put('/tracks', async (req, res) => {
    const userId = req.cookies.userId;
    const ids = req.body.ids;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.put('https://api.spotify.com/v1/me/tracks', { ids: ids }, {
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        })
    } catch (error) {
        console.error('Error saving tracks: ', error);
        res.status(401).send('Unauthorized');
    }
})

app.delete('/tracks', async (req, res) => {
    const userId = req.cookies.userId;
    const ids = req.body.ids;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.delete('https://api.spotify.com/v1/me/tracks', {
            data: { ids: ids },
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        })
    } catch (error) {
        console.error('Error saving tracks: ', error);
        res.status(401).send('Unauthorized');
    }
})

app.put('/shuffle', async (req, res) => {
    const userId = req.cookies.userId;
    const state = req.query.state;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.put('https://api.spotify.com/v1/me/player/shuffle', {}, {
            params: { state },
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        })
    } catch (error) {
        console.error('Error toggling shuffle: ', error);
        res.status(401).send('Unauthorized');
    }
})

app.put('/shuffle', async (req, res) => {
    const userId = req.cookies.userId;
    const state = req.query.state;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.put('https://api.spotify.com/v1/me/player/shuffle', {}, {
            params: { state },
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        })
    } catch (error) {
        console.error('Error setting the repeat mode: ', error);
        res.status(401).send('Unauthorized');
    }
})

app.put('/repeat', async (req, res) => {
    const userId = req.cookies.userId;
    const state = req.query.state;

    try {
        await refreshTokenIfNeeded(userId);
        const tokens = await redis.hgetall(`tokens:${userId}`);

        await axios.put('https://api.spotify.com/v1/me/player/repeat', {}, {
            params: { state },
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
            },
        })
    } catch (error) {
        console.error('Error setting the repeat mode: ', error);
        res.status(401).send('Unauthorized');
    }
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

async function refreshTokenIfNeeded(userId) {
    const tokens = await redis.hgetall(`tokens:${userId}`);
    if (!tokens) {
        throw new Error('No tokens found for user');
    }

    const currentTime = Date.now();
    const expiryTime = parseInt(tokens.expiry, 10);

    if (currentTime > expiryTime -5 * 60 * 1000) {
        const refreshOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            },
            data: queryString.stringify({
                grant_type: 'refresh_token',
                refresh_token: tokens.refreshToken,
            }),
            json: true
        };

        const refreshResponse = await axios.post(refreshOptions.url, refreshOptions.data, {
            headers: refreshOptions.headers,
        });

        const newAccessToken = refreshResponse.data.access_token;
        const newExpiresIn = refreshResponse.data.expires_in;

        await redis.hmset(`tokens:${userId}`, {
            accessToken: newAccessToken,
            expiry: currentTime + newExpiresIn * 1000,
        });
    }
}

function generateRandomString(length) {
    let result = "";
    let possibilites = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    for (let i = 0; i < length; i++) {
        result += possibilites.charAt(Math.floor(Math.random() * possibilites.length))
    }

    return result;
}
