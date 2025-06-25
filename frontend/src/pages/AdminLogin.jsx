import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Box, FormControlLabel, Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { teal, purple } from '@mui/material/colors';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('adminEmail');
    const rememberedPassword = localStorage.getItem('adminPassword');
    if (rememberedEmail && rememberedPassword) {
      setAdminEmail(rememberedEmail);
      setAdminPassword(rememberedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('adminEmail', adminEmail);
          localStorage.setItem('adminPassword', adminPassword);
        } else {
          localStorage.removeItem('adminEmail');
          localStorage.removeItem('adminPassword');
        }

        setStep(2);
        setError('');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Try again later.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Try again later.');
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: purple[500] },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#fff',
          p: 4,
          boxShadow: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: purple[700], textAlign: 'center', mb: 2 }}
        >
          Admin Login
        </Typography>

        {step === 1 ? (
          <form onSubmit={handleAdminLogin}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              sx={inputStyles}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              sx={inputStyles}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember Me"
              sx={{ mt: 1 }}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                background: `linear-gradient(45deg, ${purple[500]}, ${teal[500]})`,
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  background: `linear-gradient(45deg, ${purple[700]}, ${teal[700]})`,
                },
              }}
            >
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <TextField
              label="Enter OTP"
              fullWidth
              margin="normal"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={inputStyles}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                background: `linear-gradient(45deg, ${purple[500]}, ${teal[500]})`,
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  background: `linear-gradient(45deg, ${purple[700]}, ${teal[700]})`,
                },
              }}
            >
              Verify OTP
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default AdminLogin;
