const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'past'], required: true },
  date: { type: String, required: true },
  startTime: { type: String }, // optional
  endTime: { type: String },   // optional
  purpose: { type: String },   // optional
  eventCoordinator: { type: String }, // optional
  calendarLink: { type: String }, // optional (for Google Calendar link)
  teamMembers: { type: [String], required: true },
});

module.exports = mongoose.model('Event', eventSchema);
