// routes/messageRoutes.js
const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');

// Lazy-load Message model (defined in EventAndMessage.js)
const getModel = () => mongoose.model('Message');

router.use(protect);

// GET conversation with a specific user
router.get('/:userId', async (req, res) => {
  try {
    const msgs = await getModel().find({
      $or: [
        { from: req.user.id, to: req.params.userId },
        { from: req.params.userId, to: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json({ success: true, messages: msgs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST send a message
router.post('/', async (req, res) => {
  try {
    const msg = await getModel().create({ from: req.user.id, to: req.body.to, text: req.body.text });
    res.status(201).json({ success: true, message: msg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
