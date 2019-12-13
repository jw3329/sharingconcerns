const express = require('express');
const user = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const CodeError = require('../error/code_error');

user.post('/signup', async (req, res, next) => {
    try {
        const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (user) throw new CodeError(400, 'Given user exists');
        const saltRounds = 10;
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        await new User(req.body).save();
        res.send('User has successfully created');
    } catch (error) {
        res.status(error.code).send(error.message);
    }
});

user.post('/authorize', async (req, res, next) => {
    try {
        if (req.session.user) throw new CodeError(400, 'User already has signed in');
        const user = await User.findOne({ username: req.body.username }, { posts: 0, followers: 0, followees: 0 });
        if (!await bcrypt.compare(req.body.password, user.password)) throw new CodeError(401, 'Password does not match');
        user.password = undefined;
        req.session.user = user;
        res.send(user);
    } catch (error) {
        res.status(error.code).send(error.message);
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