import React from 'react';
import { Button } from '@mui/material';

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return (
    <Button color="secondary" variant="outlined" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;