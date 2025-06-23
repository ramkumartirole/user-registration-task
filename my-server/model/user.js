
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  email: { type: String, unique: true },
  password: String,
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  zip: String,
  country: String,
  activity: String,
  activity: {
    type: [String], // Array of strings
    default: []
  },

  profileImage: String
});

module.exports = mongoose.model('User', userSchema);

