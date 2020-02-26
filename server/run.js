const express = require('express');

const session = require('express-session');

const cookieSession = require('cookie-session');

const bodyParser = require('body-parser');

const cors = require('cors');

const PORT = 8000;

const app = express();

const api = require('./routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    // secret: 'secret',
    // resave: true,
    // saveUninitialized: true
    name: 'session',
    secret: 'secret'
}));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use('/api', api);

app.get('/', (req, res) => {
    res.send('home page');
});

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});
