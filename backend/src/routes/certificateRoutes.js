const express = require('express');
const { getCertificate } = require('../controllers/certificatesController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:registrationId', protect, getCertificate);

module.exports = router;
