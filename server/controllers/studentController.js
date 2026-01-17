const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const DailyUpdate = require('../models/DailyUpdate');
const WeeklyReport = require('../models/WeeklyReport');

// @desc    Get current student profile
// @route   GET /api/student/profile
// @access  Private (Student)
const getProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create or Update student profile
// @route   POST /api/student/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
    const { registerNumber, department, year, domain, githubLink, linkedinLink, skills } = req.body;

    const profileFields = {
        user: req.user._id,
        registerNumber,
        department,
        year,
        domain,
        githubLink,
        linkedinLink,
        skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim())
    };

    try {
        let profile = await StudentProfile.findOne({ user: req.user._id });

        if (profile) {
            // Update
            profile = await StudentProfile.findOneAndUpdate(
                { user: req.user._id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new StudentProfile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark Daily Attendance
// @route   POST /api/student/attendance
// @access  Private (Student)
const markAttendance = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            user: req.user._id,
            date: { $gte: today }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        const attendance = new Attendance({
            user: req.user._id,
            status: 'Present' // Default to present when they click the button
        });

        await attendance.save();
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Student Attendance History
// @route   GET /api/student/attendance
// @access  Private (Student)
const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit Daily Update
// @route   POST /api/student/daily-update
// @access  Private (Student)
const submitDailyUpdate = async (req, res) => {
    const { workDone, timeSpent, issuesFaced } = req.body;

    try {
        const update = new DailyUpdate({
            user: req.user._id,
            workDone,
            timeSpent,
            issuesFaced
        });

        await update.save();
        res.json(update);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Daily Updates
// @route   GET /api/student/daily-update
// @access  Private (Student)
const getDailyUpdates = async (req, res) => {
    try {
        const updates = await DailyUpdate.find({ user: req.user._id }).sort({ date: -1 });
        res.json(updates);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit Weekly Report
// @route   POST /api/student/weekly-report
// @access  Private (Student)
const submitWeeklyReport = async (req, res) => {
    const { weekStartDate, weekEndDate, completedWork, ongoingWork, nextWeekPlan, githubRepoLink } = req.body;

    try {
        const report = new WeeklyReport({
            user: req.user._id,
            weekStartDate,
            weekEndDate,
            completedWork,
            ongoingWork,
            nextWeekPlan,
            githubRepoLink
        });

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Weekly Reports
// @route   GET /api/student/weekly-report
// @access  Private (Student)
const getWeeklyReports = async (req, res) => {
    try {
        const reports = await WeeklyReport.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    markAttendance,
    getAttendance,
    submitDailyUpdate,
    getDailyUpdates,
    submitWeeklyReport,
    getWeeklyReports
};
