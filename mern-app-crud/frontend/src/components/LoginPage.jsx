// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Grid } from '@mui/material';
import axios from 'axios';
import ForgotPasswordDialog from './ForgotPasswordDialog';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', {
        email: form.email.trim(),
        password: form.password.trim(),
      });

      const token = res.data.token;
      if (token) {
        localStorage.setItem('authToken', token);
        setMessage('Login successful!');
        setMessageType('success');
        navigate('/users');
      } else {
        setMessage('Invalid credentials!');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Incorrect email or password.');
      setMessageType('error');
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 4, mt: 8 }}>
          <Typography variant="h5">Login</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField name="email" label="Email" fullWidth required value={form.email} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField name="password" label="Password" fullWidth required type="password" value={form.password} onChange={handleChange} sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" fullWidth>Login</Button>
            <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={() => setForgotOpen(true)}>
              Forgot Password?
            </Button>
            {message && (
              <Typography sx={{ mt: 2, color: messageType === 'success' ? 'green' : 'red' }}>{message}</Typography>
            )}
            <Typography align="center" sx={{ mt: 2 }}>
              Don't have an account? <Link to="/register">Register</Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </Grid>
  );
};

export default LoginPage;