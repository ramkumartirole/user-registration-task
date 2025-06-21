import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage('Password reset successful!');
    } catch (err) {
      setMessage('Failed to reset password.');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth type="password" label="New Password" onChange={(e) => setPassword(e.target.value)} margin="normal" />
        <Button type="submit" variant="contained" color="primary">Reset Password</Button>
      </form>
      {message && <Typography mt={2}>{message}</Typography>}
    </Box>
  );
};

export default ResetPasswordPage;
