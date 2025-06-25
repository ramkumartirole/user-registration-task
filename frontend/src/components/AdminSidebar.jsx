import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { purple, teal } from '@mui/material/colors';

const drawerWidth = 240;
const sidebarBg = '#02382e';

const AdminSidebar = ({ mobileOpen, handleDrawerToggle, handleLogout }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const getItemSx = (path) => ({
    color: '#fff',
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
    backgroundColor: location.pathname === path ? teal[700] : 'transparent',
    '&:hover': {
      backgroundColor: '#035c4d',
    },
  });

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: sidebarBg }}>
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/admin-dashboard'}
            onClick={() => navigate('/admin-dashboard')}
            sx={getItemSx('/admin-dashboard')}
          >
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/admin-users'}
            onClick={() => navigate('/admin-users')}
            sx={getItemSx('/admin-users')}
          >
            <ListItemIcon><PeopleAltIcon /></ListItemIcon>
            <ListItemText primary="Manage Users" />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      {/* Logout Button at Bottom */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            bgcolor: purple[700],
            color: '#fff',
            '&:hover': {
              bgcolor: purple[900],
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          display: { sm: 'none' },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: sidebarBg,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: sidebarBg,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AdminSidebar;
