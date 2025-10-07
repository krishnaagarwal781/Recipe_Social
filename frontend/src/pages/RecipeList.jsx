import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/recipes?keyword=${keyword}&category=${category}&sortBy=${sortBy}&pageNumber=${page}`
        );
        setRecipes(data.recipes);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch recipes');
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [keyword, category, sortBy, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading recipes...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Recipes</h2>
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search by title or ingredients..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full sm:w-auto"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full sm:w-auto">
          <option value="All">All Categories</option>
          <option value="Dessert">Dessert</option>
          <option value="Vegan">Vegan</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
          <option value="Other">Other</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full sm:w-auto">
          <option value="">Sort By</option>
          <option value="top-rated">Top Rated</option>
          <option value="most-recent">Most Recent</option>
        </select>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto">Search</button>
      </form>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-700">No recipes found. <Link to="/create-recipe" className="text-blue-500 hover:underline">Create one?</Link></p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <Link to={`/recipes/${recipe._id}`}>
                  {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover" />}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm">Category: {recipe.category}</p>
                    <p className="text-gray-800 font-medium">Rating: {recipe.averageRating.toFixed(1)} ({recipe.numReviews} reviews)</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center space-x-2">
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                className={`py-2 px-4 rounded-lg ${x + 1 === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeList;
