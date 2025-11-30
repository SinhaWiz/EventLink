const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route files
const auth = require('./routes/authRoutes');
const events = require('./routes/eventRoutes');
const registrations = require('./routes/registrationRoutes');
const gamification = require('./routes/gamificationRoutes');
const certificates = require('./routes/certificateRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/registrations', registrations);
app.use('/api/gamification', gamification);
app.use('/api/certificates', certificates);

// Basic Route
app.get('/', (req, res) => {
  res.send('EventLink API is running...');
});

module.exports = app;
