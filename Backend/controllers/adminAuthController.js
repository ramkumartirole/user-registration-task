const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

const ADMIN_EMAIL = process.env.EMAIL_USER;
const ADMIN_NAME = 'Ayesha Iqbal '; 


exports.sendOtp = async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== 'admin123') {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

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

  await Otp.deleteOne({ email });

  const token = generateToken({ email, role: 'admin' });

  res.status(200).json({ token });
};


exports.getAdminProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: 'admin',
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
