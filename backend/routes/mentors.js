// routes/mentors.js
const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

// ✅ GET all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST create mentor
router.post('/', async (req, res) => {
  console.log('📥 Mentor POST body:', req.body);

  try {
    const { name, department, field, project, skills, internsAssigned } = req.body;

    if (!name || !skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    const mentor = new Mentor({
      name,
      department,
      field,
      project,
      skills,
      internsAssigned: parseInt(internsAssigned) || 0,
    });

    const savedMentor = await mentor.save();
    res.status(201).json(savedMentor);
  } catch (err) {
    console.error('❌ Error saving mentor:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT update mentor
router.put('/:id', async (req, res) => {
  console.log('📝 PUT mentor ID:', req.params.id);
  console.log('📝 PUT body:', req.body);

  try {
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (err) {
    console.error('❌ PUT error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DELETE mentor
router.delete('/:id', async (req, res) => {
  console.log('🔴 DELETE request received for ID:', req.params.id);
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.json({ message: 'Mentor deleted successfully!' });
  } catch (err) {
    console.error('❌ DELETE error:', err.message);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});
module.exports = router;
