const Mongoose = require('../db');

const NotificationSchema = new Mongoose.Schema({
    from: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    behave: { type: String, enum: ['post', 'comment', 'reply', 'like', 'dislike'] },
    object: { type: String, enum: ['post', 'comment', 'reply'] },
    creationDate: { type: Date, require: true, default: Date.now }
});

const Notification = Mongoose.model('Notification', NotificationSchema);

module.exports = Notification;