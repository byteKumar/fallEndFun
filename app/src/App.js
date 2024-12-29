import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResumeBuilder from "./components/ResumeBuilder";
//  import RB from "./components/RB";
// import SignUp from "./components/SignUp";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Response from "./components/Response";
import JobDetails from "./components/JobDetails";
import ResumeUpload from "./components/ResumeUpload";
import "./App.css";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeBuilder />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resumeupload" element={<ResumeUpload />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/rb" element={<RB />} /> */}
        <Route path="/response" element={<Response />} />
        <Route path="/JD" element={<JobDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
