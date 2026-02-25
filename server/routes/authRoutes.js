const express = require('express');
const router = express.Router();
const { loginUser, changePassword, updateAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfile } = require('../middleware/uploadMiddleware');

router.post('/login', loginUser);
router.post('/change-password', protect, changePassword);
router.post('/avatar', protect, uploadProfile.single('avatar'), updateAvatar);

module.exports = router;
