const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload'); // 🧠 Make sure this exists

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth route is working' });
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Incorrect email or password.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔐 Secure Registration Route
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      firstName, lastName, gender, email, password, confirmPassword,
      city, state, country, zip
    } = req.body;

    const areaOfInterest = req.body.areaOfInterest || [];

    // Basic checks
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      gender,
      email,
      password: hashedPassword,
      city,
      state,
      country,
      zip,
      areaOfInterest: Array.isArray(areaOfInterest) ? areaOfInterest : [areaOfInterest],
      profilePicture: req.file ? req.file.filename : undefined
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// TEMP quick-register route
router.post('/quick-register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      city: "Lahore",
      state: "68594ec47935cad6d02f3ef6",
      country: "68594ec47935cad6d02f3ef2",
      zip: "54000",
      gender: "Male",
      areaOfInterest: ["Reading", "Writing"]
    });

    await user.save();
    res.json({ message: "Dummy user created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user." });
  }
});

module.exports = router;