import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import LoginForm from './components/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="*" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
