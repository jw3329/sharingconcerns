const express = require('express');
const post = express.Router();
const { Post, User, Comment } = require('../models');
const { auth } = require('../middlewares');
const { CodeError } = require('../error/code_error');

post.post('/', auth, async (req, res) => {
    try {
        const data = await new Post(req.body).save();
        await User.findByIdAndUpdate(req.session.user._id, { $push: { posts: data._id } });
        res.status(201).json({ data, message: 'Successfully created' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.post('/:id/comment', auth, async (req, res) => {
    try {
        const comment = await new Comment(req.body).save();
        await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
        await User.findByIdAndUpdate(req.session.user._id, { $push: { comments: comment._id } });
        res.status(201).json({
            comment,
            message: 'Successfully created comment'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.get('/:id/comments', async (req, res) => {
    try {
        const postComments = await Post.findById(req.params.id, { _id: 0, comments: 1 });
        const comments = await Comment.find({ _id: { $in: postComments.comments } });
        res.json(comments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = post;