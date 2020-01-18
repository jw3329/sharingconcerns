const express = require('express');
const comment = express.Router();
const { Comment, User, Reply } = require('../models');
const { auth } = require('../middlewares');


/**
 * Reply crud
 */

comment.post('/:id/reply', auth, async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) throw new Error('Reply is empty');
        // if user already liked, unlike, if not like
        const reply = await (await new Comment({ description, isReply: true, user: req.session.user._id }).save()).populate('user', { username: 1, profileImage: 1 }).execPopulate();
        await Comment.findByIdAndUpdate(req.params.id, { $push: { replies: reply._id } });
        await User.findByIdAndUpdate(req.session.user._id, { $push: { replies: reply._id } });
        res.status(201).json({ status: true, reply });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

comment.put('/:id/reply/:replyId', auth, async (req, res) => {
    try {
        // check the user if it is auth user or not
        const { user } = await Comment.findById(req.params.replyId, { user: 1 });
        // if it does not match with current user, then make error
        if (user != req.session.user._id) throw new Error('Current user is not the creator');
        if (!req.body.description) throw new Error('Reply description required.')
        const reply = await (await Comment.findByIdAndUpdate(req.params.replyId, { $set: { ...req.body, updateDate: Date.now() } }, { new: true })).populate('user', { username: 1, profileImage: 1 }).execPopulate();
        res.json({ status: true, reply });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

comment.delete('/:id/reply/:replyId', auth, async (req, res) => {
    try {
        // check the user if it is auth user or not
        const { user } = await Comment.findById(req.params.id, { user: 1 });
        // if it does not match with current user, then make error
        if (user != req.session.user._id) throw new Error('Current user is not the creator');
        await Comment.findByIdAndDelete(req.params.replyId);
        await Comment.findByIdAndUpdate(req.params.id, { $pull: { replies: req.params.replyId } });
        await User.findByIdAndUpdate(user, { $pull: { replies: req.params.replyId } });
        res.json({ status: true });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

comment.get('/:id/replies', async (req, res) => {
    try {
        const { replies: replyIds } = await Comment.findById({ _id: req.params.id }, { replies: 1 });
        const replies = await Comment.find({ _id: { $in: replyIds } }, null, { sort: { creationDate: 1 } }).populate('user', { username: 1, profileImage: 1 });
        res.json({ status: true, replies });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

/**
 * Common
 */

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

module.exports = comment;