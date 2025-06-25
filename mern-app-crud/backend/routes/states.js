const express = require('express');
const State = require('../models/State');
const router = express.Router();

// Get all states, or filter by country
router.get('/', async (req, res) => {
  try {
    const { country } = req.query;
    let states;
    if (country) {
      states = await State.find({ country });
    } else {
      states = await State.find();
    }
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching states' });
  }
});

module.exports = router;