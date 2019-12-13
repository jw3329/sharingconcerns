const express = require('express');

const session = require('express-session');

const bodyParser = require('body-parser');

const PORT = 8000;

const app = express();

const User = require('./models/user');

const Post = require('./models/post');

const api = require('./routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use('/api', api);

app.get('/', (req, res) => {
    res.send('home page');
});

const server = app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});