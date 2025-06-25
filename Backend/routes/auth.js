const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Email transporter setup (Gmail with App Password)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Step 1: Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter setup failed:', error);
  } else {
    console.log('✅ Email transporter is ready to send emails');
  }
});

// Send welcome email with HTML content
const sendWelcomeEmail = async (toEmail, name) => {
  const mailOptions = {
    from: `"User Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Welcome to the User Management System!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
          <h2 style="color: #6a1b9a; margin-bottom: 10px;">Hi ${name},</h2>
          <p>🎉 Welcome to the <strong>User Management System</strong>!</p>
          <p>Your account has been <strong>successfully created</strong> and you’re now ready to get started.</p>
          <p>If you need any help, feel free to reach out to our support team anytime.</p>
          <br/>
          <p style="margin-top: 30px;">Warm regards,<br/><strong>User Management System Team</strong></p>
        </div>
      </div>
    `,
    text: `Hi ${name},\n\nWelcome to the User Management System!\nYour account has been successfully created and you're now ready to get started.\n\nWarm regards,\nUser Management System Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ HTML welcome email sent to ${toEmail}`);
  } catch (err) {
    console.error(`❌ Failed to send welcome email to ${toEmail}:`, err);
  }
};




// REGISTER
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
      return res.status(400).json({ message: 'This email has already been registered. Please use another email.' });

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

    console.log(`📧 Sending welcome email to ${email}`);
    await sendWelcomeEmail(email, firstName);
    console.log(`✅ Welcome email sent`);

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('🔴 Registration Error:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token });

  } catch (error) {
    console.error('🔴 Login Error:', error.message);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ Forgot Password: No user registered with email ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Reset Your Password – User Management System',
     html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #764ba2;">Password Reset Request</h2>
    <p>Dear ${user.firstName || 'User'},</p>

    <p>We received a request to reset your password for your <strong>User Management System</strong> account.</p>

    <p>Please click the button below to reset your password. This link will remain valid for <strong>1 hour</strong>.</p>

    <div style="margin: 24px 0;">
      <a href="${resetLink}" style="
        background-color: #667eea;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        display: inline-block;
        font-weight: bold;
      ">
        Reset Your Password
      </a>
    </div>

    <p>If you didn’t request this, no action is needed. Your account is still secure.</p>

    <p>Best regards,<br><strong>User Management System Team</strong></p>
  </div>
`


    });

    console.log(`✅ Forgot Password: Reset link sent to ${email}`);
    res.status(200).json({ message: 'Reset link sent to your email' });

  } catch (err) {
    console.error('🔴 Forgot Password Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
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
