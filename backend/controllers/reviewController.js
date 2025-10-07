const Recipe = require('../models/Recipe');
const Review = require('../models/Review');

// @desc    Create a new review
// @route   POST /api/recipes/:id/reviews
// @access  Private
exports.createRecipeReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      const alreadyReviewed = recipe.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ msg: 'Recipe already reviewed' });
      }

      const review = {
        user: req.user._id,
        rating: Number(rating),
        comment,
      };

      recipe.reviews.push(review);

      recipe.numReviews = recipe.reviews.length;

      recipe.averageRating =
        recipe.reviews.reduce((acc, item) => item.rating + acc, 0) /
        recipe.reviews.length;

      await recipe.save();
      res.status(201).json({ msg: 'Review added' });
    } else {
      res.status(404).json({ msg: 'Recipe not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
