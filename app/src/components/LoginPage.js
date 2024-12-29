import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  //testing commit

  // State to manage login form inputs
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State to manage login errors
  const [loginError, setLoginError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle login submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("userData"));

    if (storedUser) {
      if (
        loginData.email === storedUser.email &&
        loginData.password === storedUser.password
      ) {
        alert("Login successful!");
        navigate("/JD"); // Replace with the actual dashboard route
      } else {
        setLoginError("Invalid email or password.");
      }
    } else {
      setLoginError("No account found. Please sign up first.");
    }
  };

  // Handle navigation to the signup page
  const handleGetStarted = () => {
    navigate("/rb");
  };

  return (
    <div className="lp-container">
      {/* Close button */}
      <div className="lp-close-button">✖</div>

      {/* Header */}
      <h1 className="lp-header">Welcome Back, Husky</h1>

      {/* Login form */}
      <div className="lp-form-container">
        <p className="lp-login-prompt">Log in to access your account</p>

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Northeastern email-id"
          className="lp-input-field lp-email-field"
          value={loginData.email}
          onChange={handleInputChange}
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="lp-input-field lp-password-field"
          value={loginData.password}
          onChange={handleInputChange}
        />

        {/* Login Error Message */}
        {loginError && <p className="lp-error-message">{loginError}</p>}

        {/* Buttons */}
        <div className="lp-button-group">
          <button className="lp-form-button lp-login-button" onClick={handleLogin}>
            Login
          </button>
          <button className="lp-form-button lp-signup-button" onClick={handleGetStarted}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
