const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  cities: { type: [String] }
});

module.exports = mongoose.model('State', stateSchema);
