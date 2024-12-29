import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("userData"));

    if (storedUser) {
      if (
        loginData.email === storedUser.email &&
        loginData.password === storedUser.password
      ) {
        alert("Login successful!");
        navigate("/resumeupload");
      } else {
        setLoginError("Invalid email or password.");
      }
    } else {
      setLoginError("No account found. Please sign up first.");
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
          <h2 className="title">Sign In</h2>
          <p className="subtitle">
            Do not have an account? <a href="/signup">Create an Account</a>
          </p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email Address*</label>
              <input
                id="email"
                type="email"
                placeholder="xxxx@northeastern.edu"
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password*</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
            <button type="submit" className="button">
              Sign In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
