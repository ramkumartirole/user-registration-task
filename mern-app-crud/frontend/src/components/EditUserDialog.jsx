import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EditUserDialog = ({ open, onClose, user, onSave }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...user, ...form });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="First Name" name="firstName" value={form.firstName} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="City" name="city" value={form.city} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="State" name="state" value={form.state} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Zip" name="zip" value={form.zip} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Country" name="country" value={form.country} onChange={handleChange} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;