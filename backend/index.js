const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./db');
const { required } = require('joi');
const jwt = require('jsonwebtoken')

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:3000', // frontend origin
//   credentials: true
// }));

const authRoutes = require('./routes/auth'); // login
const userRoutes = require('./routes/user'); // registration, list, etc.

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
connection();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




