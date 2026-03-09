const express = require('express');
const router = express.Router();
const Intern = require('../models/Intern');

// ======================
// ✅ GET: Fetch all interns (with mentor populated)
// ======================
router.get('/', async (req, res) => {
  try {
    const interns = await Intern.find().populate('mentorId');
    res.json(interns);
  } catch (err) {
    console.error('❌ Error in GET /api/interns:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ======================
// ✅ POST: Create new intern
// ======================
router.post('/', async (req, res) => {
  try {
    const intern = new Intern(req.body);
    const saved = await intern.save();
    const populated = await Intern.findById(saved._id).populate('mentorId');
    res.status(201).json(populated);
  } catch (err) {
    console.error('❌ Error in POST /api/interns:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// ======================
// ✅ PUT: Update intern by ID
// ======================
router.put('/:id', async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    Object.assign(intern, req.body);
    const updated = await intern.save();
    const populated = await Intern.findById(updated._id).populate('mentorId');
    res.json(populated);
  } catch (err) {
    console.error('❌ Error in PUT /api/interns/:id:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// ======================
// ✅ DELETE: Remove intern by ID
// ======================
router.delete('/:id', async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    await intern.remove();
    res.json({ message: 'Intern deleted successfully' });
  } catch (err) {
    console.error('❌ Error in DELETE /api/interns/:id:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;