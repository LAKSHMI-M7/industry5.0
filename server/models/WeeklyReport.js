const mongoose = require('mongoose');

const weeklyReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    weekEndDate: {
        type: Date,
        required: true
    },
    completedWork: {
        type: String,
        required: true
    },
    ongoingWork: {
        type: String,
        required: true
    },
    nextWeekPlan: {
        type: String,
        required: true
    },
    githubRepoLink: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Ongoing', 'Needs Improvement'],
        default: 'Pending'
    },
    secretaryFeedback: {
        type: String
    }
}, { timestamps: true });

const WeeklyReport = mongoose.model('WeeklyReport', weeklyReportSchema);

module.exports = WeeklyReport;
