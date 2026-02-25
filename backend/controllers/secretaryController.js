const DailyUpdate = require('../models/DailyUpdate');
const WeeklyReport = require('../models/WeeklyReport');
const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');

// @desc    Get All Students (Profiles)
// @route   GET /api/secretary/students
// @access  Private (Secretary, Admin, Staff)
const getAllStudents = async (req, res) => {
    try {
        const students = await StudentProfile.find({}).populate('user', 'name email avatar');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Single Student Full Data
// @route   GET /api/secretary/students/:userId
// @access  Private (Secretary, Admin, Staff)
const getStudentDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await StudentProfile.findOne({ user: userId }).populate('user', 'name email avatar');
        const updates = await DailyUpdate.find({ user: userId }).sort({ date: -1 });
        const reports = await WeeklyReport.find({ user: userId }).sort({ weekEndDate: -1 });
        const events = await Event.find({ user: userId }).sort({ date: -1 });
        const attendance = await Attendance.find({ user: userId }).sort({ date: -1 });

        res.json({
            profile: profile || null,
            updates,
            reports,
            events,
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Daily Updates (Filterable)
// @route   GET /api/secretary/updates
// @access  Private (Secretary, Admin, Staff)
const getAllDailyUpdates = async (req, res) => {
    try {
        const updates = await DailyUpdate.find({})
            .populate('user', 'name email')
            .sort({ date: -1 });
        res.json(updates);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... existing methods ...
// @desc    Reply to Daily Update
// @route   PUT /api/secretary/updates/:id/reply
// @access  Private (Secretary, Admin)
const replyToDailyUpdate = async (req, res) => {
    const { feedback, reply, status } = req.body;
    try {
        const update = await DailyUpdate.findById(req.params.id);
        if (!update) return res.status(404).json({ message: 'Update not found' });

        if (feedback) update.secretaryFeedback = feedback;
        if (reply) update.secretaryReply = reply;
        if (status) update.status = status;

        await update.save();
        res.json(update);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Weekly Reports
// @route   GET /api/secretary/reports
// @access  Private (Secretary, Admin, Staff)
const getAllWeeklyReports = async (req, res) => {
    try {
        const reports = await WeeklyReport.find({})
            .populate('user', 'name email')
            .sort({ weekEndDate: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Review Weekly Report
// @route   PUT /api/secretary/reports/:id/review
// @access  Private (Secretary, Admin)
const reviewWeeklyReport = async (req, res) => {
    const { status, feedback } = req.body;
    try {
        const report = await WeeklyReport.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (status) report.status = status;
        if (feedback) report.secretaryFeedback = feedback;

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Attendance by Date
// @route   GET /api/secretary/attendance/:date
// @access  Private (Secretary, Admin, Staff)
const getAttendanceByDate = async (req, res) => {
    try {
        const date = req.params.date || new Date().toISOString().split('T')[0];
        const attendance = await Attendance.find({
            date: {
                $gte: new Date(date),
                $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
            }
        }).populate('user', 'name email');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark Attendance for Student
// @route   POST /api/secretary/attendance/mark
// @access  Private (Secretary, Admin)
const markAttendanceBySecretary = async (req, res) => {
    const { userId, date, status } = req.body;
    try {
        const queryDate = new Date(date || new Date().toISOString().split('T')[0]);
        queryDate.setHours(0, 0, 0, 0);

        let attendance = await Attendance.findOne({
            user: userId,
            date: {
                $gte: queryDate,
                $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (attendance) {
            attendance.status = status;
            await attendance.save();
        } else {
            attendance = await Attendance.create({
                user: userId,
                date: queryDate,
                status: status || 'Present'
            });
        }
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Secretary Dashboard Stats
// @route   GET /api/secretary/stats
// @access  Private (Secretary, Admin)
const getSecretaryStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 1. All Students
        const allStudents = await StudentProfile.find({}).populate('user', 'name');
        const studentIds = allStudents.map(s => s.user._id);

        // 2. Today's Attendance
        const attendanceToday = await Attendance.find({
            date: { $gte: today, $lt: tomorrow },
            status: 'Present'
        });
        const presentIds = attendanceToday.map(a => a.user.toString());
        const absentStudents = allStudents.filter(s => !presentIds.includes(s.user._id.toString()));

        // 3. Today's Updates
        const updatesToday = await DailyUpdate.find({
            date: { $gte: today, $lt: tomorrow }
        });
        const updateSubmitterIds = updatesToday.map(u => u.user.toString());
        const noUpdateStudents = allStudents.filter(s => !updateSubmitterIds.includes(s.user._id.toString()));

        // 4. Weekly Reports (Current Week)
        // Hardcoded week logic or dynamic? Let's assume current week.
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const weeklyReportsThisWeek = await WeeklyReport.find({
            weekEndDate: { $gte: startOfWeek }
        });
        const reportSubmitterIds = weeklyReportsThisWeek.map(r => r.user.toString());
        const noReportStudents = allStudents.filter(s => !reportSubmitterIds.includes(s.user._id.toString()));

        // 5. Pending verifications
        const pendingUpdates = await DailyUpdate.countDocuments({
            $or: [{ secretaryReply: { $exists: false } }, { secretaryReply: '' }]
        });
        const pendingReports = await WeeklyReport.countDocuments({ status: 'Pending' });

        // 6. Recent Submissions
        const recentReports = await WeeklyReport.find({})
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // 7. Students Requiring Action Table
        const actionItems = [];

        absentStudents.forEach(s => {
            actionItems.push({
                student: s.user,
                department: s.department,
                issue: 'Absent',
                date: today
            });
        });

        noUpdateStudents.forEach(s => {
            actionItems.push({
                student: s.user,
                department: s.department,
                issue: 'No Daily Update',
                date: today
            });
        });

        res.json({
            attendance: {
                present: presentIds.length,
                absent: absentStudents.length,
                absentStudents
            },
            updates: {
                pending: pendingUpdates,
                noUpdateCount: noUpdateStudents.length,
                noUpdateStudents
            },
            reports: {
                pending: pendingReports,
                noReportCount: noReportStudents.length,
                noReportStudents,
                recent: recentReports
            },
            actionItems: actionItems.slice(0, 10) // Limit for dashboard
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllStudents,
    getStudentDetails,
    getAllDailyUpdates,
    replyToDailyUpdate,
    getAllWeeklyReports,
    reviewWeeklyReport,
    getAttendanceByDate,
    markAttendanceBySecretary,
    getSecretaryStats
};

