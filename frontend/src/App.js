
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main/Main.jsx";
import Signup from "./components/Signup/Signup.jsx";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
 import RegistrationForm from "./components/RegistrationForm/RegistrationForm.jsx"
 

function App() {
	const user = localStorage.getItem("token");

	return (
    	<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<LoginForm />} />
			<Route path="*" element={<Navigate replace to="/login" />} />
      <Route path="/register" element={<RegistrationForm />} />
		</Routes>

	);
}

export default App;