const express = require('express');

const BodyParser = require('body-parser');

const PORT = 8000;

const app = express();

const User = require('./models/user');

const Post = require('./models/post');

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    for (let i = 100; i < 200; i++) {
        const user = new User({
            email: `test${i}@test.com`,
            username: `username${i}`,
            password: `password${i}`,
            firstName: `firstName${i}`,
            lastName: `lastName${i}`,
        });
        user.save(err => {
            if (err) throw err;
            console.log(`user${i} has created`);
        });
    }
    res.send('done');
});

const server = app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});