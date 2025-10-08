const express = require("express");
const router = express.Router();
const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} = require("../controllers/favoriteController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addToFavorites);
router.delete("/:recipeId", protect, removeFromFavorites);
router.get("/my-favorites", protect, getUserFavorites);

module.exports = router;
