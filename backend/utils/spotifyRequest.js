const axios = require('axios');
const redis = require('../utils/redisUtils');
const { refreshTokenIfNeeded } = require('../utils/authUtils');

async function spotifyRequest(userId, method, endpoint, params = {}, data = {}) {
    await refreshTokenIfNeeded(userId);

    const tokens = await redis.getTokens(userId);
    if (!tokens || !tokens.accessToken) {
        throw new Error('No valid tokens found for user');
    }

    const url = `https://api.spotify.com/v1/${endpoint}`;

    try {
        const config = {
            method,
            url,
            params,
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
                'Content-Type': 'application/json',
            },
        }

        if (['PUT', 'POST', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
            config.data = data;
        }

        const response = await axios(config);

        return response.data;
    } catch (error) {
        console.error(`Spotify API Error (${method.toUpperCase()} ${endpoint}):`, error.response?.data || error.message);
        throw new Error('Spotify API request failed');
    }
}

module.exports = { spotifyRequest };
