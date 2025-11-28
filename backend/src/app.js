const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route files
const auth = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Mount routers
app.use('/api/auth', auth);

// Basic Route
app.get('/', (req, res) => {
  res.send('EventLink API is running...');
});

module.exports = app;
