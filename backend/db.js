const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'EventsInfo',
});

// Provide promise-based helpers while keeping the callback API available.
// Many modules use callbacks (`db.query(...)`) while newer code may `await` queries.
const promiseConn = db.promise();

db.executeAsync = (...args) => promiseConn.execute(...args);
db.queryAsync = (...args) => promiseConn.query(...args);

module.exports = db;