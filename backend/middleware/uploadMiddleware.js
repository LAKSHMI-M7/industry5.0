const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploader = (folder, prefix) => {
    const uploadDir = `uploads/${folder}`;
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
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

