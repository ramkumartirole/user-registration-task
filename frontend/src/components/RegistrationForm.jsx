import React, { useState } from 'react';
import {
  TextField, Button, Checkbox, FormControlLabel, Typography, Box,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, Paper, Divider, Link
} from '@mui/material';
import axios from 'axios';
import { teal, purple } from '@mui/material/colors';
import { Link as RouterLink } from 'react-router-dom';

const RegistrationForm = () => {
  const initialFormData = {
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    gender: '', city: '', state: '', zip: '', country: '',
    areaOfInterest: [], profilePicture: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const interests = ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Data Science', 'Cybersecurity'];

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: purple[500] }
    }
  };

  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleInterestChange = (interest) => {
    const updated = formData.areaOfInterest.includes(interest)
      ? formData.areaOfInterest.filter(i => i !== interest)
      : [...formData.areaOfInterest, interest];
    setFormData({ ...formData, areaOfInterest: updated });
  };

  const showToast = (message, severity = 'info') => setToast({ open: true, message, severity });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword)
      return setError('Passwords do not match');
    if (!formData.gender)
      return setError('Please select a gender');
    setError('');

    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      await axios.post('http://localhost:5000/api/auth/register', payload);
      showToast('Registration successful', 'success');
      setFormData(initialFormData);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error during registration.';
      if (msg.toLowerCase().includes('already been registered')) {
        showToast(msg, 'warning');
      } else {
        showToast(msg, 'error');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, background: 'linear-gradient(90deg, #667eea, #764ba2)' }}>
      <Paper elevation={4} sx={{ maxWidth: 600, mx: 'auto', p: 4, bgcolor: 'white', borderRadius: 3 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: purple[800], mb: 3 }}>
          Register User
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="First Name" fullWidth size="small" required value={formData.firstName} onChange={handleChange('firstName')} sx={inputStyles} />
            <TextField label="Last Name" fullWidth size="small" required value={formData.lastName} onChange={handleChange('lastName')} sx={inputStyles} />
          </Box>
          <TextField label="Email" type="email" fullWidth size="small" required value={formData.email} onChange={handleChange('email')} sx={inputStyles} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Password" type="password" fullWidth size="small" required value={formData.password} onChange={handleChange('password')} sx={inputStyles} />
            <TextField
              label="Confirm Password" type="password" fullWidth size="small" required value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')} error={!!error.includes('Passwords')} helperText={error.includes('Passwords') ? error : ''}
              sx={inputStyles}
            />
          </Box>
          <FormControl fullWidth required size="small" error={!!error.includes('gender')} sx={inputStyles}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select labelId="gender-label" label="Gender" value={formData.gender} onChange={handleChange('gender')}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {error.includes('gender') && <Typography variant="caption" color="error">{error}</Typography>}
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="City" fullWidth size="small" required value={formData.city} onChange={handleChange('city')} sx={inputStyles} />
            <TextField label="State" fullWidth size="small" required value={formData.state} onChange={handleChange('state')} sx={inputStyles} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Zip Code" fullWidth size="small" required value={formData.zip} onChange={handleChange('zip')} sx={inputStyles} />
            <TextField label="Country" fullWidth size="small" required value={formData.country} onChange={handleChange('country')} sx={inputStyles} />
          </Box>
          <TextField label="Profile Picture URL" fullWidth size="small" value={formData.profilePicture} onChange={handleChange('profilePicture')} sx={inputStyles} />
          <Divider sx={{ my: 2, borderColor: teal[200] }} />
          <Typography variant="subtitle1" sx={{ color: purple[700] }}>Area of Interest</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {interests.map((int) => (
              <FormControlLabel
                key={int}
                control={<Checkbox checked={formData.areaOfInterest.includes(int)} onChange={() => handleInterestChange(int)} sx={{ color: purple[500], '&.Mui-checked': { color: teal[500] } }} />}
                label={int} sx={{ color: purple[700] }}
              />
            ))}
          </Box>
          <Button type="submit" variant="contained" sx={{
            mt: 3,
            background: `linear-gradient(45deg, ${purple[500]}, ${teal[500]})`,
            '&:hover': { background: `linear-gradient(45deg, ${purple[700]}, ${teal[700]})` },
            fontWeight: 'bold'
          }}>
            Register
          </Button>
        </Box>

        {/* ✅ Already have account section */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: purple[600], fontWeight: 600 }}>
              Login 
            </Link>
          </Typography>
        </Box>

        <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} sx={{
            width: '100%',
            color: 'white',
            bgcolor:
              toast.severity === 'success' ? teal[500] :
              toast.severity === 'error' ? 'error.main' :
              toast.severity === 'warning' ? 'warning.main' : 'info.main'
          }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default RegistrationForm;
