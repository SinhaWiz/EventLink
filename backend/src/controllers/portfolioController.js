const User = require('../models/User');
const Registration = require('../models/Registration');

// @desc    Get user portfolio
// @route   GET /api/portfolio/:userId
// @access  Public
exports.getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name university department points tier createdAt');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get completed events (registrations)
    // Assuming 'attended' status means they completed it.
    const history = await Registration.find({
      user: req.params.userId,
      status: 'attended' // Only show attended events in portfolio
    }).populate('event', 'title date category');

    // Generate certificates data (mock)
    const certificates = history.map(reg => ({
      eventId: reg.event._id,
      eventName: reg.event.title,
      date: reg.event.date,
      certificateId: `CERT-${reg._id}`, // Mock ID
      downloadUrl: `/api/certificates/${reg._id}` // Mock URL
    }));

    res.status(200).json({
      success: true,
      data: {
        profile: user,
        stats: {
          totalEvents: history.length,
          totalPoints: user.points,
          currentTier: user.tier
        },
        certificates,
        history
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get my portfolio
// @route   GET /api/portfolio/me
// @access  Private
exports.getMyPortfolio = async (req, res) => {
  // Redirect to getPortfolio with user ID from token
  req.params.userId = req.user.id;
  exports.getPortfolio(req, res);
};
