// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6, select: false },
  googleId: { type: String, sparse: true },
  authProvider: { type: String, enum: ['local','google'], default: 'local' },
  role:     { type: String, enum: ['student','senior','admin'], default: 'student' },
  avatar:   { type: String, default: '' },

  // Student-specific fields
  year:     String,
  branch:   String,
  cgpa:     String,
  goal:     String,
  skills:   [String],

  // Senior-specific fields
  company:   String,
  domain:    String,
  bio:       String,
  available: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
