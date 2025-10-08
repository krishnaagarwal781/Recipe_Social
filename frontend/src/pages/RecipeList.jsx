import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axios.get(
          `https://recipe-social-7hoa.onrender.com/api/recipes?keyword=${keyword}&category=${category}&sortBy=${sortBy}&pageNumber=${page}`
        );
        setRecipes(data.recipes);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch recipes");
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [keyword, category, sortBy, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center text-gray-600 text-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          Loading recipes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center text-red-500 font-semibold bg-white p-8 rounded-2xl shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
            🍽️ Discover Delicious Recipes
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Search, filter, and explore a wide range of recipes — from desserts
            to Indian delicacies. Find something new to cook today!
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Search & Filters */}
        <div className=" p-6 mb-10  flex items-end justify-end">
          <form
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row gap-4 items-center w-[800px] "
          >
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="🔍 Search recipes..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className=" bg-white border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all flex-1"
              >
                <option value="All">All Categories</option>
                <option value="Dessert">Dessert</option>
                <option value="Vegan">Vegan</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="    bg-white border-gray-300 rounded py-1 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all flex-1"
              >
                <option value="">Sort By</option>
                <option value="top-rated">Top Rated</option>
                <option value="most-recent">Most Recent</option>
                <option value="most-popular">Most Popular</option>
              </select>

              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-1 px-10 rounded transition-all duration-300 transform hover:scale-105 shadow-lg flex-1"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Recipes Grid */}
        {recipes.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow-lg p-12">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No recipes found
            </h3>
            <p className="text-gray-600 mb-6">Why not create the first one?</p>
            <Link
              to="/create-recipe"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 inline-block"
            >
              Create Recipe
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <Link to={`/recipes/${recipe._id}`} className="block">
                    {recipe.image ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">
                          {recipe.category}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🍽️</div>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {recipe.title}
                      </h3>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(recipe.averageRating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({recipe.numReviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">
                          By {recipe.user.username || "Unknown"}
                        </span>
                        <span className="text-orange-600 font-semibold text-sm">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2 bg-white rounded-2xl shadow-lg p-2">
                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => setPage(x + 1)}
                      className={`py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
                        x + 1 === page
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {x + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
