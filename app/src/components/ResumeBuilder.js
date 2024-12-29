import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start the fade-out effect before navigating
    const timer = setTimeout(() => {
      setIsFadingOut(true); // Trigger fade-out
    }, 2000);

    // Navigate after fade-out animation ends (duration: 1s)
    const navigateTimer = setTimeout(() => {
      navigate("/signup");
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  // Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "100vh",
    backgroundColor: "#121212",
    margin: 0,
    color: "white",
    overflow: "hidden",
    opacity: isFadingOut ? 0 : 1, // Fade out effect
    transition: "opacity 1s ease-in-out",
  };

  const contentStyle = {
    maxWidth: "600px",
    animation: !isFadingOut ? "fadeIn 1s forwards" : null,
  };

  const titleStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: "1rem",
    fontWeight: "normal",
    marginTop: "0.5rem",
    color: "#bdbdbd",
  };

  const keyframes = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;

  return (
    <>
      <style>
        {keyframes}
      </style>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={titleStyle}>PepperUni</h1>
          <p style={subtitleStyle}>Powered By APMC Alpha</p>
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;
