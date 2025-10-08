import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Other");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("image", file);
  //     setUploading(true);
  //     try {
  //       const config = {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         withCredentials: true,
  //       };
  //       const { data } = await axios.post(
  //         "http://localhost:5000/api/upload",
  //         formData,
  //         config
  //       );
  //       setImage(data.url);
  //       setUploading(false);
  //     } catch (err) {
  //       setError(err.response?.data?.msg || "Image upload failed");
  //       setUploading(false);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to create a recipe.");
      return;
    }

    const ingredientsArray = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const stepsArray = steps
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      await axios.post(
        "http://localhost:5000/api/recipes",
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
      navigate("/recipes");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create recipe");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Recipe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your culinary masterpiece with the community. Fill in the
            details below to create your recipe.
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
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
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
                      className="w-full border border-gray-300 rounded py-4 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 h-32 resize-none"
                    ></textarea>
                  </div>

                  {/* Ingredients & Steps in Grid */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* Ingredients */}

                    {/* Steps */}
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
                        className="w-full border border-gray-300 rounded py-4 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 h-48 resize-none"
                      ></textarea>
                    </div>
                  </div>
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
                      Paste the URL of your recipe image
                    </p>
                  </div>
                  {/* Image Upload & Category */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Upload */}

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
                        className="w-full border border-gray-300 rounded py-4 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 h-48 resize-none"
                      ></textarea>
                    </div>
                    {/* Category */}
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
                      
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {image && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <label className="block text-gray-800 font-semibold mb-4 text-lg">
                        Image Preview
                      </label>
                      <div className="flex flex-col items-center">
                        <img
                          src={image}
                          alt="Recipe Preview"
                          className="w-64 h-64 object-cover rounded-xl shadow-md border border-gray-200 mb-4"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/256x256?text=Image+Not+Found";
                          }}
                        />
                        <p className="text-sm text-gray-500 text-center">
                          If the image doesn't load, check the URL is correct
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                  >
                    Create Recipe
                  </button>
                </form>
              </div>

              {/* Right Side - Tips */}
              <div className="md:w-1/3 bg-gradient-to-b from-orange-500 to-red-500 p-8 text-white">
                <div className="sticky top-8">
                  <h3 className="text-2xl font-bold mb-6">Recipe Tips</h3>
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
                      <p>Be specific with measurements and cooking times</p>
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
                      <p>Include helpful tips and serving suggestions</p>
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
                      <p>High-quality photos attract more viewers</p>
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
                      <p>Choose the right category for better discovery</p>
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

export default CreateRecipe;
