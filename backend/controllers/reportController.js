const Report = require("../models/Report");
const Counter = require("../models/Counter");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { processReportImage, processReportPdf } = require("../services/ocrService");

exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No report file provided." });
    }

    let processingResult;
    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const ext = path.extname(req.file.filename).toLowerCase();

    console.log(`[Upload Processed] filename: ${req.file.filename}, originalName: ${req.file.originalname}, mimeType: ${req.file.mimetype}, size: ${req.file.size} bytes`);

    if (ext === ".pdf") {
      processingResult = await processReportPdf(filePath);
    } else {
      processingResult = await processReportImage(filePath);
    }

    const reportName = req.body.reportName || req.file.originalname;
    const reportDate = req.body.reportDate || processingResult?.extractedDate || new Date().toISOString().split("T")[0];

    const parameters = processingResult?.parameters || [];
    const aiSummary = processingResult?.summary || "Report parsed successfully.";

    // Atomic sequence generator for reportId
    const counter = await Counter.findOneAndUpdate(
      { _id: "reportId" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true }
    );
    const reportId = counter.seq;

    const report = await Report.create({
      reportId,
      user: req.user.id,
      reportName,
      fileName: req.file.filename,
      reportDate,
      parameters,
      aiSummary
    });

    res.status(201).json({
      message: "Report processed and saved successfully.",
      report
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message || "Failed to save report" });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const requestedId = Number(req.params.id);
    if (isNaN(requestedId) || !Number.isInteger(requestedId) || requestedId <= 0) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const report = await Report.findOne({ reportId: requestedId, user: req.user.id });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const requestedId = Number(req.params.id);
    if (isNaN(requestedId) || !Number.isInteger(requestedId) || requestedId <= 0) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const report = await Report.findOneAndDelete({ reportId: requestedId, user: req.user.id });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Clean up uploaded file from disk
    if (report.fileName) {
      const filePath = path.join(__dirname, "../uploads", report.fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn("Failed to delete file from disk:", unlinkErr.message);
        }
      }
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};