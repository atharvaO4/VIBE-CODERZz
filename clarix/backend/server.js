// ─────────────────────────────────────────
//  CLARIX Backend — server.js
//  Entry point for the Express API
// ─────────────────────────────────────────
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── Middleware ──────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── Routes ──────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use('/api/roadmap',  require('./routes/roadmapRoutes'));
app.use('/api/mentors',  require('./routes/mentorRoutes'));
app.use('/api/events',   require('./routes/eventRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// ── Health check ────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CLARIX API running' });
});

// ── 404 fallback ────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 CLARIX server running on port ${PORT}`));
