const Mongoose = require('../db');

const UserSchema = new Mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }, username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }, firstName: {
        type: String,
        required: true,
        trim: true
    }, lastName: {
        type: String,
        required: true,
        trim: true
    }, posts: {
        type: Array
    }, creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    }, updateDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const User = Mongoose.model('User', UserSchema);

module.exports = User;