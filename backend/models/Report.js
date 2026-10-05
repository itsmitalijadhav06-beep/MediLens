const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema(
  {
    name: String,
    value: String,
    unit: String,
    referenceRange: String,
    status: {
      type: String,
      enum: ["Normal", "Above", "Below", "Unknown"],
      default: "Unknown"
    },
    explanation: String
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reportName: {
      type: String,
      required: true
    },
    fileName: String,
    reportDate: String,
    parameters: [parameterSchema],
    aiSummary: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Report", reportSchema);