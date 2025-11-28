const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  university: {
    type: String,
    required: [true, 'Please add a university']
  },
  department: {
    type: String
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['tech', 'cultural', 'academic', 'club', 'sports', 'other']
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  fees: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: [true, 'Please add a date and time']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please add a registration deadline']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add a capacity']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
