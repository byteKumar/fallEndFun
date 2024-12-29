import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, FileDown, User2, Settings, CloudIcon } from "lucide-react";
import axios from "axios";

const ResumeUpload = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !jobTitle || !jobDescription) {
      alert("Please fill out all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/main_job/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        navigate("/response", {
          state: {
            editedResume: res.data.extractedText, // Pass edited resume
            jobDescription, // Pass job description
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
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
      backgroundColor: "black",
      color: "white",
      padding: "1.5rem",
    },
    logo: {
      fontSize: "1.25rem",
      fontWeight: "600",
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
      color: "#666",
      textDecoration: "none",
      fontSize: "0.875rem",
    },
    activeNavItem: {
      color: "white",
    },
    main: {
      flex: 1,
      padding: "2rem",
      backgroundColor: "white",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "2rem",
      color: "black",
    },
    content: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
      maxWidth: "1200px",
    },
    uploadSection: {
      border: "2px dashed #ccc",
      borderRadius: "4px",
      padding: "3rem 2rem",
      textAlign: "center",
      backgroundColor: "#f8f9fa",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "300px",
    },
    uploadIcon: {
      marginBottom: "1rem",
      color: "#666",
    },
    uploadText: {
      color: "#666",
      fontSize: "0.875rem",
      lineHeight: "1.5",
    },
    browseLink: {
      color: "#0066cc",
      textDecoration: "underline",
      cursor: "pointer",
    },
    formSection: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    formTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.875rem",
      color: "#666",
    },
    input: {
      padding: "0.5rem",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "0.875rem",
    },
    textarea: {
      padding: "0.5rem",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "0.875rem",
      minHeight: "150px",
      resize: "vertical",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "2rem",
      gridColumn: "1 / -1",
    },
    button: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "black",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "500",
    },

    button: {
      padding: "0.75rem 1.5rem",
      backgroundColor: loading ? "#ddd" : "black", // Disabled button style
      color: loading ? "#888" : "white",
      border: "none",
      borderRadius: "4px",
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    loadingText: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#666",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>PepperUni</div>
        <nav style={styles.nav}>
          <a href="/" style={{ ...styles.navItem, ...styles.activeNavItem }}>
            <span style={{ fontSize: "1.25rem" }}>⊞</span>
            Home
          </a>
          <a style={styles.navItem}>
            <span style={{ fontSize: "1.25rem" }}>
              <FileDown />
            </span>
            Resume
          </a>
          <a style={styles.navItem}>
            <span style={{ fontSize: "1.25rem" }}>
              <User2 />
            </span>
            Profile
          </a>
          <a style={styles.navItem}>
            <span style={{ fontSize: "1.25rem" }}>
              <Settings />
            </span>
            Setting
          </a>
        </nav>
      </aside>
      <main style={styles.main}>
        <h1 style={styles.title}>Resume and Job Description</h1>
        <div style={styles.content}>
          <div
            style={styles.uploadSection}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <CloudIcon size={48} style={styles.uploadIcon} />
            <div style={styles.uploadText}>
              Drag & drop files or{" "}
              <span style={styles.browseLink} onClick={handleBrowseClick}>
                Browse
              </span>
              <br />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#888",
                  marginTop: "0.5rem",
                  display: "block",
                }}
              >
                Supports format .pdf, .doc or .docx up to 50 MB
              </span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
              />
              {fileName && <p>{fileName}</p>}
            </div>
          </div>
          <div style={styles.formSection}>
            <h2 style={styles.formTitle}>Position Details</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Title</label>
              <input
                type="text"
                style={styles.input}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Description</label>
              <textarea
                style={styles.textarea}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>
          <div style={styles.buttonContainer}>
            {loading ? (
              <div style={styles.loadingText}>Loading...</div>
            ) : (
              <>
                <button style={styles.button} onClick={handleBrowseClick}>
                  UPLOAD FROM DEVICE
                </button>
                <button
                  style={styles.button}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;
