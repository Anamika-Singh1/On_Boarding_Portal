// routes/mentors.js
const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

// GET all mentors
router.get('/', async (req, res) => {
  try {
    console.log('Received Body:', req.body);

    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a mentor
router.post('/', async (req, res) => {
  console.log('📥 Received Mentor:', req.body);

  try {
    let { name, department, field, project, skills, internsAssigned } = req.body;

    if (!name || !skills) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert string to array if needed
    if (typeof skills === 'string') {
      skills = skills.split(',').map(s => s.trim());
    }

    const mentor = new Mentor({
      name,
      department,
      field,
      project,
      skills,
      internsAssigned: parseInt(internsAssigned) || 0,
    });

    const newMentor = await mentor.save();
    res.status(201).json(newMentor);
  } catch (err) {
    console.error('❌ Error saving mentor:', err.message);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
