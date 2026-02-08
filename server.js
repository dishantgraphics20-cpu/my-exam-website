const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/connection.js');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: 'aptitude-quest-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 3600000 // 1 hour
    }
}));

// Routes
app.use('/', require('./routes/index'));
app.use('/student', require('./routes/student'));
app.use('/admin', require('./routes/admin'));

// Database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('SOLUTION: Run database/SIMPLE_FIX.sql in phpMyAdmin');
        }
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Aptitude Quest server running on port ${PORT}`);
    console.log(`🌐 Access the application at: http://localhost:${PORT}`);
});

// Handle port already in use error
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Solutions:');
        console.log('   1. Close the existing server process on this port');
        console.log('   2. Use a different port: PORT=3001 npm start');
        console.log('   3. Kill the process: taskkill /F /IM node.exe');
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});

module.exports = app;
