const Mongoose = require('../db');

const likeSchema = new Mongoose.Schema({
    posts: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [Mongoose.Schema.Types.ObjectId]
});

const UserSchema = new Mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    }, username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }, firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 25
    }, lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 25
    },
    posts: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    likes: likeSchema,
    dislikes: likeSchema,
    views: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    replies: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    comments: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    followers: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followees: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    updateDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    bio: String,
    url: String,
    company: String,
    location: String,
    profileImage: String
});

const User = Mongoose.model('User', UserSchema);

module.exports = User;