const express = require('express');
const api = express.Router();
const routes = require('.');

api.get('/', (req, res) => {
    res.send('This is home of api router');
});

for (const route in routes) {
    api.use(`/${route}`, routes[route])
}

module.exports = api;