// models/Roadmap.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  id:       String,
  title:    String,
  desc:     String,
  tags:     [String],
  done:     { type: Boolean, default: false },
  doneAt:   Date
});

const RoadmapSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  goal:     String,
  weekly:   [TaskSchema],
  monthly:  [TaskSchema],
  semester: [TaskSchema],
  insights: String,
  generatedAt: { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
