const express = require('express');
const comment = express.Router();
const { Comment, User } = require('../models');
const { auth } = require('../middlewares');

comment.post('/:id/like', auth, async (req, res) => {
    try {
        const { likes } = await Comment.findById(req.params.id, { likes: 1 });
        // user already liked the post
        let marked = likes.includes(req.session.user._id);
        // if user already liked, unlike, if not like
        await Comment.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { likes: req.session.user._id } });
        await User.findByIdAndUpdate(req.session.user._id, { [marked ? '$pull' : '$push']: { 'likes.comments': req.params.id } });
        res.json({ message: `Successfully ${marked ? 'un' : ''}marked comment like` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

comment.post('/:id/dislike', auth, async (req, res) => {
    try {
        const { dislikes } = await Comment.findById(req.params.id, { dislikes: 1 });
        // user already liked the post
        let marked = dislikes.includes(req.session.user._id);
        // if user already liked, unlike, if not like
        await Comment.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { dislikes: req.session.user._id } });
        await User.findByIdAndUpdate(req.session.user._id, { [marked ? '$pull' : '$push']: { 'dislikes.comments': req.params.id } });
        res.json({ message: `Successfully ${marked ? 'un' : ''}marked comment dislike` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

comment.post('/:id/reply', auth, async (req, res) => {
    try {
        const { description } = req.body;
        // if user already liked, unlike, if not like
        const reply = await new Comment({ description }).save();
        await Comment.findByIdAndUpdate(req.params.id, { $push: { replies: reply._id } });
        await User.findByIdAndUpdate(req.session.user._id, { $push: { comments: reply._id } });
        res.status(201).json({ message: 'Successfully created reply', reply });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = comment;