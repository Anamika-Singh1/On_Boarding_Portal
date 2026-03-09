const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['upcoming', 'past'], required: true },
  date: { type: Date, required: true },
  startTime: { type: String, trim: true }, // optional
  endTime: { type: String, trim: true },   // optional
  purpose: { type: String, trim: true },   // optional
  eventCoordinator: { type: String, trim: true }, // optional
  calendarLink: { type: String, trim: true },     // optional
  teamMembers: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: 'At least one team member is required'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);