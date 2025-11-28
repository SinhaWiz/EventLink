const User = require('../models/User');

// Helper to calculate tier
const calculateTier = (points) => {
  if (points >= 300) return 'Elite';
  if (points >= 150) return 'Gold';
  if (points >= 80) return 'Silver';
  if (points >= 40) return 'Bronze';
  return 'Bronze'; // Default or maybe 'None' if < 40? Requirement says Bronze 40+, but example says "User A participated in 50 events... Bronze Certified". Assuming <40 is just no tier or basic. Let's stick to the list.
};

// @desc    Award points to a user
// @route   POST /api/gamification/award
// @access  Private (Admin/Organizer)
exports.awardPoints = async (req, res) => {
  try {
    const { userId, points, reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.points += points;
    user.tier = calculateTier(user.points);

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        points: user.points,
        tier: user.tier,
        message: `Awarded ${points} points for: ${reason}`
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
