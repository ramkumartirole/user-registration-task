import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// import './Form.css';

const ResetPassword = () => {
  const { token } = useParams(); // ✅ Get token from URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button type="submit">Reset</button>
    </form>
  );
};

export default ResetPassword;
