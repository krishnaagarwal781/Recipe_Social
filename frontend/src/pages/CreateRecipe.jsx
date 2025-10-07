import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Other');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false); // For image upload
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      setUploading(true);
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        };
        const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
        setImage(data.url);
        setUploading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Image upload failed');
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create a recipe.');
      return;
    }

    const ingredientsArray = ingredients.split(',').map(item => item.trim()).filter(item => item !== '');
    const stepsArray = steps.split('\n').map(item => item.trim()).filter(item => item !== '');

    try {
      await axios.post(
        'http://localhost:5000/api/recipes',
        { title, description, ingredients: ingredientsArray, steps: stepsArray, image, category },
        { withCredentials: true }
      );
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create recipe');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Create New Recipe</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients (comma-separated):</label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Steps (one per line):</label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-blue-500 mt-2">Uploading image...</p>}
            {image && <img src={image} alt="Recipe Preview" className="w-32 h-32 object-cover rounded-md mt-4" />}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Dessert">Dessert</option>
              <option value="Vegan">Vegan</option>
              <option value="Indian">Indian</option>
              <option value="Italian">Italian</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Create Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
