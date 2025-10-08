import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [userRecipes, setUserRecipes] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (user) {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/api/recipes?user=${user._id}`
          );
          setUserRecipes(data.recipes);
          setProfileLoading(false);
        } catch (err) {
          setProfileError(
            err.response?.data?.msg || "Failed to fetch user recipes"
          );
          setProfileLoading(false);
        }
      }
    };
    fetchUserRecipes();
  }, [user, setUserRecipes]);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Profile
          </h3>
          <p className="text-red-500 mb-6">{profileError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile.
          </p>
          <Link
            to="/login"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your recipes and favorite culinary creations
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.username}
                </h2>
                <p className="text-gray-600 text-lg mb-4">{user.email}</p>

                <div className="flex flex-wrap gap-6 text-center">
                  <div className="bg-orange-50 rounded-xl p-4 min-w-32">
                    <div className="text-2xl font-bold text-orange-600">
                      {userRecipes.length}
                    </div>
                    <div className="text-sm text-gray-600">Recipes Created</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 min-w-32">
                    <div className="text-2xl font-bold text-amber-600">
                      {user.favoriteRecipes ? user.favoriteRecipes.length : 0}
                    </div>
                    <div className="text-sm text-gray-600">Favorites</div>
                  </div>
                </div>
              </div>

              {/* Create Recipe Button */}
              <div className="flex-shrink-0">
                <Link
                  to="/create-recipe"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Create Recipe</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Recipes Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">My Recipes</h3>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {userRecipes.length}
                </span>
              </div>

              {userRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🍳</div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    No Recipes Yet
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Start sharing your culinary creations with the community!
                  </p>
                  <Link
                    to="/create-recipe"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 inline-block"
                  >
                    Create Your First Recipe
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userRecipes.map((recipe) => (
                    <Link
                      key={recipe._id}
                      to={`/recipes/${recipe._id}`}
                      className="block border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-orange-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        {recipe.image ? (
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center text-orange-400">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                            {recipe.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                              {recipe.category}
                            </span>
                            <StarRating rating={recipe.averageRating} />
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Recipes Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Favorite Recipes
                </h3>
                <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {user.favoriteRecipes ? user.favoriteRecipes.length : 0}
                </span>
              </div>

              {!user.favoriteRecipes || user.favoriteRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">⭐</div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    No Favorites Yet
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Discover and save amazing recipes from our community!
                  </p>
                  <Link
                    to="/recipes"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 inline-block"
                  >
                    Explore Recipes
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {user.favoriteRecipes.map((recipe) => (
                    <Link
                      key={recipe._id}
                      to={`/recipes/${recipe._id}`}
                      className="block border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-amber-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        {recipe.image ? (
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg flex items-center justify-center text-amber-400">
                            <svg
                              className="w-8 h-8"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                            {recipe.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs font-medium">
                              {recipe.category}
                            </span>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
