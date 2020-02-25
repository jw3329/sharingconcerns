const express = require('express');
const post = express.Router();
const { Post, User, Comment, Notification } = require('../models');
const { auth } = require('../middlewares');
const Utils = require('../utils');

post.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) throw new Error('Title is empty');
        if (!description) throw new Error('Description is empty');
        const data = await (await new Post({ ...req.body, user: req.session.user._id }).save()).populate('user', { username: 1, profileImage: 1 }).execPopulate();
        // const notification = await new Notification({ from: req.session.user._id, to: req.session.user._id, behave: 'post', object: data._id }).save();
        await User.findByIdAndUpdate(req.session.user._id, { $push: { posts: data._id } });
        res.status(201).json({ status: true, data });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.get('/', async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user', { username: 1, profileImage: 1 });
        posts.sort((a, b) => Utils.hot(b.likes.length, b.dislikes.length, b.updateDate) - Utils.hot(a.likes.length, a.dislikes.length, a.updateDate));
        res.json({ status: true, posts });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

post.get('/:postThread', async (req, res) => {
    try {
        const post = await (await Post.findByIdAndUpdate(req.params.postThread, { $inc: { views: 1 } }, { new: true }).populate('user', { username: 1, profileImage: 1 })).execPopulate();
        await User.findByIdAndUpdate(req.session.user._id, { $push: { views: req.params.postThread } });
        if (!post) res.json({ status: false, message: 'No post thread found' });
        res.json({ status: true, post });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

post.put('/:postThread', auth, async (req, res) => {
    try {
        // check the user if it is auth user or not
        const { user } = await Post.findById(req.params.postThread, { user: 1 });
        // if it does not match with current user, then make error
        if (user != req.session.user._id) throw new Error('Current user is not the creator');
        const { title, description } = req.body;
        const post = await (await Post.findByIdAndUpdate(req.params.postThread, { $set: { title, description, updateDate: Date.now() } }, { new: true }).populate('user', { username: 1, profileImage: 1 })).execPopulate();
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
        const posts = await Post.find({ _id: { $in: postsId } }, null, { sort: { creationDate: -1 } }).populate('user', { username: 1, profileImage: 1 });
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
        const comment = await (await new Comment({ ...req.body, user: req.session.user._id }).save()).populate('user', { username: 1, profileImage: 1 }).execPopulate();
        // create notification if commented user is not same as posted user
        let notification = null;
        if (comment.user._id != req.session.user._id) {
            notification = await new Notification({
                triggered_user: req.session.user._id,
                target_user: comment.user._id,
                behavior: 'comment',
                behavior_id: comment._id,
                object: {
                    object_id: req.params.id,
                    behavior: 'post'
                }
            }).save();
        }
        await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
        await User.findByIdAndUpdate(req.session.user._id, { $push: { comments: comment._id, ...notification && { notifications: notification._id } } });
        res.status(201).json({ status: true, comment });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

post.get('/:id/comments', async (req, res) => {
    try {
        const postComments = await Post.findById(req.params.id, { _id: 0, comments: 1 });
        const comments = await Comment.find({ _id: { $in: postComments.comments } }).populate('user', { username: 1, profileImage: 1 });
        comments.sort((a, b) => Utils.commentRanking(a.likes.length, a.dislikes.length) - Utils.commentRanking(b.likes.length, b.dislikes.length));
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
        if (!req.body.description) throw new Error('Comment description required.');
        const comment = await (await Comment.findByIdAndUpdate(req.params.commentId, { $set: { ...req.body, updateDate: Date.now() } }, { new: true })).populate('user', { username: 1, profileImage: 1 }).execPopulate();
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
        // delete notification first, then get the variable accordingly
        const notification = await Notification.findOneAndDelete({
            triggered_user: req.session.user._id,
            target_user: (await Post.findById(req.params.id, { user: 1 })).user,
            behavior: 'comment',
            behavior_id: req.params.commentId,
            object: {
                object_id: req.params.id,
                behavior: 'post'
            }
        });
        console.log(notification);
        // delete post component
        await Post.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.commentId } });
        await User.findByIdAndUpdate(user, { $pull: { comments: req.params.commentId, ...notification && { notifications: notification._id } } });
        res.json({ status: true });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

module.exports = post;