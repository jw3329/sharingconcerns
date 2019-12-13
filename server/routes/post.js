const express = require('express');
const post = express.Router();
const { Post, User } = require('../models');
const { auth } = require('../middlewares');

post.post('/', auth, async (req, res, next) => {
    try {
        const data = await new Post(req.body).save();
        await User.findByIdAndUpdate(req.session.user._id, { $push: { posts: data._id } });
        res.json({ data, message: 'Successfully updated' });
    } catch (error) {
        next(error.message);
    }
});

post.get('/:id', async (req, res, next) => {
    try {
        const user = await Post.findById(req.params.id);
        res.json(user);
    } catch (error) {
        next('No user found');
    }
});

module.exports = post;