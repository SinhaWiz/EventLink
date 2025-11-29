const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({ success: false, error: 'Already registered for this event' });
    }

    // Check capacity
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (registrationCount >= event.capacity) {
      return res.status(400).json({ success: false, error: 'Event is fully booked' });
    }

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
      paymentStatus: event.isPaid ? 'pending' : 'free'
    });

    res.status(201).json({
      success: true,
      data: registration
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get my registrations
// @route   GET /api/registrations/my
// @access  Private
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title date location isPaid fees');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer/Admin)
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check authorization
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to view registrations for this event' });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email phone university department');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
