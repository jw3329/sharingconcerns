const express = require('express');
const user = express.Router();
const { User } = require('../models');

user.post('/', async (req, res, next) => {
    try {
        const data = await new User(req.body).save();
        res.send(data);
    } catch (error) {
        next(error.message);
    }
});

user.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        next('No user found');
    }
});

module.exports = user;