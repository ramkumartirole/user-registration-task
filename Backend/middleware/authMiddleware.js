const jwt = require('jsonwebtoken');

// This should match the admin email set in your environment variables
const ADMIN_EMAIL = process.env.EMAIL_USER;

// Middleware to verify token and check if it's an admin
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure token belongs to the admin
    if (decoded.role !== 'admin' || decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Access denied: not an admin' });
    }

    req.admin = decoded; // Attach admin info to request
    next();
  } catch (err) {
    console.error('❌ Admin token verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};

module.exports = {
  verifyAdminToken,
};
