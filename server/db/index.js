const Mongoose = require('mongoose');

const mongoUrl = 'mongodb://root:root123@localhost:27017/sharingconcerns?authSource=admin';

Mongoose.connect(
    mongoUrl,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    () => { console.log('Connected to mongoDB') }
).catch(err => console.log(err));

module.exports = Mongoose;