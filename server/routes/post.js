const express = require('express');
const post = express.Router();
const { Post, User } = require('../models');
const { auth } = require('../middlewares');
const { CodeError } = require('../error/code_error');

post.post('/', auth, async (req, res) => {
    try {
        const data = await new Post(req.body).save();
        await User.findByIdAndUpdate(req.session.user._id, { $push: { posts: data._id } });
        res.json({ data, message: 'Successfully created' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.get('/:id', async (req, res) => {
    try {
        const user = await Post.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'No user found' });
    }
});

module.exports = post;