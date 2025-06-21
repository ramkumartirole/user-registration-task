import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';

const UserDashboard = () => {
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

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching user data:', err);
        setError('Session expired or invalid token. Please login again.');
        localStorage.removeItem('token');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditToggle = () => {
    setEditable(!editable);
    setFormData(userData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${userData._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(formData);
      setEditable(false);
    } catch (err) {
      console.error('❌ Error updating user:', err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box textAlign="center" mt={6}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 6 }}>{error}</Alert>;

  return (
    <Paper elevation={4} sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src={formData.profilePicture || ''}
          alt="Profile"
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        {editable && (
          <TextField
            label="Profile Picture URL"
            value={formData.profilePicture}
            onChange={(e) => handleChange('profilePicture', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        {editable ? (
          <>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              sx={{ mb: 1 }}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              sx={{ mb: 1 }}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
            />
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Welcome, {userData.firstName} {userData.lastName}
            </Typography>
            <Typography color="text.secondary">{userData.email}</Typography>
          </>
        )}
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Gender: {userData.gender}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Location
        </Typography>
        {editable ? (
          <>
            <TextField
              label="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              sx={{ mb: 1 }}
              fullWidth
            />
            <TextField
              label="State"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              sx={{ mb: 1 }}
              fullWidth
            />
            <TextField
              label="Country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              sx={{ mb: 1 }}
              fullWidth
            />
            <TextField
              label="Zip"
              value={formData.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              fullWidth
            />
          </>
        ) : (
          <Typography>
            {userData.city}, {userData.state}, {userData.country} — {userData.zip}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Area of Interest
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {userData.areaOfInterest?.length > 0 ? (
            userData.areaOfInterest.map((interest, idx) => (
              <Chip
                key={idx}
                label={interest}
                color="primary"
                variant="outlined"
                clickable={false} // ✅ Fix: Make sure chip is not interactive
              />
            ))
          ) : (
            <Typography>No interests selected</Typography>
          )}
        </Box>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Button variant="contained" onClick={handleEditToggle}>
          {editable ? 'Cancel' : 'Edit Profile'}
        </Button>
        {editable && (
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        )}
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Paper>
  );
};

export default UserDashboard;
