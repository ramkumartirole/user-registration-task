const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

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
      return res.status(400).json({ message: 'Email already registered' });
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
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });

  } catch (error) {
    console.error('🔴 Login Error:', error.message);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; 
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    });

    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('🔴 Forgot Password Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('🔴 Reset Password Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
 

