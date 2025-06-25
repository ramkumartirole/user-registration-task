import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Avatar,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { purple, teal } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData); 

      localStorage.setItem('token', response.data.token);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      setSuccess('Login successful');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: purple[500]
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
          sx={{ fontWeight: 'bold', color: purple[700], mb: 2 }}
        >
          User Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          sx={inputStyles}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          sx={inputStyles}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{
                color: purple[500],
                '&.Mui-checked': {
                  color: teal[500]
                }
              }}
            />
          }
          label="Remember me"
          sx={{ mt: 1, mb: 1 }}
        />

        <Box textAlign="right" mt={1}>
          <Link href="/forgot-password" variant="body2" underline="hover">
            Forgot Password?
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          sx={{
            mt: 3,
            background: `linear-gradient(45deg, ${purple[500]}, ${teal[500]})`,
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              background: `linear-gradient(45deg, ${purple[700]}, ${teal[700]})`
            }
          }}
        >
          Login
        </Button>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Don’t have an account?{' '}
          <Link href="/register" underline="hover" sx={{ color: purple[600], fontWeight: 'bold' }}>
            Please register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default UserLogin;
