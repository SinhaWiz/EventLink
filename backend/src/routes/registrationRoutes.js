const express = require('express');
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations
} = require('../controllers/registrationController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', registerForEvent);
router.get('/my', getMyRegistrations);
router.get('/event/:eventId', authorize('organizer', 'admin'), getEventRegistrations);

module.exports = router;
