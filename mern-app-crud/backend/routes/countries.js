const express = require('express');
const Country = require('../models/Country');
const router = express.Router();

// Get all countries
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries' });
  }
});

module.exports = router;