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
    likes: [Mongoose.Schema.Types.ObjectId],
    dislikes: [Mongoose.Schema.Types.ObjectId],
    comments: [Mongoose.Schema.Types.ObjectId],
    creationDate: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now
    }, updateDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Post = Mongoose.model('Post', PostSchema);

module.exports = Post;