import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const ResetPasswordDialog = ({ open, onClose, onReset }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = () => {
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    onReset(password);
    setPassword('');
    setConfirm('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleReset} variant="contained">Reset</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;