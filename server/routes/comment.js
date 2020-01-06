const express = require('express');
const comment = express.Router();
const { Comment, User } = require('../models');
const { auth } = require('../middlewares');

comment.post('/:id/like', auth, async (req, res) => {
    try {
        const { likes } = await Comment.findById(req.params.id, { likes: 1 });
        // user already liked the post
        const marked = likes.includes(req.session.user._id);
        // if user already liked, unlike, if not like
        await Comment.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { likes: req.session.user._id } });
        await User.findByIdAndUpdate(req.session.user._id, { [marked ? '$pull' : '$push']: { 'likes.comments': req.params.id } });
        res.json({ status: true, marked });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

comment.post('/:id/dislike', auth, async (req, res) => {
    try {
        const { dislikes } = await Comment.findById(req.params.id, { dislikes: 1 });
        // user already liked the post
        const marked = dislikes.includes(req.session.user._id);
        // if user already liked, unlike, if not like
        await Comment.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { dislikes: req.session.user._id } });
        await User.findByIdAndUpdate(req.session.user._id, { [marked ? '$pull' : '$push']: { 'dislikes.comments': req.params.id } });
        res.json({ status: true, marked });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

comment.post('/:id/reply', auth, async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) throw new Error('Reply is empty');
        // if user already liked, unlike, if not like
        const reply = await new Comment({ description }).save();
        await Comment.findByIdAndUpdate(req.params.id, { $push: { replies: reply._id } });
        await User.findByIdAndUpdate(req.session.user._id, { $push: { comments: reply._id } });
        res.status(201).json({ status: true, reply });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

comment.get('/:id/replies', async (req, res) => {
    try {
        const { replies: replyIds } = await Comment.findById({ _id: req.params.id }, { replies: 1 });
        const replies = await Comment.find({ _id: { $in: replyIds } }).sort({ updateDate: -1 });
        res.json({ status: true, replies });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

module.exports = comment;