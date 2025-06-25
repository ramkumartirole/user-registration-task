require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const countryRoutes = require('./routes/countries');
const stateRoutes = require('./routes/states');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/states', stateRoutes);

// DB connect and server start
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });