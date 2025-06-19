const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Edit User
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
