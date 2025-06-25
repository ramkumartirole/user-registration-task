import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import HomePage from './pages/HomePage';
import RegistrationForm from './components/RegistrationForm';
import LoginPage from './pages/UserLogin';
import UserListPage from './components/UserList';
import UserDashboard from './components/UserDashboard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLogin from './pages/AdminLogin';
import './index.css';


import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';

function App() {
  return (
    

    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* ✅ Admin routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<ManageUsers />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
