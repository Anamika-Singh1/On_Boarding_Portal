// backend/routes/interns.js
const express = require('express');
const router = express.Router();
const Intern = require('../models/Intern');

// GET all interns
router.get('/', async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new intern
router.post('/', async (req, res) => {
  try {
    const newIntern = new Intern(req.body);
    const saved = await newIntern.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update intern
router.put('/:id', async (req, res) => {
  try {
    const updated = await Intern.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Intern not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE intern
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Intern.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Intern not found' });
    res.json({ message: 'Intern deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
