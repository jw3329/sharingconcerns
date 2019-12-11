const Mongoose = require('../db');

const PostSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now()
    }, updateDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const Post = Mongoose.model('Post', PostSchema);

module.exports = Post;