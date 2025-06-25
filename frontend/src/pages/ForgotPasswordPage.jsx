import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  Link
} from '@mui/material';
import axios from 'axios';
import { purple, teal } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateEmail(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      console.log('✅ Reset email sent:', res.data.message);
      setMessage({ text: 'Password reset link sent!', type: 'success' });
    } catch (err) {
      if (err.response?.status === 404 && err.response.data?.message === 'User not found') {
        console.warn('⚠️ Email not registered:', email);
        setMessage({ text: 'This email is not registered.', type: 'error' });
      } else {
        console.error('❌ Server error:', err.message);
        setMessage({ text: 'Server error. Please try again later.', type: 'error' });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#fff',
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          textAlign: 'center'
        }}
      >
        <Avatar
          sx={{
            bgcolor: teal[500],
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2
          }}
        >
          <PersonIcon sx={{ fontSize: 32 }} />
        </Avatar>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: purple[700] }}
        >
          Forgot Password
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ my: 2 }}>
            {message.text}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          required
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: purple[500]
              }
            }
          }}
        />

        <Button
          type="submit"
          fullWidth
          sx={{
            mt: 2,
            background: `linear-gradient(45deg, ${purple[500]}, ${teal[500]})`,
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              background: `linear-gradient(45deg, ${purple[700]}, ${teal[700]})`
            }
          }}
        >
          Send Reset Link
        </Button>

        <Typography variant="body2" sx={{ mt: 3 }}>
          <Link href="/login" underline="hover" sx={{ color: purple[600], fontWeight: 'bold' }}>
            Back to Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
