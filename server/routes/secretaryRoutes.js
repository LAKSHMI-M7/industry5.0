const express = require('express');
const router = express.Router();
const {
    getAllStudents,
    getStudentDetails,
    getAllDailyUpdates,
    replyToDailyUpdate,
    getAllWeeklyReports,
    reviewWeeklyReport,
    getAttendanceByDate,
    markAttendanceBySecretary,
    getSecretaryStats
} = require('../controllers/secretaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected Routes
router.use(protect);

router.get('/stats', authorize('secretary', 'admin'), getSecretaryStats);

// Read-only for Staff, Full for Secretary/Admin/Chairperson
router.get('/students', authorize('secretary', 'admin', 'staff', 'chairperson'), getAllStudents);
router.get('/students/:userId', authorize('secretary', 'admin', 'staff', 'chairperson'), getStudentDetails);
router.get('/updates', authorize('secretary', 'admin', 'staff', 'chairperson'), getAllDailyUpdates);
router.get('/reports', authorize('secretary', 'admin', 'staff', 'chairperson'), getAllWeeklyReports);
router.get('/attendance/:date', authorize('secretary', 'admin', 'staff', 'chairperson'), getAttendanceByDate);

// Write access for Secretary, Admin and Chairperson
router.put('/updates/:id/reply', authorize('secretary', 'admin', 'chairperson'), replyToDailyUpdate);
router.put('/reports/:id/review', authorize('secretary', 'admin', 'chairperson'), reviewWeeklyReport);
router.post('/attendance/mark', authorize('secretary', 'admin'), markAttendanceBySecretary);

module.exports = router;
