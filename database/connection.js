const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST,      // mysql.railway.internal
  user: process.env.DB_USER,      // root
  password: process.env.DB_PASS,  // railway password
  database: process.env.DB_NAME,  // railway
  port: 3306,
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

/* 🔥 AUTO CREATE TABLES */
const initSQL = `
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_no VARCHAR(20) UNIQUE,
  password VARCHAR(255)
);
`;

db.query(initSQL, err => {
  if (err) console.error("❌ Table create error:", err);
  else console.log("✅ Tables ready");
});

module.exports = db;
