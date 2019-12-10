const express = require('express');

const api = express.Router();

api.get('/', (req, res) => {
    res.send('This is home of api router');
});

api.get('/user/:id', (req, res) => {
    res.send('This is user route of router');
});

module.exports = api;