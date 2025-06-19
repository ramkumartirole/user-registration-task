const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  states: { type: [String] }
});

module.exports = mongoose.model('Country', countrySchema);
