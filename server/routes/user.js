const express = require('express');
const user = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { auth } = require('../middlewares/index');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
        cb(null, file.originalname + '_' + Date.now());
    }
});

const upload = multer({ storage }).single('image');

const userFields = {
    password: 0,
    posts: 0,
    likes: 0,
    dislikes: 0,
    views: 0,
    replies: 0,
    comments: 0,
    followers: 0,
    followees: 0
};

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
        const refinedUserFields = { ...userFields };
        delete refinedUserFields.password;
        const user = (await User.findOne({ username: req.body.username }, refinedUserFields)).toObject();
        if (!user) throw new Error('User does not exist with given username');
        if (!await bcrypt.compare(req.body.password, user.password)) throw new Error('Password does not match');
        delete user.password;
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

user.get('/signout', auth, (req, res, next) => {
    req.session.destroy(err => {
        if (err) res.json({ status: false, message: err });
        res.json({ status: true, message: 'Successfully deleted' });
    });
});

user.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json({ status: true, user });
    } catch (error) {
        res.json({ status: false, message: 'No user found' });
    }
});

user.put('/', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.session.user._id,
            { $set: { ...req.body, updateDate: Date.now() } }, { new: true, fields: userFields });
        req.session.user = user;
        res.json({ status: true, user, message: 'Successfully updated the user' });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

user.put('/profileImage', auth, async (req, res) => {
    try {
        upload(req, res, async err => {
            if (err) throw new Error(err);
            await User.findByIdAndUpdate(req.session.user._id, { $set: { profileImage: req.file.filename } });
            res.json({ status: true });
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

user.get('/:id/profileImage', auth, async (req, res) => {
    try {
        const { profileImage } = await User.findById(req.params.id, { profileImage: 1 });
        res.sendFile(__dirname + '/../images' + profileImage);
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});


user.get('/', (req, res) => {
    if (req.session.user) res.json({ status: true, user: req.session.user });
    else res.json({ status: false, message: 'No user found' });
});

module.exports = user;