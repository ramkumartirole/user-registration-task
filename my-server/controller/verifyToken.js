const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());


function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided. Login please.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

module.exports = verifyToken;
