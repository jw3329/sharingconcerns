const express = require('express');
const user = express.Router();
const { User } = require('../models');

user.post('/signup', async (req, res, next) => {
    try {
        const data = await new User(req.body).save();
        res.send(data);
    } catch (error) {
        next(error.message);
    }
});

user.post('/authorize', async (req, res, next) => {
    try {
        const user = await User.findOne(req.body, { password: 0, posts: 0, followers: 0, followees: 0 });
        req.session.user = user;
        res.send(user);
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

user.get('/signout', async (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.send('Successfully deleted');
    });
});

module.exports = user;