const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// ✅ GET: Fetch all events & auto-update expired ones
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();

    const now = new Date();
    const updates = [];

    for (const event of events) {
      if (event.status === 'upcoming') {
        const endDateTime = new Date(`${event.date}T${event.endTime || '23:59'}`);
        if (endDateTime < now) {
          event.status = 'past';
          updates.push(event.save());
        }
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    const updatedEvents = await Event.find(); // fetch again after updates
    res.json(updatedEvents);
  } catch (err) {
    console.error("❌ Error in GET /api/events:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ POST: Create a new event
router.post('/', async (req, res) => {
  console.log("Incoming event data:", req.body);

  const {
    name,
    description,
    status,
    teamMembers,
    date,
    startTime,
    endTime,
    purpose,
    eventCoordinator,
    calendarLink
  } = req.body;

  if (!name || !description || !status || !date || !teamMembers) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newEvent = new Event({
      name,
      description,
      status,
      teamMembers: Array.isArray(teamMembers)
        ? teamMembers
        : teamMembers.split(',').map(m => m.trim()),
      date,
      startTime,
      endTime,
      purpose,
      eventCoordinator,
      calendarLink
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("❌ Error in POST /api/events:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
