const app = require('../src/app');
const connectDB = require('../src/config/db');

// Connect to database
connectDB();

module.exports = app;
