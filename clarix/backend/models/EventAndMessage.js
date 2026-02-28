// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  desc:      String,
  type:      { type: String, enum: ['Workshop','Hackathon','Masterclass','Bootcamp','Event'], default: 'Event' },
  date:      { type: Date, required: true },
  postedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);


// ──────────────────────────────────────────
// models/Message.js
const MessageSchema = new mongoose.Schema({
  from:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:      { type: String, required: true },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

mongoose.model('Message', MessageSchema);
