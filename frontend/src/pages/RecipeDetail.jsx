import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const isFavorite = user?.favoriteRecipes?.some(fav => fav._id === id);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch recipe");
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
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
      setReviewComment("");
    } catch (err) {
      setReviewError(err.response?.data?.msg || "Failed to submit review");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${id}`, {
          withCredentials: true,
        });
         setShowDeleteModal(false);
        navigate("/recipes");
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to delete recipe");
         setShowDeleteModal(false);
      }
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

   const DeleteModal = ({ isOpen, onClose, onConfirm, recipeTitle }) => {
     if (!isOpen) return null;

     return (
       <div className="fixed inset-0 bg-[#f2f9ff]/50  flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded shadow-xl max-w-md w-full transform transition-all">
           {/* Modal Header */}
           <div className="p-6 border-b border-gray-200">
             <div className="flex items-center space-x-3">
               <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                 <svg
                   className="w-6 h-6 text-red-600"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                   />
                 </svg>
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900">
                   Delete Recipe
                 </h3>
                 <p className="text-gray-600 mt-1">
                   This action cannot be undone
                 </p>
               </div>
             </div>
           </div>

           {/* Modal Body */}
           <div className="p-6">
             <p className="text-gray-700">
               Are you sure you want to delete{" "}
               <span className="font-semibold text-orange-600">
                 "{recipeTitle}"
               </span>
               ? This will permanently remove the recipe and all its reviews.
             </p>
           </div>

           {/* Modal Footer */}
           <div className="flex space-x-3 p-6 border-t border-gray-200">
             <button
               onClick={onClose}
               className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded transition-all duration-300"
             >
               Cancel
             </button>
             <button
               onClick={onConfirm}
               className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105"
             >
               Delete Recipe
             </button>
           </div>
         </div>
       </div>
     );
   };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Recipe Not Found
          </h3>
          <p className="text-red-500 mb-6">{error}</p>
          <Link
            to="/recipes"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
          >
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const hasReviewed = recipe.reviews.some(
    (review) => user && review.user === user._id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Recipe Header */}
        <div className="bg-white rounded hover:shadow-lg overflow-hidden mb-8">
          {recipe.image && (
            <div className="relative h-80 md:h-96 overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-4 py-2">
                <span className="text-gray-800 font-semibold">
                  {recipe.category}
                </span>
              </div>
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {recipe.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {recipe.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={Math.floor(recipe.averageRating)} />
                    <span className="text-gray-700 font-semibold">
                      {recipe.averageRating.toFixed(1)} ({recipe.numReviews}{" "}
                      reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>By {recipe.user.username}</span>
                  </div>
                </div>
              </div>

              {user && (
                <div className="flex flex-wrap gap-3 lg:justify-end mb-4 lg:mb-0">
                  <button
                    onClick={handleToggleFavorite}
                    className={`flex items-center space-x-2 py-2 px-6 rounded font-semibold transition-all duration-300 ${
                      isFavorite
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={isFavorite ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{isFavorite ? "Favorited" : "Add to Favorites"}</span>
                  </button>

                  {user._id === recipe.user._id && (
                    <>
                      <Link
                        to={`/edit-recipe/${recipe._id}`}
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition-all duration-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Edit Recipe</span>
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition-all duration-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients & Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <div className="bg-white rounded hover:shadow-lg p-8">
              <p className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg
                  className="w-8 h-8 mr-3 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Ingredients
              </p>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-lg">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="bg-white rounded hover:shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg
                  className="w-8 h-8 mr-3 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Cooking Steps
              </h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed pt-1">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Reviews Sidebar */}
          <div className="space-y-8">
            {/* Reviews Summary */}
            <div className="bg-white rounded hover:shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Reviews & Ratings
              </h3>

              {recipe.reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">⭐</div>
                  <p className="text-gray-600 text-lg">No reviews yet</p>
                  <p className="text-gray-500">
                    Be the first to review this recipe!
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {recipe.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2 leading-relaxed">
                        {review.comment}
                      </p>
                      {/* <p className="text-gray-500 text-sm">
                        By {review?.user.username}
                      </p> */}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form */}
            {user && !hasReviewed && (
              <div className="bg-white rounded hover:shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Submit Your Review
                </h3>
                {reviewError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
                    {reviewError}
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2 text-lg">
                      Rating
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                    <label className="block text-gray-800 font-semibold mb-2 text-lg">
                      Comment
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      placeholder="Share your experience with this recipe..."
                      className="w-full border border-gray-300 rounded py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all h-32 resize-none placeholder-gray-400"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded transition-all duration-300 transform hover:scale-105"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        recipeTitle={recipe.title}
      />
    </div>
  );
};

export default RecipeDetail;
