const DailyUpdate = require('../models/DailyUpdate');
const WeeklyReport = require('../models/WeeklyReport');
const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');

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

// @desc    Reply to Daily Update
// @route   PUT /api/secretary/updates/:id/reply
// @access  Private (Secretary, Admin)
const replyToDailyUpdate = async (req, res) => {
    const { feedback, reply } = req.body;
    try {
        const update = await DailyUpdate.findById(req.params.id);
        if (!update) return res.status(404).json({ message: 'Update not found' });

        if (feedback) update.secretaryFeedback = feedback;
        if (reply) update.secretaryReply = reply;

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

module.exports = {
    getAllStudents,
    getAllDailyUpdates,
    replyToDailyUpdate,
    getAllWeeklyReports,
    reviewWeeklyReport,
    getAttendanceByDate,
    markAttendanceBySecretary
};
