const fs = require("fs");
const { extractTextFromPDF } = require("../services/pdfService");

exports.mainJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { job_title, job_description, user_id } = req.body;
    const filePath = req.file.path;

    // Extract text from PDF
    const pdfData = await extractTextFromPDF(filePath);

    // Simulate storing and processing
    console.log("Uploaded File:", req.file.filename);
    console.log("Extracted PDF Text:", pdfData.text);
    console.log("Job Title:", job_title);
    console.log("Job Description:", job_description);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "File processed successfully",
      extractedText: pdfData.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred", details: err.message });
  }
};
