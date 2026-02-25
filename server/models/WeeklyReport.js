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
    summary: {
        type: String,
        required: true
    },
    technologiesUsed: {
        type: [String],
        default: []
    },
    issuesFaced: {
        type: String
    },
    nextWeekPlan: {
        type: String,
        required: true
    },
    attachments: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Verified', 'Correction Requested'],
        default: 'Pending'
    },
    secretaryFeedback: {
        type: String
    }
}, { timestamps: true });

const WeeklyReport = mongoose.model('WeeklyReport', weeklyReportSchema);

module.exports = WeeklyReport;
