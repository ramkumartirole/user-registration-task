const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  zip: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  areaOfInterest: { type: [String] },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Add index on email
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
