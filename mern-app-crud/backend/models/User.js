const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },  // State as a string
  country: { type: String, required: true }, // Country as a string
  zip: { type: String, required: true },
  areaOfInterest: { type: [String], required: true },
  gender: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
