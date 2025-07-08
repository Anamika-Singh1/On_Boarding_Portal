const express = require('express');
const router = express.Router();
const Intern = require('../models/Intern');

// Get all interns
router.get('/', async (req, res) => {
  try {
    const interns = await Intern.find().populate('mentorId');
    res.json(interns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new intern
router.post('/', async (req, res) => {
  try {
    const intern = new Intern(req.body);
    const saved = await intern.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update intern
router.put('/:id', async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    const oldMentorId = intern.mentorId.toString();
    const newMentorId = req.body.mentorId;

    Object.assign(intern, req.body);
    await intern.save();

    if (oldMentorId !== newMentorId) {
      await Intern.emit('remove', { mentorId: oldMentorId }); // manually trigger count update
    }

    res.json(intern);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete intern
router.delete('/:id', async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    await intern.remove();
    res.json({ message: 'Intern deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
