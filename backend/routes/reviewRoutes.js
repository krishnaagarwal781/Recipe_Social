const express = require('express');
const { createRecipeReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/:id/reviews').post(protect, createRecipeReview);

module.exports = router;
