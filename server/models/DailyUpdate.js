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
    timeSpent: {
        type: String, // e.g., "2 hours"
        required: true
    },
    issuesFaced: {
        type: String
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
