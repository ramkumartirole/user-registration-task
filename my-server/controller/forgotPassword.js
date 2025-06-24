require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require("../model/user")
const crypto = require('crypto');
const {sendPasswordResetEmail} = require("../services/emailSender")

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });


    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.validate().catch(err => {
      throw err;
    });

    const savedUser = await user.save();
    const resetUrl = `${process.env.FrontEndLink}reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ message: 'Reset link sent to email' });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});


module.exports = router;