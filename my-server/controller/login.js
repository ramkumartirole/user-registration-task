require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require("../model/user")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login Route
router.post('/', async (req, res) => {

  try {
    const { email, password } = req.body;
    // console.log(email,password,"email password")
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check user exists
    const user = await User.findOne({ email })
      .select('+password')
      .populate({
        path: 'city',
        select: 'name population' // include additional fields
      })
      .populate({
        path: 'state',
        select: 'name abbreviation' // include additional fields
      });
    if (!user) {
      return res.status(401).json({ message: 'No user found with this email' });
    }
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong Password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET, // Hardcoded secret
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        city: user.city ? user.city.name : null, // Access populated city name
        state: user.state ? user.state.name : null, // Access populated state name
        gender: user.gender,
        country: user.country,
        activity: user.activity
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;