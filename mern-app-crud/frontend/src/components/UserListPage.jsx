import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Typography, Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import axios from 'axios';
import EditUserDialog from './EditUserDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import { useNavigate } from 'react-router-dom';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5001';

  const fetchUsers = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('Token from localStorage:', token);
      axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => setUsers(res.data))
        .catch(() => {
          setMessage('Error fetching users');
          setUsers([]);
        });
    } else {
      setMessage('Please log in to view users');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => setEditUser(user);
  const handleReset = (user) => setResetUser(user);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('authToken');
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
    }
  };

  const handleSaveEdit = async (updatedUser) => {
    const token = localStorage.getItem('authToken');
    await axios.put(`${API_URL}/api/users/${updatedUser._id}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setEditUser(null);
    fetchUsers();
  };

  const handleResetPassword = async (newPassword) => {
    // Add your password reset logic here
    setResetUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>User List</Typography>

      <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ mb: 2 }}>
        Logout
      </Button>

      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>
                  {user.profilePicture && (
                    <img
                      src={`${API_URL}/uploads/${user.profilePicture}`}
                      alt="Profile"
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%' }}
                    />
                  )}
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleReset(user)}><LockResetIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(user._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {message && (
        <Typography sx={{ mt: 2, color: 'red', fontWeight: 500 }}>
          {message}
        </Typography>
      )}

      {editUser && (
        <EditUserDialog
          open={!!editUser}
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSaveEdit}
        />
      )}

      {resetUser && (
        <ResetPasswordDialog
          open={!!resetUser}
          onClose={() => setResetUser(null)}
          onReset={handleResetPassword}
        />
      )}
    </Paper>
  );
};

export default UserListPage;