const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    }).status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    }).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  }).send('Logged out successfully');
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('favoriteRecipes', 'title image');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addFavoriteRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { recipeId } = req.body;

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.favoriteRecipes.includes(recipeId)) {
      return res.status(400).json({ msg: 'Recipe already in favorites' });
    }

    user.favoriteRecipes.push(recipeId);
    await user.save();
    res.json({ msg: 'Recipe added to favorites', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.removeFavoriteRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { recipeId } = req.body;

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.favoriteRecipes = user.favoriteRecipes.filter(
      (fav) => fav.toString() !== recipeId
    );
    await user.save();
    res.json({ msg: 'Recipe removed from favorites', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
