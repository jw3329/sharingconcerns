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

post.post('/:id/like', auth, async (req, res) => {
    try {
        const { likes } = await Post.findById(req.params.id, { likes: 1 });
        // user already liked the post
        let marked = likes.includes(req.session.user._id);
        // if user already liked, unlike, if not like
        await Post.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { likes: req.session.user._id } });
        await User.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { 'likes.posts': req.params.id } });
        res.json({ message: `Successfully ${marked ? 'un' : ''}marked like` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.post('/:id/dislike', auth, async (req, res) => {
    try {
        const { dislikes } = await Post.findById(req.params.id, { dislikes: 1 });
        // user already disliked the post
        let marked = dislikes.includes(req.session.user._id);
        // if user already disliked
        await Post.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { likes: req.session.user._id } });
        await User.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { 'dislikes.posts': req.params.id } });
        res.json({ message: `Successfully ${marked ? 'un' : ''}marked dislike` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.post('/:id/dislike', auth, async (req, res) => {
    try {
        const { dislikes } = await Post.findById(req.params.id, { dislikes: 1 });
        let marked = !dislikes.includes(req.session.user._id);
        await Post.findByIdAndUpdate(req.params.id, { [marked ? '$remove' : '$push']: { dislikes: req.session.user._id } });
        res.json({ message: `Successfully ${marked ? '' : 'un'}marked dislike` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.put('/:id/dislike', auth, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $push: { dislikes: req.session.user._id } });
        res.json({ message: 'Successfully marked dislike' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.delete('/:id/dislike', auth, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $remove: { dislikes: req.session.user._id } });
        res.json({ message: 'Successfully unmarked dislike' });
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