const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/adminAuthController');

// Route to send OTP to admin email
router.post('/send-otp', sendOtp);

// Route to verify OTP and return JWT
router.post('/verify-otp', verifyOtp);

module.exports = router;
