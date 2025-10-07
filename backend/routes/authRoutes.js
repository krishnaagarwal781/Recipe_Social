const express = require('express');
const { registerUser, loginUser, logoutUser, getProfile, addFavoriteRecipe, removeFavoriteRecipe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getProfile);
router.post('/favorites', protect, addFavoriteRecipe);
router.delete('/favorites', protect, removeFavoriteRecipe);

module.exports = router;
