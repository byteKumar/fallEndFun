import React, { useState, useRef } from "react";
import { LayoutGrid, FileDown, User2, Settings } from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Response = () => {
  const [editedResponse, setEditedResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { editedResume, jobDescription } = location.state || {};

  // Function to process the resume text for display
  const processResumeText = (text) => {
    if (!text) return "";
    const cleanText = text.replace(/[*#]/g, "");
    const lines = cleanText.split("\n");
    return lines.map((line, index) =>
      line.trim() === "" ? <br key={index} /> : <p key={index}>{line.trim()}</p>
    );
  };

  // Function to call the backend to edit the resume
  const pepperUnifyResumeText = async () => {
    if (!editedResume || !jobDescription) {
      console.error("Missing editedResume or jobDescription:", {
        editedResume,
        jobDescription,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/resumes/edit-resume",
        {
          resumeText: editedResume,
          jobDescription: jobDescription,
        }
      );

      if (response.data.status === "success") {
        setEditedResponse(response.data.data.editedResume);
      } else {
        console.error("Failed to edit resume:", response.data.message);
      }
    } catch (error) {
      console.error("Error calling backend API:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    },
    sidebar: {
      width: "240px",
      backgroundColor: "#000",
      color: "white",
      padding: "1.5rem",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "2rem",
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    navItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      color: "#888",
      textDecoration: "none",
      fontSize: "1rem",
    },
    activeNavItem: {
      color: "white",
      fontWeight: "600",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "2rem",
    },
    button: {
      padding: "0.75rem 2rem",
      backgroundColor: loading ? "#444" : "#000",
      color: "white",
      border: "2px solid white",
      borderRadius: "8px",
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
    },
    main: {
      flex: 1,
      padding: "2rem",
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "2rem",
      color: "#333",
    },
    textBox: {
      width: "80%",
      height: "70vh",
      padding: "1rem",
      fontSize: "1rem",
      fontFamily: "'Inter', sans-serif",
      lineHeight: "1.5",
      border: "1px solid #ccc",
      borderRadius: "8px",
      overflowY: "auto",
      whiteSpace: "pre-wrap",
      backgroundColor: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>PepperUni</div>
        <nav style={styles.nav}>
          <a href="/" style={{ ...styles.navItem, ...styles.activeNavItem }}>
            <LayoutGrid /> Home
          </a>
          <a href="/resume" style={styles.navItem}>
            <FileDown /> Resume
          </a>
          <a href="/profile" style={styles.navItem}>
            <User2 /> Profile
          </a>
          <a href="/settings" style={styles.navItem}>
            <Settings /> Settings
          </a>
        </nav>
      </aside>
      <main style={styles.main}>
        <h1 style={styles.title}>Resume Analysis</h1>
        {editedResume ? (
          <div style={styles.textBox}>{processResumeText(editedResume)}</div>
        ) : (
          <p>No resume available.</p>
        )}
        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={pepperUnifyResumeText}
            disabled={loading}
          >
            {loading ? "Processing..." : "PepperUnify"}
          </button>
        </div>
        {editedResponse && (
          <div style={styles.textBox}>
            <h2>Edited Resume</h2>
            {processResumeText(editedResponse)}
          </div>
        )}
      </main>
    </div>
  );
};

export default Response;
