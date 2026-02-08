const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aptitude_quest',
    multipleStatements: true,
    reconnect: true
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database does not exist. Please run SIMPLE_FIX.sql first');
        }
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;
