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
  console.log('Received Body:', req.body); // Debug log

  const { name, department, field, project, skills, internsAssigned } = req.body;
  if (!name || !skills) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const mentor = new Mentor({
    name,
    department,
    field,
    project,
    skills,
    internsAssigned
  });

  try {
    const newMentor = await mentor.save();
    res.status(201).json(newMentor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
