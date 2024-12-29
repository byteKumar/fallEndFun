const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  filename: String,
  job_title: String,
  resume: String,
  score: String,
  created_date: String,
});

module.exports = mongoose.model("Resume", ResumeSchema);
