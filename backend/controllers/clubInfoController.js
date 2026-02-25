const ClubInfo = require('../models/ClubInfo');

// @desc    Get Club Info
// @route   GET /api/club-info
// @access  Public
const getClubInfo = async (req, res) => {
    try {
        let info = await ClubInfo.findOne();
        if (!info) {
            // Create default if not exists
            info = await ClubInfo.create({});
        }
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Club Info
// @route   PUT /api/club-info
// @access  Private (Admin)
const updateClubInfo = async (req, res) => {
    try {
        let info = await ClubInfo.findOne();
        if (!info) {
            info = new ClubInfo(req.body);
        } else {
            Object.assign(info, req.body);
        }
        await info.save();
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getClubInfo,
    updateClubInfo
};

