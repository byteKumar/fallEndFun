const express = require("express");
const multer = require("multer");
const { mainJob } = require("../controllers/resumeController.js");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.pdf`);
  },
});
const upload = multer({ storage });

// Define the /api/main_job route
router.post("/main_job", upload.single("file"), mainJob);

module.exports = router;
