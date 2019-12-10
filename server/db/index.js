const Mongoose = require('mongoose');

const mongoUrl = 'mongodb://root:root123@0.0.0.0:27017/sharingconcerns?authSource=admin';

Mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

module.exports = Mongoose;