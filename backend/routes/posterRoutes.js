const express = require('express');
const router = express.Router();
const { getAllPosters, getLatestPoster, createPoster, deletePoster } = require('../controllers/posterController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadPoster } = require('../middleware/uploadMiddleware');

// All authenticated users can view posters
router.use(protect);
router.get('/', getAllPosters);
router.get('/latest', getLatestPoster);

// Only chairperson can create or delete
router.post('/', authorize('chairperson'), uploadPoster.single('image'), createPoster);
router.delete('/:id', authorize('chairperson'), deletePoster);

module.exports = router;

