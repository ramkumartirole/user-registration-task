const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, getAdminProfile } = require('../controllers/adminAuthController');

router.post('/send-otp', sendOtp);

router.post('/verify-otp', verifyOtp);

router.get('/profile', getAdminProfile);

module.exports = router;
