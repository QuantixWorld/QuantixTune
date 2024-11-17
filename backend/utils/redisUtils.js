const Redis = require("ioredis");
const redis = new Redis();

async function getTokens(userId) {
  return await redis.hgetall(`tokens:${userId}`);
}

async function saveTokens(userId, accessToken, refreshToken, expiryTime) {
  await redis.hmset(`tokens:${userId}`, {
    accessToken,
    refreshToken,
    expiry: expiryTime,
  });
  await redis.expire(`tokens:${userId}`, 60 * 60 * 24 * 7);
}

module.exports = { getTokens, saveTokens };
