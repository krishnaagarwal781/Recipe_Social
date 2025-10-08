import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const EditRecipe = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        const recipeData = res.data;
        if (user && recipeData.user._id !== user._id) {
          navigate("/"); // Redirect if not authorized
          return;
        }
        setTitle(recipeData.title);
        setDescription(recipeData.description);
        setIngredients(recipeData.ingredients.join(", "));
        setSteps(recipeData.steps.join("\n"));
        setImage(recipeData.image || "");
        setCategory(recipeData.category);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch recipe");
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, user, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      setUploading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        };
        const { data } = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          config
        );
        setImage(data.url);
        setUploading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Image upload failed");
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const ingredientsArray = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const stepsArray = steps
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      await axios.put(
        `http://localhost:5000/api/recipes/${id}`,
        {
          title,
          description,
          ingredients: ingredientsArray,
          steps: stepsArray,
          image,
          category,
        },
        { withCredentials: true }
      );
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update recipe");
    }
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

  if (error && error.includes("Failed to fetch recipe")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Recipe Not Found
          </h3>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/recipes")}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-6 rounded transition-all duration-300 inline-block"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edit Your Recipe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Update your recipe details and make it even better than before.
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Left Side - Form */}
              <div className="md:w-2/3 p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2 text-lg">
                      Recipe Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Enter your recipe name..."
                      className="w-full border border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2 text-lg">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="Describe your recipe... What makes it special?"
                      className="w-full border border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 h-32 resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-2 text-lg">
                      Cooking Steps
                    </label>
                    <textarea
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      required
                      placeholder="Enter each step on a new line...
Step 1: Preheat oven to 350°F
Step 2: Mix dry ingredients
..."
                      className="w-full border border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 h-48 resize-none"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1  gap-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-gray-800 font-semibold mb-3 text-lg">
                        Recipe Image URL
                      </label>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/recipe-image.jpg"
                        className="w-full border border-gray-300 rounded-xl py-4 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Enter the full URL of your recipe image
                      </p>
                    </div>

                    {/* Category */}
                  </div>
                  {/* Ingredients & Steps in Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ingredients */}
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-lg">
                        Ingredients
                      </label>
                      <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        required
                        placeholder="Enter ingredients separated by commas...
Example: 2 cups flour, 1 tsp salt, 3 eggs"
                        className="w-full border border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 h-48 resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-lg">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="Dessert">Dessert</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Indian">Indian</option>
                        <option value="Italian">Italian</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Steps */}
                  </div>

                  {/* Image Upload & Category */}

                  {/* Image Preview */}
                  {image && (
                    <div className="bg-gray-50 rounded p-4">
                      <label className="block text-gray-800 font-semibold mb-2 text-lg">
                        Current Image Preview
                      </label>
                      <div className="flex justify-center">
                        <img
                          src={image}
                          alt="Recipe Preview"
                          className="w-48 h-48 object-cover rounded shadow-md border border-gray-200"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                    >
                      Update Recipe
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/recipes/${id}`)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side - Tips */}
              <div className="md:w-1/3 bg-gradient-to-b from-orange-500 to-red-500 p-8 text-white">
                <div className="sticky top-8">
                  <h3 className="text-2xl font-bold mb-6">Editing Tips</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-white bg-opacity-20 rounded-full p-2 mt-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p>Double-check measurements and cooking times</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-white bg-opacity-20 rounded-full p-2 mt-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p>Consider adding new tips based on feedback</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-white bg-opacity-20 rounded-full p-2 mt-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p>Update images to show improved results</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-white bg-opacity-20 rounded-full p-2 mt-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p>Verify category still matches your recipe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
