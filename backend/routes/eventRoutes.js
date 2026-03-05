const express = require('express');
const router = express.Router();
const { uploadArtifact } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload artifact for an event
// @route   POST /api/events/upload-artifact
// @access  Private
router.post('/upload-artifact', protect, uploadArtifact.single('artifact'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded or invalid file format.' });
        }

        let artifactUrl = req.file.path; // Set by CloudinaryStorage

        // If Cloudinary is missing, memoryStorage was used and req.file.path doesn't exist
        // Instead, we have req.file.buffer
        if (!artifactUrl && req.file.buffer) {
            const base64String = req.file.buffer.toString('base64');
            artifactUrl = `data:${req.file.mimetype};base64,${base64String}`;
        }

        res.status(200).json({
            message: 'Artifact uploaded successfully',
            artifactUrl: artifactUrl,
            filename: req.file.originalname
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error uploading artifact', error: error.message });
    }
});

module.exports = router;
