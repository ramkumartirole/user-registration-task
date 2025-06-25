const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all Users (protected)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Edit user (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete User (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
