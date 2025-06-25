import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
axios.defaults.baseURL = 'http://localhost:5001/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


