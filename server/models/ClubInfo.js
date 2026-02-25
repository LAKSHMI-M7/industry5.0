const mongoose = require('mongoose');

const clubInfoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        default: 'Industry 5.0 Club is a professional community focused on the future of technology, innovation, and human-centric industrial transformation.'
    },
    chairperson: {
        type: String,
        required: true,
        default: 'Vishnu Prasad A'
    },
    secretaries: {
        type: [String],
        default: ['E. Yuvabharathi', 'R. Ruth Shobitha', 'Sruthi']
    },
    staff: {
        type: [String],
        default: ['Staff Coordinator 1']
    },
    email: {
        type: String,
        default: 'industry5club@gmail.com'
    },
    instagram: {
        type: String,
        default: 'jit_industry5.0_club'
    },
    linkedin: {
        type: String,
        default: 'https://www.linkedin.com/in/industry-5-0-club-9b34263a8'
    }
}, { timestamps: true });

const ClubInfo = mongoose.model('ClubInfo', clubInfoSchema);

module.exports = ClubInfo;
