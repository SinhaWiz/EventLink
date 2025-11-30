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

// @desc    Get my dashboard (aggregated view)
// @route   GET /api/gamification/dashboard/me
// @access  Private
exports.getMyDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name university department points tier createdAt');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // All registrations (both upcoming and past)
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title date location isPaid fees category');

    const now = new Date();

    // Compute registrations with simple derived fields
    const registrationsView = registrations.map(reg => {
      const ev = reg.event || {};
      let status = 'Upcoming';
      let remainingMs = null;

      if (reg.status === 'attended') {
        status = 'Completed';
      } else if (ev.date) {
        const eventDate = new Date(ev.date);
        if (eventDate <= now) {
          status = 'Completed';
        } else {
          status = 'Upcoming';
          remainingMs = eventDate - now;
        }
      }

      return {
        registrationId: reg._id,
        status: status,
        registrationDate: reg.registrationDate,
        paymentStatus: reg.paymentStatus,
        event: {
          id: ev._id,
          title: ev.title,
          date: ev.date,
          location: ev.location,
          isPaid: ev.isPaid,
          fees: ev.fees
        },
        remainingMs
      };
    });

    // Participation history: attended events
    const history = registrationsView.filter(r => r.status === 'Completed');

    // Certificates (mocked) for completed / attended registrations
    const certificates = history.map(h => ({
      eventId: h.event.id,
      eventName: h.event.title,
      date: h.event.date,
      certificateId: `CERT-${h.registrationId}`,
      downloadUrl: `/api/certificates/${h.registrationId}`
    }));

    // Achievements / badges rules (simple): based on points & total completed
    const totalCompleted = history.length;
    const points = user.points || 0;

    const achievements = [];
    if (totalCompleted >= 1) achievements.push({ id: 'first-event', title: 'First Event', description: 'Completed your first event' });
    if (totalCompleted >= 5) achievements.push({ id: 'event-5', title: 'Event Fan', description: 'Completed 5 events' });
    if (totalCompleted >= 10) achievements.push({ id: 'event-10', title: 'Veteran', description: 'Completed 10 events' });
    if (points >= 100) achievements.push({ id: '100-points', title: '100 Points', description: 'Earned 100 points' });
    if (points >= 500) achievements.push({ id: '500-points', title: '500 Points', description: 'Earned 500 points' });

    // Badges mirror tier and points thresholds (simple)
    const badges = [];
    badges.push({ id: 'tier', title: `${user.tier} Tier`, description: `Current tier: ${user.tier}` });
    if (points >= 50) badges.push({ id: 'active-participant', title: 'Active Participant', description: 'Earned 50+ points' });

    // Stats
    const stats = {
      totalEventsRegistered: registrationsView.length,
      totalEventsCompleted: totalCompleted,
      totalPoints: points,
      currentTier: user.tier
    };

    res.status(200).json({
      success: true,
      data: {
        profile: user,
        registrations: registrationsView,
        certificates,
        achievements,
        badges,
        stats,
        history
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
