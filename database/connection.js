const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("PostgreSQL pool connection failed:", err.message);
  } else {
    console.log("PostgreSQL pool connected successfully");
    release();
  }
});

const query = (text, params, callback) => {
  const pgText = text;
  pool.query(pgText, params, (err, res) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res.rows);
    }
  });
};

module.exports = { query };
