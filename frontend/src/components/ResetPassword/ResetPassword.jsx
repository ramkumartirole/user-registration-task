import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import './style.css'


function ResetPassword() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate()

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`http://localhost:8080/api/users/reset-password`, data)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate("/LoginForm.jsx")

        }
      }).catch(err => console.log(err))
  }

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

      </div>
    </div>
  )
}

export default ResetPassword;


