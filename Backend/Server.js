const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const passwordRoutes = require('./routes/password');
const adminAuthRoutes = require('./routes/adminAuth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Default route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Use routes (✅ grouped logically)
app.use('/api/auth', authRoutes);           // ✅ Register, Login, Forgot Password
app.use('/api/users', userRoutes);          // ✅ User CRUD
app.use('/api/password', passwordRoutes);   // ✅ Optional: separate reset logic if needed
app.use('/api/auth/admin', adminAuthRoutes); // ✅ Admin OTP login

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
