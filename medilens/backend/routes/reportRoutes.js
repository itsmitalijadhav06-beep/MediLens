const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const protect = require("../middleware/authMiddleware");
const {
  uploadReport,
  getReports,
  getReportById,
  deleteReport
} = require("../controllers/reportController");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Endpoints
router.post("/upload", protect, upload.single("report"), uploadReport);
router.get("/", protect, getReports);
router.get("/:id", protect, getReportById);
router.delete("/:id", protect, deleteReport);

module.exports = router;