// routes/roadmapRoutes.js
const express = require('express');
const router  = express.Router();
const { getRoadmap, toggleTask, regenerateRoadmap } = require('../controllers/roadmapController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/',                   authorize('student'), getRoadmap);
router.patch('/task/:taskId',     authorize('student'), toggleTask);
router.post('/regenerate',        authorize('student'), regenerateRoadmap);

module.exports = router;
