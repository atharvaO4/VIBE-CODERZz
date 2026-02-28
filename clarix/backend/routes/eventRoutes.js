// routes/eventRoutes.js
const express  = require('express');
const router   = express.Router();
const Event    = require('../models/EventAndMessage');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// GET all events (all roles)
router.get('/', async (req, res) => {
  try {
    const events = await require('mongoose').model('Event').find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST new event (admin only)
router.post('/', authorize('admin'), async (req, res) => {
  try {
    const event = await require('mongoose').model('Event').create({ ...req.body, postedBy: req.user.id });
    res.status(201).json({ success: true, event });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE event (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await require('mongoose').model('Event').findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
