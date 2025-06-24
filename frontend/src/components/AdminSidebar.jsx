// src/components/AdminSidebar.jsx
import React from 'react';
import {
  Box, Toolbar, Divider, List, ListItem, ListItemButton, ListItemText, Drawer
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminSidebar = ({ mobileOpen, handleDrawerToggle, handleLogout }) => {
  const navigate = useNavigate();

  const drawer = (
    <div>
      <Toolbar>
        <ListItemText primary="Admin Panel" primaryTypographyProps={{ fontWeight: 'bold' }} />
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin-dashboard')}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin-users')}>
            <ListItemText primary="Manage Users" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Temporary Drawer (Mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Permanent Drawer (Desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;
