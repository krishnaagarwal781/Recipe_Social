import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch recipe');
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await axios.post(
        `http://localhost:5000/api/recipes/${id}/reviews`,
        { rating: reviewRating, comment: reviewComment },
        { withCredentials: true }
      );
      // Refresh recipe data after review
      const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(res.data);
      setReviewRating(0);
      setReviewComment('');
    } catch (err) {
      setReviewError(err.response?.data?.msg || 'Failed to submit review');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${id}`, { withCredentials: true });
        navigate('/recipes');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete recipe');
      }
    }
  };

  if (loading) {
    return <div>Loading recipe...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  const hasReviewed = recipe.reviews.some(review => user && review.user === user._id);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
        {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-md mb-4" />}
        <p className="text-gray-700 mb-2">
          <strong className="font-semibold">Description:</strong> {recipe.description}
        </p>
        <p className="text-gray-700 mb-2">
          <strong className="font-semibold">Category:</strong> {recipe.category}
        </p>
        <p className="text-gray-700 mb-2">
          <strong className="font-semibold">Ingredients:</strong>
        </p>
        <ul className="list-disc list-inside mb-4">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>
        <p className="text-gray-700 mb-2">
          <strong className="font-semibold">Steps:</strong>
        </p>
        <ol className="list-decimal list-inside mb-4">
          {recipe.steps.map((step, index) => (
            <li key={index} className="text-gray-700">{step}</li>
          ))}
        </ol>
        <p className="text-gray-800 font-semibold mb-4">
          Average Rating: {recipe.averageRating.toFixed(1)} ({recipe.numReviews} reviews)
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Created by: {recipe.user.username}
        </p>

        {user && (
          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleToggleFavorite}
              className={`py-2 px-4 rounded-md font-bold ${isFavorite ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            {user._id === recipe.user._id && (
              <>
                <Link
                  to={`/edit-recipe/${recipe._id}`}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Edit Recipe
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Delete Recipe
                </button>
              </>
            )}
          </div>
        )}

        <h3 className="text-2xl font-bold mb-4">Reviews</h3>
        {recipe.reviews.length === 0 ? (
          <p className="text-gray-700">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {recipe.reviews.map((review) => (
              <li key={review._id} className="border border-gray-200 p-4 rounded-md shadow-sm">
                <p className="font-semibold">Rating: {review.rating} stars</p>
                <p className="text-gray-700">Comment: {review.comment}</p>
                <p className="text-gray-500 text-sm">By: {review.user.username}</p>
              </li>
            ))}
          </ul>
        )}

        {user && !hasReviewed && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold mb-4">Submit a Review</h3>
            {reviewError && <p className="text-red-500 mb-4">{reviewError}</p>}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Comment:</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
