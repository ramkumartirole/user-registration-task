import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = login, 2 = OTP
  const [error, setError] = useState('');

  // Step 1: Verify email/password and send OTP
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
        setStep(2); // Proceed to OTP input
        setError('');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Try again later.');
    }
  };

  // Step 2: Verify OTP and get JWT
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#fff',
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>

        {step === 1 ? (
          <form onSubmit={handleAdminLogin}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
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
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
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
