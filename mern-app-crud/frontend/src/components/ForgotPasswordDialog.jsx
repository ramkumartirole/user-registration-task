import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setResetToken(res.data.resetToken);
      setStep(2);
      setMessage('');
    } catch (err) {
      setMessage('User not found');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.put('/auth/reset-password', { resetToken, newPassword, confirmPassword });
      setMessage('Password Reset Successfully');
      setStep(3);
    } catch (err) {
      setMessage('Error resetting password');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        {step === 1 && (
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
            {message && <Typography color="error">{message}</Typography>}
          </>
        )}
        {step === 2 && (
          <>
            <Typography>Enter your new password:</Typography>
            <TextField
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {message && <Typography color="error">{message}</Typography>}
          </>
        )}
        {step === 3 && (
          <Typography color="primary">{message}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {step === 1 && <Button onClick={handleSendEmail} variant="contained">Send</Button>}
        {step === 2 && <Button onClick={handleResetPassword} variant="contained">Reset</Button>}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordDialog;