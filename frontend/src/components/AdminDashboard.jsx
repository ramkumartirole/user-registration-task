import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box
} from '@mui/material';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    areaOfInterest: [],
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load users');
      }
    };
    fetchUsers();
  }, [token]);

  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      gender: user.gender || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      zip: user.zip || '',
      areaOfInterest: user.areaOfInterest || [],
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const updatedData = { ...formData };

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${editUser._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.map((u) => (u._id === editUser._id ? res.data : u)));
      handleClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - User Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Zip</TableCell>
              <TableCell>Interests</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender || '-'}</TableCell>
                  <TableCell>{user.city || '-'}</TableCell>
                  <TableCell>{user.state || '-'}</TableCell>
                  <TableCell>{user.country || '-'}</TableCell>
                  <TableCell>{user.zip || '-'}</TableCell>
                  <TableCell>
                    {user.areaOfInterest?.length > 0 ? (
                      user.areaOfInterest.map((interest, idx) => (
                        <Chip
                          key={idx}
                          label={interest}
                          size="small"
                          clickable={false}
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button color="primary" onClick={() => handleEditClick(user)}>
                      Edit
                    </Button>
                    <Button color="secondary" onClick={() => handleDelete(user._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Gender"
            fullWidth
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          />
          <TextField
            margin="dense"
            label="City"
            fullWidth
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
          <TextField
            margin="dense"
            label="State"
            fullWidth
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Country"
            fullWidth
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Zip"
            fullWidth
            value={formData.zip}
            onChange={(e) => handleChange('zip', e.target.value)}
          />

          <Typography sx={{ mt: 2, mb: 1 }}>Area of Interest</Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
            {formData.areaOfInterest?.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                onDelete={() => {
                  setFormData((prev) => ({
                    ...prev,
                    areaOfInterest: prev.areaOfInterest.filter((_, i) => i !== index),
                  }));
                }}
                color="primary"
              />
            ))}
          </Box>
          <TextField
            fullWidth
            placeholder="Add a new interest and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                e.preventDefault();
                const value = e.target.value.trim();
                if (!formData.areaOfInterest.includes(value)) {
                  setFormData((prev) => ({
                    ...prev,
                    areaOfInterest: [...(prev.areaOfInterest || []), value],
                  }));
                }
                e.target.value = '';
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
