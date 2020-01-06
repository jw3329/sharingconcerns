const Mongoose = require('../db');

const CommentSchema = new Mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    likes: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    }, updateDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    // distinguish if it is reply or not
    isReply: {
        type: Boolean,
        required: true,
        default: false
    },
    user: { type: Mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Comment = Mongoose.model('Comment', CommentSchema);

module.exports = Comment;