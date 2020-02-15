const Mongoose = require('../db');

const NotificationSchema = new Mongoose.Schema({
    triggered_user: { type: Mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    target_user: { type: Mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    behavior: { type: String, enum: ['like', 'follow', 'comment'], require: true },
    object: new Mongoose.Schema({
        object_id: Mongoose.Schema.Types.ObjectId,
        behavior: { type: String, enum: ['comment', 'post'] }
    }),
    read: { type: Boolean, default: false },
    creationDate: { type: Date, require: true, default: Date.now }
});

const Notification = Mongoose.model('Notification', NotificationSchema);

module.exports = Notification;