require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require("../model/user");
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;


    await user.save()
      .then(() => console.log('User successfully updated'))
      .catch(err => console.error('Save error:', err));
    res.json({ message: 'Password reset successful' });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;