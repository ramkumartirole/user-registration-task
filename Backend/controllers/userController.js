const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.resetUserPasswordByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
