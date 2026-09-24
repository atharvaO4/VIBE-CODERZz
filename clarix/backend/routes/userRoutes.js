// routes/userRoutes.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Update own profile
router.put('/me', async (req, res) => {
  try {
    const allowed = ['name','year','branch','cgpa','goal','skills','bio','available','company','domain'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    // Role switching: users may toggle between student and senior (never admin via self-service)
    if (req.body.role !== undefined) {
      if (!['student', 'senior'].includes(req.body.role))
        return res.status(400).json({ success: false, message: 'Role must be student or senior.' });
      updates.role = req.body.role;
      if (req.body.role === 'senior') updates.available = true;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Admin: get all users
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
