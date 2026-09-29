const mongoose = require('mongoose');
const Mentor = require('./Mentor');

const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
}, { timestamps: true });

// Utility function to update intern count
const updateInternCount = async (mentorId) => {
  const count = await mongoose.model('Intern').countDocuments({ mentorId });
  await Mentor.findByIdAndUpdate(mentorId, { internsAssigned: count });
};

// After save
internSchema.post('save', async function () {
  await updateInternCount(this.mentorId);
});

// After delete (Mongoose 7+ renamed the document 'remove' hook to 'deleteOne';
// { document: true, query: false } is required since 'deleteOne' also exists
// as query middleware for Model.deleteOne()).
internSchema.post('deleteOne', { document: true, query: false }, async function () {
  await updateInternCount(this.mentorId);
});

module.exports = mongoose.model('Intern', internSchema);
