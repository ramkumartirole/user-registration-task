import React from "react";
import { useState } from "react";
import './style.css'

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    areaOfInterest: [],
    profilePicture: null,
  })

  const [countries] = useState(["India", "United States", "Canada"]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const fetchStates = (country) => {
    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country })
    })
      .then(res => res.json())
      .then(data => {
        const stateList = data.data.states.map(s => s.name);
        setStates(stateList);
        setCities([]);
        setFormData(prev => ({ ...prev, state: '', city: '' }));
      });
  };

  const fetchCities = (country, state) => {
    fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, state })
    })
      .then(res => res.json())
      .then(data => {
        setCities(data.data || []);
        setFormData(prev => ({ ...prev, city: '' }));
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData(prev => ({ ...prev, country }));
    fetchStates(country);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData(prev => ({ ...prev, state }));
    fetchCities(formData.country, state);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSuccessMessage('Registration successful!');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      state: '',
      city: '',
    });
    setStates([]);
    setCities([]);
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <h1>Registration Form </h1>
        <label>First Name </label>
        <input type="text" id="fname" name="fname" required></input><br />
        <label> Last Name</label>
        <input type="text" id="lname" name="lname" required></input> <br />

        <label>Gender: </label>
        <div>
          <label><input type="radio" name="gender" value="Male" /> Male</label>
          <label><input type="radio" name="gender" value="Female" /> Female</label>
          <label><input type="radio" name="gender" value="Other" /> Other</label>
        </div><br />

        <label> Email</label>
        <input type="text" id="email" name="email" required></input> <br />
        <label> Password</label>
        <input type="text" id="password" name="password" required></input><br />
        <label> Confirm Password</label>
        <input type="text" id="cpassword" name="cpassword" required></input><br />


        <label>Country:</label>
        <select name="country" value={formData.country} onChange={handleCountryChange} required>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <label>State:</label>
        <select name="state" value={formData.state} onChange={handleStateChange} disabled={!states.length} required>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <label>City:</label>
        <select name="city" value={formData.city} onChange={handleChange} disabled={!cities.length} required>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <label> Zip</label>
        <input type="text" id="zip" name="zip" required></input><br />
        {/* add number */}
        {/* <label>Country</label>
        <select name=""></select><br/> */}

        <label>Area of Interest:</label>
        <div>
          <label><input type="checkbox" name="interests" value="Reading" /> Reading</label>
          <label><input type="checkbox" name="interests" value="Writing" /> Writing</label>
          <label><input type="checkbox" name="interests" value="Traveling" /> Traveling</label>
          <label><input type="checkbox" name="interests" value="Playing" /> Playing</label>
        </div><br />


        <label>Profile Picture</label>
        <input type="file" accept="image/*" required></input> <br />
        <button type="submit"  >Register</button>
      </form>
      {successMessage && (
        <p>{successMessage}</p>
      )}
    </div>
  )
}

export default RegistrationForm;