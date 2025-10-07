import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [userRecipes, setUserRecipes] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (user) {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/recipes?user=${user._id}`); // Assuming a filter by user ID is implemented in backend
          setUserRecipes(data.recipes); // Correctly extract the recipes array
          setProfileLoading(false);
        } catch (err) {
          setProfileError(err.response?.data?.msg || 'Failed to fetch user recipes');
          setProfileLoading(false);
        }
      }
    };
    fetchUserRecipes();
  }, [user, setUserRecipes]);

  if (loading || profileLoading) {
    return <div>Loading profile...</div>;
  }

  if (profileError) {
    return <div style={{ color: 'red' }}>{profileError}</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>
        <p className="text-lg mb-2">
          <strong className="font-semibold">Username:</strong> {user.username}
        </p>
        <p className="text-lg mb-6">
          <strong className="font-semibold">Email:</strong> {user.email}
        </p>

        <h3 className="text-2xl font-bold mb-4">My Recipes</h3>
        {userRecipes.length === 0 ? (
          <p className="text-gray-700">
            You haven't created any recipes yet.{' '}
            <Link to="/create-recipe" className="text-blue-500 hover:underline">
              Create one?
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {userRecipes.map((recipe) => (
              <div key={recipe._id} className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <Link to={`/recipes/${recipe._id}`}>
                  {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover" />}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm">Category: {recipe.category}</p>
                    <p className="text-gray-800 font-medium">
                      Rating: {recipe.averageRating.toFixed(1)} ({recipe.numReviews} reviews)
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-2xl font-bold mb-4">Favorite Recipes</h3>
        {user.favoriteRecipes && user.favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {user.favoriteRecipes.map((recipe) => (
              <div key={recipe._id} className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <Link to={`/recipes/${recipe._id}`}>
                  {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover" />}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">You haven't favorited any recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
