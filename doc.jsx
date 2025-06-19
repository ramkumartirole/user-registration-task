

 Technical Documentation and Guideline for Developing a MERN App

This document provides a step-by-step guide to developing a MERN (MongoDB, Express.js, React.js, Node.js) application based on the provided task description. The application involves user registration, login, password reset, user management, and related features.



 1. Project Setup

# 1.1. Project Structure
- Create a root directory for your project.
- Inside the root directory, create two subdirectories:
  - `backend` for Node.js and Express.js.
  - `frontend` for React.js.

# 1.2. Initialize Node.js Project
- Navigate to the `backend` directory and run:
  
  npm init -y
 
- Install required dependencies:
  
  npm install express mongoose cors dotenv bcrypt jsonwebtoken
  

# 1.3. Initialize React.js Project
- Navigate to the `frontend` directory and run:
  
  npx create-react-app ./
  
- Install required dependencies:
  
  npm install axios material-ui-core react-router-dom
  

# 1.4. Set Up MongoDB
- Install MongoDB locally or use MongoDB Atlas for a cloud-based database.
- Create a `.env` file in the `backend` directory and add:
  
  DB_URI=mongodb://localhost:27017/your_database_name
  PORT=5000
  JWT_SECRET=your_jwt_secret_key
  



 2. Database Design

# 2.1. Define Schemas
- Create a `models` directory in the `backend` folder.
- Define the following schemas using Mongoose:

User Schema:

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  areaOfInterest: { type: [String] },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);


State Schema:

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  cities: { type: [String] }
});

module.exports = mongoose.model('State', stateSchema);


Country Schema:

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  states: { type: [String] }
});

module.exports = mongoose.model('Country', countrySchema);


# 2.2. Define Relationships
- Ensure that the `State` schema references the `Country` schema.
- Ensure that the `User` schema references the `State` and `Country` schemas.

# 2.3. Indexing
- Add indexes to improve query performance:
  
  userSchema.index({ email: 1 }, { unique: true });
  



 3. Backend Development

# 3.1. Set Up Express.js
- Create a `server.js` file in the `backend` directory.
- Import required modules and set up middleware:
  
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const dotenv = require('dotenv');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  
  dotenv.config();
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  

# 3.2. Connect to MongoDB
- Add the following code to `server.js`:
  
  mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
  

# 3.3. Create Routes
- Create separate route files for different functionalities (e.g., `auth.js`, `users.js`).

Registration Route:

app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});


Login Route:

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});


Forgot Password Route:

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resetToken = Math.random().toString(36).substring(2, 10);
    user.resetToken = resetToken;
    await user.save();
    
    // Send the reset token via email
    // (Implement email functionality or return the token for testing)
    res.status(200).json({ resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Error sending password reset link' });
  }
});


Reset Password Route:

app.put('/api/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    const user = await User.findOne({ resetToken });
    if (!user) {
      return res.status(404).json({ message: 'Invalid reset token' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});


Get All Users Route:

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});


Edit User Route:

app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});


Delete User Route:

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});




 4. Frontend Development

# 4.1. Set Up React.js
- Navigate to the `frontend` directory and run:
  
  npm start
  

# 4.2. Create Components
- Create the following components in the `frontend/src/components` directory:

Registration Form:

import React, { useState } from 'react';
import { TextField, Button, Checkbox } from '@material-ui/core';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    areaOfInterest: [],
    profilePicture: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      alert('Registration successful');
    } catch (error) {
      alert('Error during registration');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      {/* Add other form fields similarly */}
      <Button type="submit">Register</Button>
    </form>
  );
};

export default RegistrationForm;


Login Page:

import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginPage;


User List Page:

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const UserListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        alert('Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>First Name</TableCell>
          <TableCell>Last Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map(user => (
          <TableRow key={user._id}>
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {/* Add Edit, Reset Password, and Delete buttons */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserListPage;




 5. Integration

# 5.1. Connect Frontend to Backend
- Use `axios` to make HTTP requests from the frontend to the backend.
- Add the following code to `frontend/src/index.js`:
  
  import axios from 'axios';
  axios.defaults.baseURL = 'http://localhost:5000/api';
  

# 5.2. Implement JWT Authentication
- Add a token interceptor in `frontend/src/index.js`:
  
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  

# 5.3. Handle Logout
- Add a logout function:
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  



 6. Security Considerations

# 6.1. Password Hashing
- Use `bcrypt` to hash passwords before storing them in the database.
- Use `bcrypt.compare` to verify passwords during login.

# 6.2. JWT Authentication
- Generate a JWT
