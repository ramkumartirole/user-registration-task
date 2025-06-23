import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); 

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the User Management App
      </Typography>

      {!role && (
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => setRole('user')}>
            I'm a User
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setRole('admin')}>
            I'm an Admin
          </Button>
        </Box>
      )}

      {/* User options */}
      {role === 'user' && (
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
            Register
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="text" color="error" onClick={() => setRole(null)}>
            Go Back
          </Button>
        </Box>
      )}

      {/* Admin option */}
      {role === 'admin' && (
        <Box display="flex" gap={2}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/admin-login')}>
            Admin Login
          </Button>
          <Button variant="text" color="error" onClick={() => setRole(null)}>
            Go Back
          </Button>
        </Box>
      )}
    </Box>
  );
};


export default HomePage;
