const express = require('express');
const post = express.Router();
const { Post, User, Comment } = require('../models');
const { auth } = require('../middlewares');

post.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) throw new Error('Title is empty');
        if (!description) throw new Error('Description is empty');
        const data = await (await new Post({ ...req.body, user: req.session.user._id }).save()).populate('user', { username: 1 }).execPopulate();
        await User.findByIdAndUpdate(req.session.user._id, { $push: { posts: data._id } });
        res.status(201).json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.get('/:postThread', async (req, res) => {
    try {
        const post = await (await Post.findByIdAndUpdate(req.params.postThread, { $inc: { views: 1 } }, { new: true }).populate('user', { username: 1 })).execPopulate();
        await User.findByIdAndUpdate(req.session.user._id, { $push: { views: req.params.postThread } });
        if (!post) res.json({ status: false, message: 'No post thread found' });
        res.json({ status: true, post });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.put('/:postThread', auth, async (req, res) => {
    try {
        // check the user if it is auth user or not
        const { user } = await Post.findById(req.params.postThread, { user: 1 });
        // if it does not match with current user, then make error
        if (user != req.session.user._id) throw new Error('Current user is not the creator');
        const { title, description } = req.body;
        const post = await (await Post.findByIdAndUpdate(req.params.postThread, { $set: { title, description, updateDate: Date.now() } }, { new: true }).populate('user', { username: 1 })).execPopulate();
        if (!post) throw new Error('No post thread found');
        res.json({ status: true, post });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.delete('/:postThread', auth, async (req, res) => {
    try {
        // check the user if it is auth user or not
        const { user } = await Post.findById(req.params.postThread, { user: 1 });
        // if it does not match with current user, then make error
        if (user != req.session.user._id) throw new Error('Current user is not the creator');
        await Post.findByIdAndDelete(req.params.postThread);
        res.json({ status: true });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.get('/user/:username', auth, async (req, res) => {
    try {
        const { posts: postsId } = await User.findOne({ username: req.params.username }, 'posts');
        const posts = await Post.find({ _id: { $in: postsId } }, null, { sort: { creationDate: -1 } }).populate('user', { username: 1 });
        res.json({ status: true, posts });
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
        await User.findByIdAndUpdate(req.session.user._id, { [marked ? '$pull' : '$push']: { 'likes.posts': req.params.id } });
        res.json({ status: true, marked });
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
        await Post.findByIdAndUpdate(req.params.id, { [marked ? '$pull' : '$push']: { dislikes: req.session.user._id } });
        await User.findByIdAndUpdate(req.session.user._id, { [marked ? '$pull' : '$push']: { 'dislikes.posts': req.params.id } });
        res.json({ status: true, marked });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * Comment CRUD
 */

post.post('/:id/comment', auth, async (req, res) => {
    try {
        if (!req.body.description) throw new Error('Comment description required.')
        const comment = await (await new Comment({ ...req.body, user: req.session.user._id }).save()).populate('user', { username: 1 }).execPopulate();
        await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
        await User.findByIdAndUpdate(req.session.user._id, { $push: { comments: comment._id } });
        res.status(201).json({ status: true, comment });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.get('/:id/comments', async (req, res) => {
    try {
        const postComments = await Post.findById(req.params.id, { _id: 0, comments: 1 });
        const comments = await Comment.find({ _id: { $in: postComments.comments } }, null, { sort: { creationDate: 1 } }).populate('user', { username: 1 });
        res.json({ status: true, comments });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.put('/:id/comment/:commentId', auth, async (req, res) => {
    try {
        // check the user if it is auth user or not
        const { user } = await Comment.findById(req.params.commentId, { user: 1 });
        // if it does not match with current user, then make error
        if (user != req.session.user._id) throw new Error('Current user is not the creator');
        if (!req.body.description) throw new Error('Comment description required.')
        const comment = await (await Comment.findByIdAndUpdate(req.params.commentId, { $set: { ...req.body, updateDate: Date.now() } }, { new: true })).populate('user', { username: 1 }).execPopulate();
        res.json({ status: true, comment });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.delete('/:id/comment/:commentId', auth, async (req, res) => {
    try {
        // check the user if it is auth user or not
        const { user } = await Comment.findById(req.params.commentId, { user: 1 });
        // if it does not match with current user, then make error
        if (user != req.session.user._id) throw new Error('Current user is not the creator');
        // delete comment first
        const { replies } = await Comment.findByIdAndDelete(req.params.commentId, { replies: 1 });
        await Comment.deleteMany({ _id: replies });
        // delete post component
        await Post.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.commentId } });
        await User.findByIdAndUpdate(user, { $pull: { comments: req.params.commentId } });
        res.status(201).json({ status: true });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

module.exports = post;