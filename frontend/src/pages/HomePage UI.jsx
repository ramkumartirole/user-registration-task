import React, { useState } from 'react';
import { Button, Typography, Box, Grid, Fade, Slide } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';

const FullHeightContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '0',
  margin: '0',
  width: '100%',
  overflow: 'hidden',
});

const ContentCard = styled(Box)({
  width: '100%',
  maxWidth: '500px',
  padding: '2.5rem',
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
  margin: '0 1rem',
});

const RoleButton = styled(Button)({
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: '600',
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  margin: '0.5rem 0',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
});

const OptionsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

const HomePage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  return (
    <FullHeightContainer>
      <ContentCard>
        <Fade in={true} timeout={800}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GroupIcon sx={{ 
              fontSize: 60, 
              color: '#4f46e5', 
              mb: 1,
              background: 'rgba(79, 70, 229, 0.1)',
              borderRadius: '50%',
              padding: '10px'
            }} />
            
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: '700', 
                mb: 3,
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              User Management
            </Typography>

            {!role && (
              <Slide direction="up" in={!role} mountOnEnter unmountOnExit>
                <OptionsContainer>
                  <Typography variant="subtitle1" sx={{ mb: 3, color: '#555' }}>
                    Select your role to continue
                  </Typography>
                  <RoleButton
                    fullWidth
                    variant="contained"
                    startIcon={<GroupIcon />}
                    onClick={() => setRole('user')}
                    sx={{
                      bgcolor: '#4f46e5',
                      '&:hover': { bgcolor: '#4338ca' },
                      maxWidth: '400px'
                    }}
                  >
                    Continue as User
                  </RoleButton>
                  <RoleButton
                    fullWidth
                    variant="contained"
                    startIcon={<AdminPanelSettingsIcon />}
                    onClick={() => setRole('admin')}
                    sx={{
                      bgcolor: '#7c3aed',
                      '&:hover': { bgcolor: '#6d28d9' },
                      maxWidth: '400px'
                    }}
                  >
                    Continue as Admin
                  </RoleButton>
                </OptionsContainer>
              </Slide>
            )}

            {/* User options */}
            {role === 'user' && (
              <Slide direction="up" in={role === 'user'} mountOnEnter unmountOnExit>
                <OptionsContainer>
                  <Typography variant="h5" sx={{ mb: 3, color: '#4f46e5' }}>
                    User Options
                  </Typography>
                  <RoleButton
                    fullWidth
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: '#4f46e5',
                      '&:hover': { bgcolor: '#4338ca' },
                      maxWidth: '400px'
                    }}
                  >
                    Register New Account
                  </RoleButton>
                  <RoleButton
                    fullWidth
                    variant="outlined"
                    startIcon={<LoginIcon />}
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#4f46e5',
                      borderColor: '#4f46e5',
                      '&:hover': { 
                        bgcolor: '#eef2ff',
                        borderColor: '#4f46e5'
                      },
                      maxWidth: '400px'
                    }}
                  >
                    Login to Existing Account
                  </RoleButton>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => setRole(null)}
                    sx={{ 
                      color: '#6b7280', 
                      mt: 1,
                      maxWidth: '400px'
                    }}
                  >
                    ← Back to Role Selection
                  </Button>
                </OptionsContainer>
              </Slide>
            )}

            {/* Admin option */}
            {role === 'admin' && (
              <Slide direction="up" in={role === 'admin'} mountOnEnter unmountOnExit>
                <OptionsContainer>
                  <Typography variant="h5" sx={{ mb: 3, color: '#7c3aed' }}>
                    Admin Portal
                  </Typography>
                  <RoleButton
                    fullWidth
                    variant="contained"
                    startIcon={<AdminPanelSettingsIcon />}
                    onClick={() => navigate('/admin-login')}
                    sx={{
                      bgcolor: '#7c3aed',
                      '&:hover': { bgcolor: '#6d28d9' },
                      maxWidth: '400px'
                    }}
                  >
                    Admin Login
                  </RoleButton>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => setRole(null)}
                    sx={{ 
                      color: '#6b7280',
                      maxWidth: '400px'
                    }}
                  >
                    ← Back to Role Selection
                  </Button>
                </OptionsContainer>
              </Slide>
            )}
          </Box>
        </Fade>
      </ContentCard>
    </FullHeightContainer>
  );
};

export default HomePage;