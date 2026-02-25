const Poster = require('../models/Poster');
const fs = require('fs');
const path = require('path');

// @desc    Get all posters
// @route   GET /api/posters
// @access  Private (all roles)
const getAllPosters = async (req, res) => {
    try {
        const posters = await Poster.find()
            .populate('postedBy', 'name role')
            .sort({ createdAt: -1 });
        res.json(posters);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get latest poster
// @route   GET /api/posters/latest
// @access  Private (all roles)
const getLatestPoster = async (req, res) => {
    try {
        const poster = await Poster.findOne()
            .populate('postedBy', 'name role')
            .sort({ createdAt: -1 });
        res.json(poster);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new poster
// @route   POST /api/posters
// @access  Private (chairperson only)
const createPoster = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a poster image' });
        }

        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const poster = await Poster.create({
            title,
            description: description || '',
            imageUrl: `/uploads/posters/${req.file.filename}`,
            postedBy: req.user._id
        });

        const populated = await poster.populate('postedBy', 'name role');
        res.status(201).json(populated);
    } catch (error) {
        console.error('Create Poster Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a poster
// @route   DELETE /api/posters/:id
// @access  Private (chairperson only)
const deletePoster = async (req, res) => {
    try {
        const poster = await Poster.findById(req.params.id);
        if (!poster) {
            return res.status(404).json({ message: 'Poster not found' });
        }

        // Delete image file from disk
        if (poster.imageUrl) {
            const relativePath = poster.imageUrl.startsWith('/') ? poster.imageUrl.substring(1) : poster.imageUrl;
            const filePath = path.join(__dirname, '..', relativePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await poster.deleteOne();
        res.json({ message: 'Poster deleted successfully' });
    } catch (error) {
        console.error('Delete Poster Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAllPosters, getLatestPoster, createPoster, deletePoster };
