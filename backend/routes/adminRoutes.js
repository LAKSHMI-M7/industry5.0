const express = require('express');
const router = express.Router();
const {
    getSystemStats,
    getAllUsers,
    updateUserInfo,
    getSecurityAudit,
    getAnalyticsData,
    createUser,
    deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/stats', authorize('admin', 'chairperson', 'secretary'), getSystemStats);

// Restricted Admin only routes
router.use(authorize('admin'));

router.get('/audit', getSecurityAudit);
router.get('/analytics', getAnalyticsData);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUserInfo);
router.delete('/users/:id', deleteUser);

module.exports = router;

