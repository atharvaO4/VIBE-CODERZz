// routes/mentorRoutes.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/mentorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/',              ctrl.getSeniors);
router.post('/request',      authorize('student'), ctrl.sendRequest);
router.get('/my-requests',   authorize('student'), ctrl.myRequests);
router.get('/incoming',      authorize('senior'),  ctrl.incomingRequests);
router.patch('/request/:id', authorize('senior'),  ctrl.updateRequest);

module.exports = router;
