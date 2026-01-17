const express = require('express');
const router = express.Router();
const {
    getAllStudents,
    getAllDailyUpdates,
    replyToDailyUpdate,
    getAllWeeklyReports,
    reviewWeeklyReport,
    getAttendanceByDate,
    markAttendanceBySecretary
} = require('../controllers/secretaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected Routes
router.use(protect);

// Read-only for Staff, Full for Secretary/Admin
router.get('/students', authorize('secretary', 'admin', 'staff'), getAllStudents);
router.get('/updates', authorize('secretary', 'admin', 'staff'), getAllDailyUpdates);
router.get('/reports', authorize('secretary', 'admin', 'staff'), getAllWeeklyReports);
router.get('/attendance/:date', authorize('secretary', 'admin', 'staff'), getAttendanceByDate);

// Write access for Secretary and Admin
router.put('/updates/:id/reply', authorize('secretary', 'admin'), replyToDailyUpdate);
router.put('/reports/:id/review', authorize('secretary', 'admin'), reviewWeeklyReport);
router.post('/attendance/mark', authorize('secretary', 'admin'), markAttendanceBySecretary);

module.exports = router;
