const express = require('express');
const user = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { auth } = require('../middlewares/index');

user.post('/signup', async (req, res) => {
    try {
        const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (user && user.email === req.body.email) throw new Error('Given email exists');
        if (user && user.username === req.body.username) throw new Error('Given username exists');
        if (req.body.password !== req.body.confirmPassword) throw new Error('Password and confirm password does not match');
        const saltRounds = 10;
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        await new User(req.body).save();
        res.status(201).json({ message: 'User has successfully created' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

user.post('/authorize', async (req, res) => {
    try {
        if (req.session.user) throw new Error('User already has signed in');
        const user = await User.findOne({ username: req.body.username }, 'email username password firstName lastName creationDate updateDate');
        if (!user) throw new Error('User does not exist with given username');
        if (!await bcrypt.compare(req.body.password, user.password)) throw new Error('Password does not match');
        user.password = undefined;
        req.session.user = user;
        res.json({ status: true, user });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

user.post('/follow', auth, async (req, res) => {
    try {
        const { username } = req.body;
        const { _id: followeeId } = await User.findOne({ username }, { _id: 1 });
        // handle case where followee does not exist
        if (!followeeId) throw new Error('The user does not exist');
        const { followees, _id: followerId } = await User.findById(req.session.user._id, { followees: 1 });
        const following = followees.includes(followeeId);

        await User.findByIdAndUpdate(followerId, { [following ? '$pull' : '$push']: { followees: followeeId } });
        await User.findByIdAndUpdate(followeeId, { [following ? '$pull' : '$push']: { followers: followerId } });

        res.json({ message: `Successfully ${following ? 'un' : ''}followed user` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

user.get('/', (req, res) => {
    if (req.session.user) res.json({ status: true, user: req.session.user });
    else res.json({ status: false, message: 'No user found' });
});

user.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json({ status: true, user });
    } catch (error) {
        res.json({ status: false, message: 'No user found' });
    }
});

user.get('/signout', async (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.json({ message: 'Successfully deleted' });
    });
});

module.exports = user;