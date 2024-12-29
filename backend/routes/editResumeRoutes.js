const express = require("express");
const router = express.Router();
const { editResumeController } = require("../controllers/editResumeController");

// Define the route for editing a resume
router.post("/edit-resume", editResumeController);

module.exports = router;
