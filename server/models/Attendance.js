const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: () => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            return d;
        }
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave'],
        default: 'Present'
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent multiple attendance entries for the same user on the same day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
