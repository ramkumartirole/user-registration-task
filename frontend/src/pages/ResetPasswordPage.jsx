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
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { purple, teal } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage({ text: 'Password reset successful! Redirecting...', type: 'success' });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage({ text: 'Failed to reset password. Try again.', type: 'error' });
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
          Reset Password
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ my: 2 }}>
            {message.text}
          </Alert>
        )}

        <TextField
          fullWidth
          label="New Password"
          required
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Reset Password
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

export default ResetPasswordPage;
