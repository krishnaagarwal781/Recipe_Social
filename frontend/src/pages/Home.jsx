import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const recipes = [
    {
      id: 1,
      title: "Agua de Jamaica",
      description: "Refreshing hibiscus tea, a traditional Mexican beverage",
      image:
        "http://www.sharerecipes.com/wp-content/uploads/14727403_agua-de-jamaica-hibiscus-tea.jpg",
      author: "MexFoodJournal",
      rating: null,
      readMore: "https://mexicanfoodjournal.com/agua-de-jamaica-hibiscus...",
    },
    {
      id: 2,
      title: "Mushroom and Barley Risotto",
      description: "Risotto is a traditional rice-based Italian staple...",
      image:
        "http://www.sharerecipes.com/wp-content/uploads/13178634_Prawn-and-Seaweed-Somen-Noodles-1920x768.jpg",
      author: "Nikki N",
      rating: null,
      readMore: "#",
    },
    {
      id: 3,
      title: "Cumin-Spiced Sheet Pan Chicken & Pineapples",
      description: "Served with coriander yogurt for a flavorful meal",
      image:
        "https://www.sharerecipes.com/wp-content/themes/threcipe/images/default-image.jpg",
      author: "Nikki N",
      rating: 5,
      readMore: "#",
    },
    {
      id: 4,
      title: "Almond Banana Quinoa Breakfast Pudding",
      description: "Hasty pudding is a traditional British porridge made...",
      image:
        "http://www.sharerecipes.com/wp-content/uploads/10790335_Almond-Banana-Quinoa-Breakfast-Pudding-1920x768.jpg",
      author: "Nikki N",
      rating: 5,
      readMore: "#",
    },
  ];

  const StarRating = ({ rating }) => {
    if (!rating) return null;

    return (
      <div className="flex justify-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to the Recipe Sharing Platform!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your favorite recipes, rate and review others, and explore a
            world of culinary delights.
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Recipe Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = `/api/placeholder/400/250?text=${encodeURIComponent(
                      recipe.title
                    )}`;
                  }}
                />
                {recipe.rating && (
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1">
                    <StarRating rating={recipe.rating} />
                  </div>
                )}
              </div>

              {/* Recipe Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500 font-medium">
                    By {recipe.author}
                  </span>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <Link to="/create-recipe">
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Share Your Recipe
          </button>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
