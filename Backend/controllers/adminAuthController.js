const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

const ADMIN_EMAIL = process.env.EMAIL_USER;

exports.sendOtp = async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== 'admin123') {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save or overwrite OTP
  await Otp.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );

  await sendEmail(email, 'Your Admin Login OTP', `Your OTP is: ${otp}`);

  res.status(200).json({ message: 'OTP sent successfully' });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });

  if (!record || record.otp !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // Optional: delete OTP after verification
  await Otp.deleteOne({ email });

  const token = generateToken({ email, role: 'admin' });
  res.status(200).json({ token });
};
