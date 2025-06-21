import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Password reset link sent!');
    } catch (err) {
      setMessage('Failed to send reset link.');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" onChange={(e) => setEmail(e.target.value)} margin="normal" />
        <Button type="submit" variant="contained" color="primary">Send Reset Link</Button>
      </form>
      {message && <Typography mt={2}>{message}</Typography>}
    </Box>
  );
};

export default ForgotPasswordPage;
