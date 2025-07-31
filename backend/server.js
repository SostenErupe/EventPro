require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/user')
const eventsRoutes = require('./routes/events')

const app = express();
const port = 5000;

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api/user', userRoutes)
app.use('/api/events', eventsRoutes)

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
