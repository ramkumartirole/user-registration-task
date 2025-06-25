import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Grid, Paper, Typography, MenuItem, Checkbox,
  FormControlLabel, Radio, RadioGroup, FormLabel, FormGroup, Box, Divider, Container
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const interests = ['Reading', 'Writing', 'Traveling', 'Playing'];

const RegistrationForm = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', gender: '', email: '',
    password: '', confirmPassword: '', city: '', state: '',
    zip: '', country: '', areaOfInterest: [], profilePicture: null
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/countries').then(res => setCountries(res.data));
  }, []);

  useEffect(() => {
    if (form.country) {
      axios.get(`/states?country=${form.country}`).then(res => setStates(res.data));
    } else {
      setStates([]);
    }
  }, [form.country]);

  const handleChange = (e) => {
    const { name, value, checked, files } = e.target;
    if (name === 'areaOfInterest') {
      setForm((prev) => ({
        ...prev,
        areaOfInterest: checked
          ? [...prev.areaOfInterest, value]
          : prev.areaOfInterest.filter((i) => i !== value)
      }));
    } else if (name === 'profilePicture') {
      setForm((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('firstName', form.firstName);
  formData.append('lastName', form.lastName);
  formData.append('email', form.email);
  formData.append('password', form.password);
  formData.append('confirmPassword', form.confirmPassword);
  formData.append('city', form.city);
  formData.append('state', form.state);
  formData.append('zip', form.zip);
  formData.append('country', form.country);
  formData.append('gender', form.gender);
  form.areaOfInterest.forEach((interest) => formData.append('areaOfInterest', interest));
  if (form.profilePicture) {
    formData.append('profilePicture', form.profilePicture);
  }

  try {
    const response = await axios.post('http://localhost:5001/api/auth/register', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

setMessage('User registered successfully!');
setTimeout(() => {
  navigate('/login');
}, 2000); // Redirects after 2 seconds so user can see the success message
    console.log(response.data);
    setMessage('User registered successfully!');
  } catch (error) {
    console.error(error);
    setMessage('Error creating user');
  }
};

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, width: '100%' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
          Create Your Account
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }} align="center">
          Please fill in the form below to register.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend" sx={{ mb: 1 }}>Gender</FormLabel>
              <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} fullWidth required />
            </Grid>
            {/* Country and State on their own rows */}
            <Grid item xs={12}>
              <TextField
                select
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                fullWidth
                required
              >
                {countries.length === 0 ? (
                  <MenuItem disabled>No countries</MenuItem>
                ) : (
                  countries.map((c) => (
                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                fullWidth
                required
              >
                {states.length === 0 ? (
                  <MenuItem disabled>No states</MenuItem>
                ) : (
                  states.map((s) => (
                    <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Zip Code" name="zip" value={form.zip} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend" sx={{ mb: 1 }}>Area of Interest</FormLabel>
              <FormGroup row>
                {interests.map((interest) => (
                  <FormControlLabel
                    key={interest}
                    control={
                      <Checkbox
                        checked={form.areaOfInterest.includes(interest)}
                        onChange={handleChange}
                        name="areaOfInterest"
                        value={interest}
                      />
                    }
                    label={interest}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
                Upload Profile Picture
                <input type="file" name="profilePicture" hidden onChange={handleChange} accept="image/*" />
              </Button>
              {form.profilePicture && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {form.profilePicture.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" fullWidth size="large">
                Register
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="text"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => navigate('/login')}
              >
                Already have an account? Login
              </Button>
            </Grid>
            {message && (
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography color={message.includes('successful') ? 'success.main' : 'error.main'}>
                  {message}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistrationForm;