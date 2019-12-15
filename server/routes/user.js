const express = require('express');
const user = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const CodeError = require('../error/code_error');
const { auth } = require('../middlewares/index');

user.post('/signup', async (req, res) => {
    try {
        const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (user) throw new CodeError(400, 'Given user exists');
        const saltRounds = 10;
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        await new User(req.body).save();
        res.status(201).json({ message: 'User has successfully created' });
    } catch (error) {
        res.status(error.code).json({ message: error.message });
    }
});

user.post('/authorize', async (req, res) => {
    try {
        if (req.session.user) throw new CodeError(400, 'User already has signed in');
        const user = await User.findOne({ username: req.body.username }, { posts: 0, followers: 0, followees: 0 });
        if (!user) throw new CodeError(400, 'User does not exist with given username');
        if (!await bcrypt.compare(req.body.password, user.password)) throw new CodeError(400, 'Password does not match');
        user.password = undefined;
        req.session.user = user;
        res.json({ message: user });
    } catch (error) {
        res.status(error.code).json({ message: error.message });
    }
});

user.post('/follow', auth, async (req, res) => {
    try {
        const { username } = req.body;
        const follower = await User.findOneAndUpdate({ username }, { $push: { followers: req.session.user._id } });
        if (!follower) throw new CodeError(400, 'The user does not exist');
        await User.findByIdAndUpdate(req.session.user._id, { $push: { followees: follower._id } });
        res.json({ message: 'Successfully followed user' });
    } catch (error) {
        res.status(error.code).json({ message: error.message });
    }
});

user.delete('/follow', auth, async (req, res) => {
    try {
        const { username } = req.body;
        const follower = await User.findOneAndUpdate({ username }, { $pull: { followers: req.session.user._id } });
        if (!follower) throw new CodeError(400, 'The user does not exist');
        await User.findByIdAndUpdate(req.session.user._id, { $pull: { followees: follower._id } });
        res.json({ message: 'Successfully removed followee' });
    } catch (error) {
        res.status(error.code).json({ message: error.message });
    }
});

user.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'No user found' });
    }
});

user.get('/signout', async (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.json({ message: 'Successfully deleted' });
    });
});

module.exports = user;