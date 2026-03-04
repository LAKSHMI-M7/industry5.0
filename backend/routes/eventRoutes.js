const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadArtifact } = require('../config/cloudinary');

router.post('/upload-artifact', protect, uploadArtifact.single('artifact'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({
            message: 'Artifact uploaded successfully',
            url: req.file.path // Cloudinary returns the secure URL in path
        });
    } catch (error) {
        console.error('Artifact upload validation error:', error);
        res.status(500).json({ message: 'Error uploading artifact', error: error.message });
    }
});

module.exports = router;
