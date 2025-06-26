const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');
const nodemailer = require('nodemailer');

const router = express.Router();

// JWT secret for reset tokens (can be same or different from login one)
const RESET_TOKEN_SECRET = process.env.JWT_SECRET;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//  Test route
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

// Registration route
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      firstName, lastName, gender, email, password, confirmPassword,
      city, state, country, zip
    } = req.body;

    const areaOfInterest = req.body.areaOfInterest || [];

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

// Forgot password: Send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, RESET_TOKEN_SECRET, { expiresIn: '15m' });

    const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a><p>This link expires in 15 minutes.</p>`,
    });

    res.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Failed to send reset email' });
  }
});

//  Reset password
router.put('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

//  TEMP route: Quick register
router.post('/quick-register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

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