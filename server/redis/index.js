const redis = require('redis');
const { promisify } = require('util');
const REDIS_URL = "redis://0.0.0.0";
const client = redis.createClient(REDIS_URL);

client.on('connect', () => {
    console.log('Redis connected');
});

module.exports = {
    ...client,
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    delAsync: promisify(client.del).bind(client),
    keysAsync: promisify(client.keys).bind(client)
};