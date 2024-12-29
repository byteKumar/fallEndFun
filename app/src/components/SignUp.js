import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure you have react-router-dom installed
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // React Router's hook for navigation

  const validateForm = () => {
    const errors = {};
    if (!formData.studentName) errors.studentName = "Name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newUser = {
        studentName: formData.studentName,
        email: formData.email,
        password: formData.password,
      };
      localStorage.setItem("userData", JSON.stringify(newUser));

      setFormData({
        studentName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      alert("Account successfully created!");

      navigate("/login");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h1>PepperUni</h1>
        <p>Build a Winning Product Resume with AI Expertise</p>
      </div>
      <main className="main">
        <div className="form">
          <h2 className="title">Create your account</h2>
          <p className="subtitle">
            Already have an account?{" "}
            <a href="/login" className="link">
              Login
            </a>
          </p>
          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <label htmlFor="name">Full Name*</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.studentName}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                required
              />
              {errors.studentName && (
                <p className="error-message">{errors.studentName}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address*</label>
              <input
                id="email"
                type="email"
                placeholder="xxxx@northeastern.edu"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="password">Password*</label>
              <input
                id="password"
                type="password"
                placeholder="Create your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password*</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>
            <button type="submit" className="button">
              Sign Up
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
