import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container">
      <header className="header">
        <button className="close-btn">✖</button>
        <h1>YOUR CAREER AND DESIRED JOB DETAILS</h1>
        <div className="menu-wrapper">
          <button className="menu-btn" onClick={toggleDropdown}>
            ☰
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div>Profile</div>
              <div>Resume</div>
              <div>Logout</div>
            </div>
          )}
        </div>
      </header>
      <div className="content">
        <div className="resume-upload">
          <h2>Upload your Resume</h2>
          <div className="upload-box">
            <p>
              Choose a file or drag and drop it here <br />
              <span>.doc, .docx or .pdf, up to 50 MB.</span>
            </p>
            {/* Button that triggers file input */}
            <button
              className="browse-btn"
              onClick={handleBrowseClick}
            >
              <img src="/upload-icon.png" alt="Upload" />
              Browse Files
            </button>

            {/* Hidden file input element */}
            <input
              type="file"
              ref={fileInputRef} 
              style={{ display: "none" }}
              accept=".doc,.docx,.pdf"
              onChange={handleFileChange}
            />
            {/* Display selected file name */}
            {fileName && <p>{fileName}</p>}
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="job-details">
          <h2>Add Job Description:</h2>
          <form>
            <label>Job Title:</label>
            <input type="text" placeholder="Enter job title" />
            <label>Job Description:</label>
            <textarea placeholder="Enter job description"></textarea>
            <div className="buttons">
              <button type="button" className="cancel-btn">CANCEL</button>
              <button type="submit" className="save-btn">Save Job</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
