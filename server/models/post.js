const Mongoose = require('../db');

const PostSchema = new Mongoose.Schema({
    title: String,
    description: String,
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