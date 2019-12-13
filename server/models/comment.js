const Mongoose = require('../db');

const CommentSchema = new Mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    likes: [Mongoose.Schema.Types.ObjectId],
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

const Comment = Mongoose.model('Comment', CommentSchema);

module.exports = Comment;