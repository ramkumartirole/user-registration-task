const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Register User
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      city,
      state,
      zip,
      country,
      areaOfInterest,
      profilePicture,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !gender || !city || !state || !zip || !country) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      city,
      state,
      zip,
      country,
      areaOfInterest: areaOfInterest || [],
      profilePicture: profilePicture || '',
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('🔴 Registration Error:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// 🔐 Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id }, // ✅ correct key
      process.env.JWT_SECRET, // ✅ must be defined in .env
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });

  } catch (error) {
    console.error('🔴 Login Error:', error.message);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

module.exports = router;
