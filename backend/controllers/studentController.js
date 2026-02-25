const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const DailyUpdate = require('../models/DailyUpdate');
const WeeklyReport = require('../models/WeeklyReport');
const Event = require('../models/Event');
const checkAndFillMissedAttendance = require('../utils/attendanceHelper');


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
    const {
        registerNumber, department, year, section,
        semester, phone, cgpa, arrears, domain,
        githubLink, linkedinLink, skills
    } = req.body;

    const profileFields = {
        user: req.user._id,
        registerNumber,
        department,
        year,
        section,
        semester,
        phone,
        cgpa,
        arrears,
        domain,
        githubLink,
        linkedinLink,
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : [])
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

// @desc    Submit Daily Update
// @route   POST /api/student/daily-update
// @access  Private (Student)
const submitDailyUpdate = async (req, res) => {
    const { workDone, timeSpent, images, links } = req.body;

    try {
        const update = new DailyUpdate({
            user: req.user._id,
            workDone,
            timeSpent,
            images: images || [],
            links: links || []
        });

        await update.save();
        res.json(update);
    } catch (error) {
        console.error(error);
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
    const { weekStartDate, weekEndDate, summary, technologiesUsed, issuesFaced, nextWeekPlan, attachments } = req.body;

    try {
        const report = new WeeklyReport({
            user: req.user._id,
            weekStartDate,
            weekEndDate,
            summary,
            technologiesUsed: Array.isArray(technologiesUsed) ? technologiesUsed : (technologiesUsed ? technologiesUsed.split(',').map(t => t.trim()) : []),
            issuesFaced,
            nextWeekPlan,
            attachments: attachments || []
        });

        await report.save();
        res.json(report);
    } catch (error) {
        console.error(error);
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

// @desc    Store Student Event
// @route   POST /api/student/events
// @access  Private (Student)
const addEvent = async (req, res) => {
    const { eventName, type, organizer, date, description, certificateUrl } = req.body;

    try {
        const event = new Event({
            user: req.user._id,
            eventName,
            type,
            organizer,
            date,
            description,
            certificateUrl
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Student Events
// @route   GET /api/student/events
// @access  Private (Student)
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id }).sort({ date: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Attendance methods kept as they were...
const markAttendance = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Security: Check if already marked
        const existingAttendance = await Attendance.findOne({ user: req.user._id, date: today });
        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for today'
            });
        }

        const attendance = new Attendance({
            user: req.user._id,
            date: today,
            status: 'Present',
            markedAt: new Date()
        });

        await attendance.save();
        res.json({
            success: true,
            message: 'Attendance marked successfully',
            attendance
        });
    } catch (error) {
        console.error('Mark Attendance Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
        res.json(attendance);
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
    getWeeklyReports,
    addEvent,
    getEvents
};

