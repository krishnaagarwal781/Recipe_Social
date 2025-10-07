import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EditRecipe = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Other');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        const recipeData = res.data;
        if (user && recipeData.user._id !== user._id) {
          navigate('/'); // Redirect if not authorized
          return;
        }
        setTitle(recipeData.title);
        setDescription(recipeData.description);
        setIngredients(recipeData.ingredients.join(', '));
        setSteps(recipeData.steps.join('\n'));
        setImage(recipeData.image || '');
        setCategory(recipeData.category);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch recipe');
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const ingredientsArray = ingredients.split(',').map(item => item.trim()).filter(item => item !== '');
    const stepsArray = steps.split('\n').map(item => item.trim()).filter(item => item !== '');

    try {
      await axios.put(
        `http://localhost:5000/api/recipes/${id}`,
        { title, description, ingredients: ingredientsArray, steps: stepsArray, image, category },
        { withCredentials: true }
      );
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update recipe');
    }
  };

  if (loading) {
    return <div>Loading recipe...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Recipe</h2>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Image URL (optional):</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
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
            Update Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
