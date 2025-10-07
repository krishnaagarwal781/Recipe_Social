const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileupload = require('express-fileupload'); // For image uploads

dotenv.config();
require('./config/cloudinary'); // Initialize Cloudinary

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend to access
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileupload({ useTempFiles: true })); // For image uploads

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes')); // For image uploads
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/recipes', require('./routes/reviewRoutes')); // Reviews are nested under recipes
app.use('/api/recipes', require('./routes/pdfRoutes')); // PDF export route

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
