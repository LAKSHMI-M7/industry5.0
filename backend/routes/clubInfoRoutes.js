const express = require('express');
const router = express.Router();
const { getClubInfo, updateClubInfo } = require('../controllers/clubInfoController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getClubInfo);
router.put('/', protect, authorize('admin'), updateClubInfo);

module.exports = router;

