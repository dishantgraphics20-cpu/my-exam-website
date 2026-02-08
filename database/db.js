const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL Connected");

  // Create tables automatically
  createTables();
});

function createTables() {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role ENUM('admin','student') NOT NULL,
      email VARCHAR(100),
      roll_no VARCHAR(20),
      password VARCHAR(255) NOT NULL
    )
  `;

  const questionsTable = `
    CREATE TABLE IF NOT EXISTS questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT,
      option_a VARCHAR(255),
      option_b VARCHAR(255),
      option_c VARCHAR(255),
      option_d VARCHAR(255),
      correct_option CHAR(1),
      section VARCHAR(50)
    )
  `;

  db.query(usersTable, () => {
    db.query(questionsTable, () => {
      createAdminIfNotExists();
    });
  });
}

function createAdminIfNotExists() {
  const bcrypt = require("bcrypt");

  db.query(
    "SELECT * FROM users WHERE role='admin'",
    async (err, results) => {
      if (results.length === 0) {
        const hashed = await bcrypt.hash("admin123", 10);

        db.query(
          "INSERT INTO users (role, email, password) VALUES (?,?,?)",
          ["admin", "admin@gmail.com", hashed],
          () => {
            console.log("✅ Admin created");
            console.log("📧 admin@gmail.com");
            console.log("🔑 password: admin123");
          }
        );
      }
    }
  );
}

module.exports = db;
