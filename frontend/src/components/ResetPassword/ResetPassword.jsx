import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import  style from'./style.css'


function ResetPassword() {
  const [data, setData] = useState({ email: "", password: "" });
  // const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };


const [message, setMessage] = useState(""); // 👈 Add this at the top

const handleSubmit = (e) => {
  e.preventDefault();
  axios.post("http://localhost:8080/api/users/reset-password", data)
    .then(res => {
      setMessage(res.data.message); // 👈 show success message
      setTimeout(() => {
        navigate("/LoginForm"); // navigate after 2s (optional)
      }, 2000);
    })
    .catch(err => {
      if (err.response && err.response.data.message) {
        setMessage(err.response.data.message); // 👈 show error message
      } else {
        setMessage("Something went wrong.");
      }
    });
};


  return (
    // <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
    //   <div className="bg-white p-3 rounded w-25">
    <div className="reset-container">
      <div className="reset-card">

        <h4>Reset Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={handleChange}
              value={data.email}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email">
              <strong>New Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="form-control rounded-0"
              onChange={handleChange}
              value={data.password}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Update
          </button>
        </form>
          <div
  className={`${style.message} ${
    message.toLowerCase().includes("success") ? "" : style.error
  }`}
>
  {message}
</div>

      </div>
    </div>

      


  )
}

export default ResetPassword;


