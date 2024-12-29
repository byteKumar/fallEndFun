import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RB.css";

const RB = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // State for storing successful submissions
  const [submittedData, setSubmittedData] = useState([]);

  // Update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student Name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@northeastern\.edu$/.test(formData.email)) {
      newErrors.email = "Must be a valid Northeastern email.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSignUp = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save the data (you can replace this with an API call if needed)
      const newUser = {
        studentName: formData.studentName,
        email: formData.email,
        password: formData.password,
      };

      // Example: Save to local state
      setSubmittedData((prevData) => [...prevData, newUser]);

      // Example: Save to localStorage
      localStorage.setItem("userData", JSON.stringify(newUser));

      // Clear form data and navigate
      setFormData({
        studentName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      alert("Account successfully created!");
      navigate("/loginpage"); // Replace with actual navigation path
    }
  };

  const handleLogin = () => {
    navigate("/loginpage");
  };

  return (
    <div className="rb-container">
      {/* Header */}
      <div className="rb-header">
        <button className="rb-close-btn">✖</button>
        <span className="rb-header-text">
          PepperUni: Build a Winning Product Resume with AI Expertise
        </span>
      </div>

      {/* Main Content */}
      <div className="rb-content">
        {/* Left Section */}
        <div className="rb-left-section">
          <p className="rb-signin-text">You can also sign in with these:</p>
          <button className="rb-auth-btn rb-microsoft">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft Logo"
              className="rb-auth-logo"
            />
            Microsoft Account
          </button>
          <div className="rb-divider">
            <hr /> <span>or</span> <hr />
          </div>
          <button className="rb-auth-btn rb-linkedin">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
              alt="LinkedIn Logo"
              className="rb-auth-logo"
            />
            LinkedIn
          </button>
        </div>

        {/* Right Section */}
        <div className="rb-right-section">
          <p className="rb-account-text">
            Already have an account?{" "}
            <button className="rb-login-btn" onClick={handleLogin}>
              Login
            </button>
          </p>
          <form onSubmit={handleSignUp} noValidate>
            <input
              type="text"
              name="studentName"
              className="rb-input-field"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={handleInputChange}
            />
            {errors.studentName && (
              <span className="rb-error">{errors.studentName}</span>
            )}

            <input
              type="email"
              name="email"
              className="rb-input-field"
              placeholder="Northeastern email-id"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="rb-error">{errors.email}</span>}

            <input
              type="password"
              name="password"
              className="rb-input-field"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <span className="rb-error">{errors.password}</span>
            )}

            <input
              type="password"
              name="confirmPassword"
              className="rb-input-field"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <span className="rb-error">{errors.confirmPassword}</span>
            )}

            <button type="submit" className="rb-signup-btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RB;
