const express = require('express');
const { awardPoints } = require('../controllers/gamificationController');
const { getPortfolio, getMyPortfolio, getMyDashboard } = require('../controllers/portfolioController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Gamification Routes
router.post('/award', protect, authorize('admin', 'organizer'), awardPoints);

// Portfolio Routes
router.get('/me', protect, getMyPortfolio);
router.get('/dashboard/me', protect, getMyDashboard);
router.get('/:userId', getPortfolio);

module.exports = router;
