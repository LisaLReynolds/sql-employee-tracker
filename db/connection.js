const { Pool } = require("pg");

//Connection pool to the database (CONFIG)
const pool = new Pool(
  {
    user: "postgres",
    password: "root",
    host: "localhost",
    database: "business_db",
  },
  console.log("Connected to the business_db database.")
);

pool.connect(); // That makes the REQUEST for a connection to our DB

module.exports = pool;
