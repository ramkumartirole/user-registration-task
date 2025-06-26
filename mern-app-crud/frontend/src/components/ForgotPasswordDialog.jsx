// src/components/ForgotPasswordDialog.jsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendEmail = async () => {
    try {
      await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      setSuccess(true);
      setMessage('Password reset link sent. Please check your email.');
    } catch (err) {
      setMessage('User not found or error sending email.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        {!success ? (
          <>
            <Typography>Enter your registered email address:</Typography>
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </>
        ) : (
          <Typography color="primary">{message}</Typography>
        )}
        {message && !success && <Typography color="error">{message}</Typography>}
      </DialogContent>
      <DialogActions>
        {!success && <Button onClick={handleSendEmail} variant="contained">Send</Button>}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordDialog;