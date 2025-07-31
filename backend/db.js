const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sosnigger@10',
  database: 'EventsInfo',
});

module.exports = db;