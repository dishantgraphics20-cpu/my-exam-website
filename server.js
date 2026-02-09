require("dotenv").config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/connection.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET || 'aptitude-quest-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 3600000
    }
}));

app.use('/', require('./routes/index'));
app.use('/student', require('./routes/student'));
app.use('/admin', require('./routes/admin'));

const PORT = 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aptitude Quest server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

module.exports = app;
