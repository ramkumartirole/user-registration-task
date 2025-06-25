import { useState } from "react";
// axios to POST the data
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		city: "",
		state: "",
		zip: "",
		country: "",
		areaOfInterest: [],
		profilePicture: null,
	});
	const [countries] = useState(["India", "United States", "Canada"]);
	const [states, setStates] = useState([]);
	const [cities, setCities] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Fetch states
	const fetchStates = (country) => {
		fetch("https://countriesnow.space/api/v0.1/countries/states", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ country }),
		})
			.then((res) => res.json())
			.then((data) => {
				const stateList = data.data.states.map((s) => s.name);
				setStates(stateList);
				setCities([]);
				setFormData((prev) => ({ ...prev, state: "", city: "" }));
			});
	};

	// Fetch cities
	const fetchCities = (country, state) => {
		fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ country, state }),
		})
			.then((res) => res.json())
			.then((data) => {
				setCities(data.data || []);
				setFormData((prev) => ({ ...prev, city: "" }));
			});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCountryChange = (e) => {
		const country = e.target.value;
		setFormData((prev) => ({ ...prev, country }));
		fetchStates(country);
	};

	const handleStateChange = (e) => {
		const state = e.target.value;
		setFormData((prev) => ({ ...prev, state }));
		fetchCities(formData.country, state);
	};

	const handleCheckboxChange = (e) => {
		const { value, checked } = e.target;
		setFormData((prev) => {
			const updatedInterests = checked
				? [...prev.areaOfInterest, value]
				: prev.areaOfInterest.filter((interest) => interest !== value);
			return { ...prev, areaOfInterest: updatedInterests };
		});
	};

	const handleFileChange = (e) => {
		setFormData((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/users/register";
			const payload = new FormData();
			for (const key in formData) {
				if (key === "areaOfInterest") {
					payload.append(key, JSON.stringify(formData[key]));
				} else {
					payload.append(key, formData[key]);
				}
			}
			await axios.post(url, payload, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			alert("Registration successful!");
			navigate("/login");
		} catch (err) {
			console.error("Signup error:", err);
			if (err.response?.data?.message) setError(err.response.data.message);
			else setError("Something went wrong.");
		}
	};

	return (
		<div className="form-container">
			<form className="form" onSubmit={handleSubmit}>
				<h1>Create Account</h1>

				<input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
				<input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />

				<label>Gender:</label>
				<div className="checkbox-group">
					<label><input type="radio" name="gender" value="Male" onChange={handleChange} /> Male</label>
					<label><input type="radio" name="gender" value="Female" onChange={handleChange} /> Female</label>
					<label><input type="radio" name="gender" value="Other" onChange={handleChange} /> Other</label>
				</div>

				<input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
				<input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
				<input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

				<select name="country" value={formData.country} onChange={handleCountryChange} required>
					<option value="">Select Country</option>
					{countries.map((country) => <option key={country} value={country}>{country}</option>)}
				</select>

				<select name="state" value={formData.state} onChange={handleStateChange} disabled={!states.length} required>
					<option value="">Select State</option>
					{states.map((state) => <option key={state} value={state}>{state}</option>)}
				</select>

				<select name="city" value={formData.city} onChange={handleChange} disabled={!cities.length} required>
					<option value="">Select City</option>
					{cities.map((city) => <option key={city} value={city}>{city}</option>)}
				</select>

				<input type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} required />

				<label>Area of Interest:</label>
				<div className="checkbox-group">
					<label><input type="checkbox" value="Reading" onChange={handleCheckboxChange} /> Reading</label>
					<label><input type="checkbox" value="Writing" onChange={handleCheckboxChange} /> Writing</label>
					<label><input type="checkbox" value="Traveling" onChange={handleCheckboxChange} /> Traveling</label>
					<label><input type="checkbox" value="Playing" onChange={handleCheckboxChange} /> Playing</label>
				</div>

				<label>Profile Picture:</label>
				<input type="file" accept="image/*" onChange={handleFileChange} required />

				{error && <p className="error">{error}</p>}
				<button type="submit">Register</button>

				<p>Already have an account? <Link to="/login">Sign in</Link></p>
			</form>
		</div>
	);
};



 export default Signup;
