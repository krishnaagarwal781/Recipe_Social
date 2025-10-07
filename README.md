# Recipe Sharing & Rating Platform

This is a mini social application where users can share recipes, rate and review them, and filter/search based on categories/ingredients.

## Features

**Authentication (JWT):**
* User registration, login, and logout.
* User profile page displaying their recipes and reviews.

**Recipe Management (CRUD):**
* Create, edit, and delete recipes.
* Fields include title, description, ingredients (array), steps, image, and category.
* Each recipe belongs to a user.

**Ratings & Reviews:**
* Logged-in users can rate recipes (1–5 stars) and write reviews.
* Displays average rating for each recipe.
* Prevents multiple reviews by the same user per recipe.

**Search & Filters:**
* Search recipes by title or ingredients.
* Filter by category (Dessert, Vegan, Indian, Italian, Other).
* Sort by top-rated or most recent.

**Frontend (React with Tailwind CSS):**
* Pages: Login/Register, Recipe List, Recipe Detail (with reviews), Create/Edit Recipe, Profile.
* Recipe cards with images and ratings.
* Review form with star rating and comment.
* Responsive UI using Tailwind CSS.

**Backend (Express + MongoDB):**
* Models: User, Recipe, Review.
* Routes: `/api/auth`, `/api/recipes`, `/api/recipes/:id/reviews`, `/api/upload`, `/api/recipes/:id/pdf`.
* Middleware for authentication and validation.

**Bonus Features Implemented:**
* Upload recipe images to Cloudinary.
* Pagination (10 recipes per page).
* Favorite recipes (save to profile).
* Export recipes to PDF.

## Technologies Used

**Frontend:**
* React
* React Router DOM
* Axios
* Tailwind CSS
* Vite

**Backend:**
* Node.js
* Express.js
* MongoDB (Mongoose ODM)
* JSON Web Tokens (JWT) for authentication
* Bcrypt.js for password hashing
* Cookie-parser for handling cookies
* CORS for cross-origin resource sharing
* Express-fileupload for image uploads
* Cloudinary for image storage
* PDFKit for PDF generation

## Setup and Installation

Follow these steps to set up and run the project locally.

### Prerequisites

* Node.js (v14 or higher)
* npm (v6 or higher)
* MongoDB (ensure it's running locally on `mongodb://localhost:27017`)

### 1. Clone the Repository

```bash
git clone <repository_url>
cd Recipe_Social
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and create a `.env` file.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/recipe_social
JWT_SECRET=supersecretjwtkey
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Replace `your_cloud_name`, `your_api_key`, and `your_api_secret` with your actual Cloudinary credentials.

### 3. Start the Backend Server

Ensure your MongoDB instance is running. Then, start the backend server:

```bash
npm start
```
The backend API will be running on `http://localhost:5000`. You should see "MongoDB Connected" and "Server running on port 5000" in your terminal.

### 4. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, and install dependencies.

```bash
cd ../frontend
npm install
```

### 5. Start the Frontend Development Server

```bash
npm run dev
```
The frontend application will be running on `http://localhost:5173`.

## Usage

1. **Register/Login:** Access the application in your browser (usually `http://localhost:5173`). Register a new account or log in with existing credentials.
2. **Create Recipes:** Navigate to the "Create Recipe" page to add your own recipes, including images.
3. **Browse Recipes:** Explore the "Recipes" page to view all shared recipes. Use the search, filter, and sort options.
4. **Recipe Details:** Click on a recipe card to view its full details, including ingredients, steps, and reviews.
5. **Rate & Review:** On the recipe detail page, logged-in users can submit a rating and review.
6. **Favorites:** Add recipes to your favorites from the recipe detail page.
7. **Profile:** View your created recipes and favorited recipes on your profile page.
8. **Edit/Delete Recipes:** If you are the owner of a recipe, you can edit or delete it from the recipe detail page.
9. **Export to PDF:** From a recipe detail page, you can export the recipe to a PDF document.
