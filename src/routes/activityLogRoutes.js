const express = require('express');
const router = express.Router();
const {
  getAllActivityLogs,
  getActivityLogById,
  getActivityLogsByUser,
  getActivityStats,
  deleteOldLogs,
} = require('../controllers/activityLogController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllActivityLogs);
router.get('/stats', getActivityStats);
router.get('/user/:user_id', getActivityLogsByUser);
router.get('/:id', getActivityLogById);
router.delete('/cleanup', deleteOldLogs);

module.exports = router;
