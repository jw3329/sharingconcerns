const express = require('express');
const post = express.Router();
const { Post, User, Comment } = require('../models');
const { auth } = require('../middlewares');

post.post('/', auth, async (req, res) => {
    try {
        const data = await new Post({ ...req.body, userId: req.session.user._id }).save();
        await User.findByIdAndUpdate(req.session.user._id, { $push: { posts: data._id } });
        res.status(201).json({ data: { ...data._doc, username: req.session.user.username }, message: 'Successfully created' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.get('/:postThread', auth, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postThread });
        if (!post) res.json({ status: false, message: 'No post thread found' });
        res.json({ status: true, post });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

post.get('/user/:username', auth, async (req, res) => {
    try {
        const { posts: postsId } = await User.findOne({ username: req.params.username }, 'posts');
        const posts = await Post.find({ _id: { $in: postsId } }, null, { sort: { updateDate: -1 } });
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


post.post('/:id/comment', auth, async (req, res) => {
    try {
        if (!req.body.description) throw new Error('Comment description required.')
        const comment = await new Comment({ ...req.body, userId: req.session.user._id }).save();
        await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
        await User.findByIdAndUpdate(req.session.user._id, { $push: { comments: comment._id } });
        res.status(201).json({
            status: true,
            comment: {
                ...comment._doc,
                username: req.session.user.username
            }
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.get('/:id/comments', async (req, res) => {
    try {
        const postComments = await Post.findById(req.params.id, { _id: 0, comments: 1 });
        let comments = await Comment.find({ _id: { $in: postComments.comments } }).sort({ updateDate: -1 });
        comments = await Promise.all(comments.map(async comment => {
            const { username } = await User.findById(comment.userId, { username: 1 });
            return { ...comment._doc, username };
        }));
        res.json({ status: true, comments });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

module.exports = post;