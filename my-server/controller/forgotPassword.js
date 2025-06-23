require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require("../model/user")
const crypto = require('crypto');
const {sendPasswordResetEmail} = require("../services/emailSender")

router.post('/', async (req, res) => {

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    // Send email with reset link
      const resetUrl = `http://localhost:3000/reset-password/?token=${resetToken}`;
      try {
      await sendPasswordResetEmail(user.email, resetUrl);
      res.json({ message: 'Reset link sent to email' });
    } catch (emailError) {
      console.error('Email failed:', emailError);
      res.status(500).json({
        message: 'Email could not be sent',
        error: emailError.message
      });
    }

  } catch (error) {
    console.error('Server error:', error); // Detailed logging
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});


module.exports = router;