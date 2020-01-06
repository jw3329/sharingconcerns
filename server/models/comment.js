const Mongoose = require('../db');

const CommentSchema = new Mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    likes: [Mongoose.Schema.Types.ObjectId],
    dislikes: [Mongoose.Schema.Types.ObjectId],
    replies: [Mongoose.Schema.Types.ObjectId],
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
    // userId,
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Comment = Mongoose.model('Comment', CommentSchema);

module.exports = Comment;