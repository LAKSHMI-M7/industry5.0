const express = require('express');
const router = express.Router();
const {
    getSystemStats,
    getAllUsers,
    updateUserRole,
    getSecurityAudit,
    getAnalyticsData
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getSystemStats);
router.get('/audit', getSecurityAudit);
router.get('/analytics', getAnalyticsData);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
