const Mongoose = require('../db');

const likeSchema = new Mongoose.Schema({
    posts: [Mongoose.Schema.Types.ObjectId],
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
    posts: [Mongoose.Schema.Types.ObjectId],
    likes: likeSchema,
    dislikes: likeSchema,
    views: [Mongoose.Schema.Types.ObjectId],
    replied: [Mongoose.Schema.Types.ObjectId],
    comments: [Mongoose.Schema.Types.ObjectId],
    followers: [Mongoose.Schema.Types.ObjectId],
    followees: [Mongoose.Schema.Types.ObjectId],
    salt: String,
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

const User = Mongoose.model('User', UserSchema);

module.exports = User;