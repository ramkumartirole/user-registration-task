import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Chip, Box, Toolbar, CssBaseline, AppBar, IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import AdminSidebar from '../components/AdminSidebar';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', gender: '', city: '',
    state: '', country: '', zip: '', areaOfInterest: [],
  });

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminName(res.data.name || 'Admin');
      } catch (err) {
        enqueueSnackbar('Failed to load admin profile', { variant: 'error' });
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        enqueueSnackbar('Failed to load users', { variant: 'error' });
      }
    };

    if (token) {
      fetchAdminName();
      fetchUsers();
    } else {
      navigate('/admin-login');
    }
  }, [token, navigate, enqueueSnackbar]);

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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u._id === editUser._id ? res.data : u)));
      enqueueSnackbar('User updated successfully', { variant: 'success' });
      handleClose();
    } catch (err) {
      enqueueSnackbar('Failed to update user', { variant: 'error' });
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
      enqueueSnackbar('User deleted', { variant: 'info' });
    } catch (err) {
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    }
  };

  const handleOpenResetDialog = (userId) => {
    setSelectedUserId(userId);
    setNewPassword('');
    setResetDialogOpen(true);
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
    setSelectedUserId(null);
    setNewPassword('');
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      enqueueSnackbar('Password must be at least 6 characters long.', { variant: 'warning' });
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/users/${selectedUserId}/reset-password`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handleCloseResetDialog();
      setTimeout(() => {
        enqueueSnackbar('Password reset successfully', { variant: 'success' });
      }, 300);
    } catch (err) {
      setTimeout(() => {
        enqueueSnackbar('Failed to reset password', { variant: 'error' });
      }, 300);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Dashboard - User Management
          </Typography>
        </Toolbar>
      </AppBar>

      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          Welcome, {adminName}
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
                      <Button color="warning" onClick={() => handleOpenResetDialog(user._id)}>
                        Reset Password
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
            {['firstName', 'lastName', 'email', 'gender', 'city', 'state', 'country', 'zip'].map((field) => (
              <TextField
                key={field}
                margin="dense"
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                fullWidth
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            ))}
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

        {/* Reset Password Dialog */}
        <Dialog open={resetDialogOpen} onClose={handleCloseResetDialog}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResetDialog}>Cancel</Button>
            <Button
              onClick={handleResetPassword}
              color="warning"
              variant="contained"
              disabled={!newPassword}
            >
              Reset
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
