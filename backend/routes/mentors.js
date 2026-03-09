const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

// ======================
// ✅ GET: Fetch all mentors
// ======================
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (err) {
    console.error('❌ Error in GET /api/mentors:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ======================
// ✅ POST: Create a new mentor
// ======================
router.post('/', async (req, res) => {
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

// ======================
// ✅ PUT: Update a mentor by ID
// ======================
router.put('/:id', async (req, res) => {
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
    console.error('❌ Error updating mentor:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ======================
// ✅ DELETE: Remove a mentor by ID
// ======================
router.delete('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.json({ message: 'Mentor deleted successfully!' });
  } catch (err) {
    console.error('❌ Error deleting mentor:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;