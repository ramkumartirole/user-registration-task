import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
// import { useParams } from 'react-router-dom';
// import ResetPassword from "../ForgotPassword/ResetPassword";
// // ✅ get token from /reset-password/:token



const LoginForm = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [showForgotPopup, setShowForgotPopup] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const [resetMessage, setResetMessage] = useState("");
	const [fallbackLink, setFallbackLink] = useState("");

	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleClick = () => {
		navigate("/register");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	const handleForgotPassword = async () => {
		try {
			const response = await axios.post("http://localhost:8080/api/auth/forgot-password", {
				email: forgotEmail,
			});
			setResetMessage(response.data.message);
			if (response.data.resetLink) {
				setFallbackLink(response.data.resetLink);
			}
		} catch (err) {
			setResetMessage("Something went wrong.");
		}
	};
	

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>

						<div style={{ marginTop: "8px" }}>
							<span
								style={{ color: "#3498db", cursor: "pointer", fontSize: "14px" }}
								 onClick={() => setShowForgotPopup(true)}
								// onClick = {(handleReset)}
							>
								Forgot Password?
							</span>
						</div>

						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign In
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn} onClick={handleClick}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>

			{/* Forgot Password Popup */}
			{showForgotPopup && (
				<div className={styles.popup}>
					<div className={styles.popup_content}>
						<h3>Reset Password</h3>
						
							
						<input
							type="email"
							placeholder="Enter your registered email"
							value={forgotEmail}
							onChange={(e) => setForgotEmail(e.target.value)}
							className={styles.input}
						/>
						<button className={styles.green_btn} onClick={handleForgotPassword}>
							Send Reset Link
						</button>
						<button className={styles.white_btn} onClick={() => setShowForgotPopup(false)}>
							Close
						</button>

						{resetMessage && <p style={{ marginTop: "10px" }}>{resetMessage}</p>}

						{fallbackLink && (
							<p style={{ marginTop: "10px" }}>
								Email not working?{" "}
								<a href={fallbackLink} target="_blank" rel="noopener noreferrer">
									Click here to reset manually
								</a>
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default LoginForm;




