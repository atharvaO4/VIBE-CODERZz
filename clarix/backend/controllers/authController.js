// controllers/authController.js
const jwt  = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @route  POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, year, branch, goal, company, domain } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const avatar = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    const user = await User.create({ name, email, password, role, avatar, year, branch, goal, company, domain });

    res.status(201).json({
      success: true,
      token:   signToken(user._id),
      user:    { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    res.json({
      success: true,
      token:   signToken(user._id),
      user:    { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/auth/google
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ success: false, message: 'Google credential missing.' });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub, email, name, picture, email_verified } = ticket.getPayload();

    if (!email || !email_verified)
      return res.status(401).json({ success: false, message: 'Google email not verified.' });

    let user = await User.findOne({ $or: [{ googleId: sub }, { email: email.toLowerCase() }] });

    if (!user) {
      const initials = (name || email).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId: sub,
        authProvider: 'google',
        avatar: picture || initials,
        role: 'student',
      });
    } else if (!user.googleId) {
      // Link existing email/password account to Google
      user.googleId = sub;
      user.authProvider = 'google';
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    }

    res.json({
      success: true,
      token:   signToken(user._id),
      user:    { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message || 'Google sign-in failed.' });
  }
};

// @route  GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
};
