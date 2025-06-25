import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Chip, Stack, IconButton, Tooltip, Avatar,
  InputAdornment, Grid, useTheme, Autocomplete
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, LockReset as ResetIcon,
  Search as SearchIcon, Close as CloseIcon, Check as CheckIcon
} from '@mui/icons-material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import { deepPurple, indigo, teal } from '@mui/material/colors';

const drawerWidth = 240;

const ManageUsers = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteUserId, setSelectedDeleteUserId] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch {
      enqueueSnackbar('Failed to load users', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (!token) return navigate('/admin-login');
    fetchUsers();
  }, [token]);

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({
      firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '',
      gender: user.gender || '', city: user.city || '', state: user.state || '',
      country: user.country || '', zip: user.zip || '',
      areaOfInterest: user.areaOfInterest || [], profilePic: user.profilePic || ''
    });
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/users/${editUser._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers((prev) => prev.map((u) => (u._id === data._id ? data : u)));
      enqueueSnackbar('User updated successfully', { variant: 'success' });
      setEditUser(null);
    } catch {
      enqueueSnackbar('Failed to update user', { variant: 'error' });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6)
      return enqueueSnackbar('Password must be at least 6 characters', { variant: 'warning' });

    try {
      await axios.put(`http://localhost:5000/api/users/${selectedUserId}/reset-password`, { password: newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      enqueueSnackbar('Password reset successfully', { variant: 'success' });
      setResetDialogOpen(false);
      setNewPassword('');
    } catch {
      enqueueSnackbar('Password reset failed', { variant: 'error' });
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${selectedDeleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers((prev) => prev.filter((u) => u._id !== selectedDeleteUserId));
      enqueueSnackbar('User deleted', { variant: 'info' });
    } catch {
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeleteUserId(null);
    }
  };

  const getInitials = (f = '', l = '') => `${f[0] || ''}${l[0] || ''}`.toUpperCase();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        handleLogout={() => {
          localStorage.removeItem('token');
          navigate('/admin-login');
        }}
      />

      <Box component="main" sx={{ flexGrow: 1, ml: { sm: `${drawerWidth}px` }, p: 4 }}>
        <Typography variant="h4" sx={{
          fontWeight: 700, mb: 2,
          background: `linear-gradient(45deg, ${deepPurple[700]}, ${indigo[500]})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          User Management
        </Typography>

        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              endAdornment: searchTerm && (
                <IconButton onClick={() => setSearchTerm('')}><CloseIcon fontSize="small" /></IconButton>
              )
            }}
            sx={{ width: 300 }}
          />
          <Typography variant="subtitle2" color="textSecondary">{filteredUsers.length} found</Typography>
        </Paper>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f7ff' }}>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Interests</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id} hover sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={user.profilePic || ''}
                            sx={{
                              bgcolor: deepPurple[500], mr: 2, fontSize: 14,
                              width: 40, height: 40
                            }}
                          >
                            {!user.profilePic && getInitials(user.firstName, user.lastName)}
                          </Avatar>
                          <Box>
                            <Typography>{user.firstName} {user.lastName}</Typography>
                            <Typography variant="caption" color="textSecondary">{user.gender}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.city}, {user.state}<br />{user.country} {user.zip}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {user.areaOfInterest?.map((int, i) => (
                            <Chip key={i} label={int} size="small" />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => handleEditClick(user)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => {
                              setSelectedDeleteUserId(user._id);
                              setDeleteDialogOpen(true);
                            }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reset Password">
                            <IconButton size="small" color="warning" onClick={() => {
                              setSelectedUserId(user._id);
                              setResetDialogOpen(true);
                            }}>
                              <ResetIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography>No users found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>

        {/* Edit Dialog */}
        <Dialog open={!!editUser} onClose={() => setEditUser(null)} fullWidth maxWidth="sm" scroll="paper">
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent dividers sx={{ maxHeight: '70vh' }}>
            <Grid container spacing={2}>
              {['firstName', 'lastName', 'email', 'gender', 'city', 'state', 'country', 'zip'].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    fullWidth size="small" label={field}
                    value={formData[field] || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={formData.areaOfInterest}
                  onChange={(_, newValue) => setFormData({ ...formData, areaOfInterest: newValue })}
                  renderInput={(params) => (
                    <TextField {...params} label="Area of Interests" size="small" />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Profile Picture URL"
                  fullWidth
                  size="small"
                  value={formData.profilePic || ''}
                  onChange={(e) => setFormData({ ...formData, profilePic: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)} startIcon={<CloseIcon />}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" startIcon={<CheckIcon />}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth label="New Password" type="password" size="small" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{ endAdornment: <InputAdornment position="end"><LockResetIcon /></InputAdornment> }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)} startIcon={<CloseIcon />}>Cancel</Button>
            <Button onClick={handleResetPassword} variant="contained" startIcon={<CheckIcon />}>Reset</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} startIcon={<CloseIcon />}>Cancel</Button>
            <Button onClick={handleDeleteConfirmed} variant="contained" color="error" startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageUsers;
