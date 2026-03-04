const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'events',
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
        // PDF uploads in cloudinary need format to be specified or left to auto if possible.
        // Cloudinary supports pdf if format is allowed. Wait, pdf is an "image" for Cloudinary sometimes, but better to set resource_type to auto.
        // For multer-storage-cloudinary, you can set resource_type
    }
});

// A custom function to handle raw/auto resource types if needed
const artifactStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Check if pdf
        if (file.mimetype === 'application/pdf') {
            return {
                folder: 'events/artifacts',
                format: 'pdf',
                // resource_type MUST be 'raw' or 'image' (pdf works as image if you want thumbnails, but 'raw' or 'auto' is safer for downloads)
                resource_type: 'auto'
            };
        }
        // Else image
        return {
            folder: 'events/artifacts',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            resource_type: 'auto'
        };
    }
});

const uploadArtifact = multer({
    storage: artifactStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = { cloudinary, uploadArtifact };
