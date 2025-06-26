const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zip: { type: String, required: true },
  areaOfInterest: { type: [String], required: true },
  gender: { type: String, required: true },

  
  profilePicture: { type: String },

  // For password reset
  resetToken: String,
  resetTokenExpiration: Date,
});

const User = mongoose.model('User', userSchema);
module.exports = User;