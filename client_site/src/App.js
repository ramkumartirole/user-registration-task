import { ToastContainer } from 'react-toastify';
import './App.css';
import Signup from './components/auth/signup';
import Login from './components/auth/login';
import Dashboard from './dashboard';
import ResetPasswordPage from './components/auth/resetPassword';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
  <div className="p-4 text-black text-center">
     <ToastContainer/>
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
