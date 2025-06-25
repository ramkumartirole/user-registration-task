const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./db');
const { required } = require('joi');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth'); // login
const userRoutes = require('./routes/user'); // registration, list, etc.

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
connection();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// in index.js or server.js

