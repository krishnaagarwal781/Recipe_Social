const Favorite = require("../models/favoriteModel");
const Recipe = require("../models/recipeModel");

// Add to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;

    const favorite = await Favorite.create({
      user: userId,
      recipe: recipeId,
    });

    await favorite.populate("recipe");
    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    await Favorite.findOneAndDelete({
      user: userId,
      recipe: recipeId,
    });

    res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get user favorites
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ user: userId })
      .populate("recipe")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
