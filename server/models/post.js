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
    views: {
        type: Number,
        default: 0
    },
    likes: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    creationDate: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now
    }, updateDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

const Post = Mongoose.model('Post', PostSchema);

module.exports = Post;