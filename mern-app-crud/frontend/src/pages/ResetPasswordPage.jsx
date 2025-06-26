// src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await axios.put('http://localhost:5001/api/auth/reset-password', {
        resetToken: token,
        newPassword,
        confirmPassword,
      });
      setMessage('Password reset successfully.');
    } catch (err) {
      setMessage('Failed to reset password. Token may be invalid or expired.');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, margin: 'auto', mt: 10 }}>
      <Typography variant="h6">Reset Your Password</Typography>
      <Box>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          sx={{ mt: 2 }}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          sx={{ mt: 2 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handleReset} fullWidth variant="contained" sx={{ mt: 2 }}>
          Reset Password
        </Button>
        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Paper>
  );
};

export default ResetPasswordPage;