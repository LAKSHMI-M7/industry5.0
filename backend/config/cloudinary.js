const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine the resource_type based on the file type
        // Cloudinary natively supports PDF uploads as raw or image depending on settings,
        // "auto" helps handle varying file types seamlessly.
        return {
            folder: 'industry5_events',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'pdf']
        };
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMime.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'), false);
    }
};

const uploadArtifact = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { cloudinary, uploadArtifact };
