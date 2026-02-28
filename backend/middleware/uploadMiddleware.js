const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploader = (folder, prefix) => {
    // In Vercel, we must use /tmp for uploads since the filesystem is read-only.
    // However, files in /tmp are ephemeral.
    const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
    const uploadDir = isVercel ? `/tmp/uploads/${folder}` : `uploads/${folder}`;
    
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    } catch (err) {
        console.warn(`Warning: Could not create upload directory ${uploadDir}:`, err.message);
    }


    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    };

    return multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
};

const uploadProfile = createUploader('profiles', 'profile');
const uploadPoster = createUploader('posters', 'poster');

module.exports = { uploadProfile, uploadPoster };

