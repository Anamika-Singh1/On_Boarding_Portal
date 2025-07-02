const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String },
  field: { type: String },
  project: { type: String },
  skills: { type: [String], required: true },
  internsAssigned: { type: Number, default: 0 },
});

module.exports = mongoose.model('Mentor', mentorSchema);
