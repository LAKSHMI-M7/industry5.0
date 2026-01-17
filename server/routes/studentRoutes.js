const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    markAttendance,
    getAttendance,
    submitDailyUpdate,
    getDailyUpdates,
    submitWeeklyReport,
    getWeeklyReports
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and for students only
router.use(protect);
router.use(authorize('student'));

router.route('/profile')
    .get(getProfile)
    .post(updateProfile);

router.route('/attendance')
    .post(markAttendance)
    .get(getAttendance);

router.route('/daily-update')
    .post(submitDailyUpdate)
    .get(getDailyUpdates);

router.route('/weekly-report')
    .post(submitWeeklyReport)
    .get(getWeeklyReports);

module.exports = router;
