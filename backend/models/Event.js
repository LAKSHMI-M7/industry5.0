const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Hackathon', 'Workshop', 'Technical', 'Non-Technical', 'PPT'],
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    certificateUrl: {
        type: String
    }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

