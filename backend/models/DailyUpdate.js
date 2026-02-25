const mongoose = require('mongoose');

const dailyUpdateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    workDone: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    links: {
        type: [String],
        default: []
    },
    timeSpent: {
        type: String, // e.g., "2 hours"
        required: true
    },
    issuesFaced: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Correction Requested', 'Rejected'],
        default: 'Pending'
    },
    secretaryFeedback: {
        type: String,
        default: ''
    },
    secretaryReply: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const DailyUpdate = mongoose.model('DailyUpdate', dailyUpdateSchema);

module.exports = DailyUpdate;

