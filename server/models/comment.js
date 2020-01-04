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
    }
});

const Comment = Mongoose.model('Comment', CommentSchema);

module.exports = Comment;