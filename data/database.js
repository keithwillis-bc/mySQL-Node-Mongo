const mysql = require("mysql2/promise");

//username and password in this file is just a placeholder
const pool = mysql.createPool({
  host: "localhost",
  database: "blog",
  user: "keith",
  password: "Pa$$w0rd",
});

module.exports = pool;
