import React, { useState } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const RegistrationForm = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    areaOfInterest: [],
    profilePicture: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const [interests] = useState([
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'Data Science',
    'Cybersecurity'
  ]);

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleInterestChange = (interest) => {
    const updated = formData.areaOfInterest.includes(interest)
      ? formData.areaOfInterest.filter(item => item !== interest)
      : [...formData.areaOfInterest, interest];
    setFormData({ ...formData, areaOfInterest: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.gender) {
      setError('Please select a gender');
      return;
    }

    setError('');

    try {
      const payload = { ...formData };
      delete payload.confirmPassword;

      await axios.post('http://localhost:5000/api/register', payload);
      showToast('Registration successful', 'success');
      setFormData(initialFormData);
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      if (errorMessage && errorMessage.includes('User already exists')) {
        showToast('This email has already been registered.', 'warning');
      } else {
        showToast('Error during registration. Please try again.', 'error');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Register User</Typography>

      <TextField label="First Name" fullWidth required margin="normal"
        value={formData.firstName}
        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
      />
      <TextField label="Last Name" fullWidth required margin="normal"
        value={formData.lastName}
        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
      />
      <TextField label="Email" type="email" fullWidth required margin="normal"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
      />
      <TextField label="Password" type="password" fullWidth required margin="normal"
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
      />
      <TextField label="Confirm Password" type="password" fullWidth required margin="normal"
        value={formData.confirmPassword}
        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
        error={!!error && error.includes('Passwords')}
        helperText={error.includes('Passwords') ? error : ''}
      />

      <FormControl fullWidth required margin="normal" error={!!error && error.includes('gender')}>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          value={formData.gender}
          label="Gender"
          onChange={e => setFormData({ ...formData, gender: e.target.value })}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        {error.includes('gender') && (
          <Typography variant="caption" color="error">{error}</Typography>
        )}
      </FormControl>

      <TextField label="City" fullWidth required margin="normal"
        value={formData.city}
        onChange={e => setFormData({ ...formData, city: e.target.value })}
      />
      <TextField label="State" fullWidth required margin="normal"
        value={formData.state}
        onChange={e => setFormData({ ...formData, state: e.target.value })}
      />
      <TextField label="Zip Code" fullWidth required margin="normal"
        value={formData.zip}
        onChange={e => setFormData({ ...formData, zip: e.target.value })}
      />
      <TextField label="Country" fullWidth required margin="normal"
        value={formData.country}
        onChange={e => setFormData({ ...formData, country: e.target.value })}
      />
      <TextField label="Profile Picture URL" fullWidth margin="normal"
        value={formData.profilePicture}
        onChange={e => setFormData({ ...formData, profilePicture: e.target.value })}
      />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>Area of Interest</Typography>
      {interests.map(interest => (
        <FormControlLabel
          key={interest}
          control={
            <Checkbox
              checked={formData.areaOfInterest.includes(interest)}
              onChange={() => handleInterestChange(interest)}
            />
          }
          label={interest}
        />
      ))}

      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">Register</Button>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegistrationForm;
