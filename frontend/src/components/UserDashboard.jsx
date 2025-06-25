import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Avatar, Button, Chip, Divider, CircularProgress,
  Alert, TextField, useTheme, Grid, InputAdornment, Paper
} from '@mui/material';
import {
  Edit, Save, Cancel, Logout, Person, LocationOn, Interests, Link as LinkIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      try {
        const { data } = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(data);
        setFormData(data);
      } catch {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${userData._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(formData);
      setEditable(false);
    } catch {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, field, type = 'text', half = false }) => (
    <Grid item xs={12} md={half ? 6 : 12}>
      <TextField
        label={label}
        value={formData[field] || ''}
        onChange={handleChange(field)}
        fullWidth
        type={type}
        InputProps={label === 'Profile Picture URL' ? {
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon />
            </InputAdornment>
          )
        } : {}}
      />
    </Grid>
  );

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>{error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      {/* Header with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg,rgb(1, 86, 44), #673ab7,rgb(7, 55, 96))',
          color: 'white',
          py: 6,
          px: 4,
          textAlign: 'center'
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            variant="square"
            src={formData.profilePicture}
            sx={{
              width: 140,
              height: 140,
              border: '4px solid white',
              boxShadow: 4,
              borderRadius: 2
            }}
          />
          {editable ? (
            <Grid container spacing={2} maxWidth="600px">
              <Field label="Profile Picture URL" field="profilePicture" />
              <Field label="First Name" field="firstName" half />
              <Field label="Last Name" field="lastName" half />
            </Grid>
          ) : (
            <>
              <Typography variant="h4" fontWeight={600}>
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography variant="subtitle1">{userData.email}</Typography>
            </>
          )}
        </Box>
      </Box>

      {/* Main Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: '1100px', mx: 'auto' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            {/* Personal Info */}
            <Box mb={5}>
              <Typography variant="h6" gutterBottom><Person fontSize="small" /> Personal Information</Typography>
              <Grid container spacing={2}>
                {editable ? (
                  <Field label="Email" field="email" half />
                ) : (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Email:</strong> {userData.email}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Gender:</strong> {userData.gender}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            {/* Location */}
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" gutterBottom><LocationOn fontSize="small" /> Location</Typography>
              {editable ? (
                <Grid container spacing={2}>
                  <Field label="City" field="city" half />
                  <Field label="State" field="state" half />
                  <Field label="Country" field="country" half />
                  <Field label="Zip Code" field="zip" half />
                </Grid>
              ) : (
                <Typography>
                  {userData.city}, {userData.state}, {userData.country} — {userData.zip}
                </Typography>
              )}
            </Box>

            {/* Area of Interest */}
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" gutterBottom><Interests fontSize="small" /> Area of Interest</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {userData.areaOfInterest?.length ? userData.areaOfInterest.map((tag, i) => (
                  <Chip key={i} label={tag} color="primary" />
                )) : (
                  <Typography color="text.secondary">No interests selected</Typography>
                )}
              </Box>
            </Box>

            {/* Buttons */}
            <Box mt={6} display="flex" justifyContent="flex-end" gap={2}>
              {editable ? (
                <>
                  <Button variant="outlined" startIcon={<Cancel />} onClick={() => setEditable(false)} color="error">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                      background: 'linear-gradient(135deg,rgb(2, 44, 24), #673ab7)',
                      '&:hover': {
                        background: 'linear-gradient(135deg,rgb(10, 72, 40), #512da8)'
                      }
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outlined" startIcon={<Logout />} onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }} color="error">
                    Logout
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditable(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #0f9d58, #673ab7)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0b8043, #512da8)'
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Box>
  );
};

export default UserDashboard;
