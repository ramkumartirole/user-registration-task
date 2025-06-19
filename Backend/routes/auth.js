const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Register Route
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

    // Required field check
    if (!firstName || !lastName || !email || !password || !gender || !city || !state || !zip || !country) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
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

// ✅ Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
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

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1d' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('🔴 Login Error:', error.message);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

module.exports = router;
