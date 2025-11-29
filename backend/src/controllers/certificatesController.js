const Registration = require('../models/Registration');

// @desc    Get / download a certificate (mock)
// @route   GET /api/certificates/:registrationId
// @access  Private
exports.getCertificate = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.registrationId).populate('event', 'title date');

    if (!reg) return res.status(404).json({ success: false, error: 'Registration not found' });

    // Only allow the owner or an admin to access — req.user may be undefined for public endpoints
    if (!req.user || (reg.user.toString() !== req.user.id && req.user.role !== 'admin')) {
      return res.status(401).json({ success: false, error: 'Not authorized to view this certificate' });
    }

    // Mock certificate response
    const certificate = {
      registrationId: reg._id,
      eventId: reg.event._id,
      eventTitle: reg.event.title,
      date: reg.event.date,
      // In a real implementation this would be a binary/pdf or signed URL
      message: `This is a placeholder certificate for registration ${reg._id}`
    };

    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
