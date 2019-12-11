const express = require('express');
const post = express.Router();
const { Post } = require('../models');

post.post('/', async (req, res, next) => {
    try {
        const data = await new Post(req.body).save();
        res.send(data);
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