import React from "react";
import { useState } from "react";
import "./style.css"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "react-bootstrap"


function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   navigate("/register");
  // };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!formData.email || !formData.password) {
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/user-list'); // Redirect to user dashboard or list
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
 <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className={`form-control ${validated && !formData.email ? 'is-invalid' : ''}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Email is required</div>
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className={`form-control ${validated && !formData.password ? 'is-invalid' : ''}`}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Password is required</div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        <p className="mt-3 text-center">
          Don't have an account? <a href="/register">Register</a>
        </p>
        <p className="text-center">
          <a href="#" onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
