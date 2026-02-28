// controllers/mentorController.js
const MentorRequest = require('../models/MentorRequest');
const User          = require('../models/User');

// @route  GET /api/mentors  — list all available seniors
exports.getSeniors = async (req, res) => {
  try {
    const seniors = await User.find({ role: 'senior', available: true }).select('-password');
    res.json({ success: true, seniors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/mentors/request
exports.sendRequest = async (req, res) => {
  try {
    const { seniorId, message } = req.body;
    const existing = await MentorRequest.findOne({ student: req.user.id, senior: seniorId });
    if (existing) return res.status(400).json({ success: false, message: 'Request already sent.' });

    const request = await MentorRequest.create({ student: req.user.id, senior: seniorId, message });
    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/mentors/my-requests  — student sees their requests
exports.myRequests = async (req, res) => {
  try {
    const requests = await MentorRequest.find({ student: req.user.id }).populate('senior', 'name email avatar company domain bio skills');
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/mentors/incoming  — senior sees incoming requests
exports.incomingRequests = async (req, res) => {
  try {
    const requests = await MentorRequest.find({ senior: req.user.id }).populate('student', 'name email avatar year branch goal skills');
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/mentors/request/:id
exports.updateRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await MentorRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (String(request.senior) !== String(req.user.id))
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    request.status    = status;
    request.updatedAt = new Date();
    await request.save();
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
