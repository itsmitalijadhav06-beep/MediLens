import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ParameterCard from "../components/ParameterCard";
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Loader2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [file, setFile] = useState(null);
  const [reportName, setReportName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchReports = async () => {
    try {
      const res = await API.get("/reports");
      setReports(res.data);
      if (res.data.length > 0) {
        setSelectedReport((prev) => (prev ? prev : res.data[0]));
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Please select a medical report file (PNG or JPG).");
      return;
    }

    setUploadError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("report", file);
    formData.append("reportName", reportName || file.name);

    const token = localStorage.getItem("token");

    try {
      const res = await API.post("/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      setFile(null);
      setReportName("");
      // Clear file input manually
      const fileInput = document.getElementById("reportFileInput");
      if (fileInput) fileInput.value = "";

      await fetchReports();
      setSelectedReport(res.data.report);
    } catch (err) {
      console.error("Upload failed:", err);
      const serverMsg = err.response?.data?.message;
      setUploadError(serverMsg || "Error running OCR on the uploaded document.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medical report record?")) return;
    try {
      await API.delete(`/reports/${id}`);
      const updated = reports.filter((r) => r._id !== id);
      setReports(updated);
      setSelectedReport(updated.length > 0 ? updated[0] : null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const chartData =
    selectedReport?.parameters?.map((p) => ({
      name: p.name,
      value: parseFloat(p.value) || 0,
      status: p.status
    })) || [];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#f8fafc" }}>
      <Navbar user={user} />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 36px" }}>
        {/* Metric Overview Row */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
            marginBottom: 28
          }}
        >
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>REPORTS ANALYZED</span>
              <FileText size={18} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, marginTop: 10, color: "#f8fafc" }}>
              {String(reports.length).padStart(2, "0")}
            </h3>
          </div>

          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>ACTIVE REPORT</span>
              <Layers size={18} color="#34d399" />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginTop: 12,
                color: "#38bdf8",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {selectedReport?.reportName || "None selected"}
            </h3>
          </div>

          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>PARAMETERS IDENTIFIED</span>
              <BarChart3 size={18} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, marginTop: 10, color: "#f8fafc" }}>
              {selectedReport?.parameters?.length || 0}
            </h3>
          </div>
        </section>

        {/* Master-Detail Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>
          
          {/* Left Column: Upload Form & Previous Reports */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Upload Box */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: 22 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <UploadCloud size={18} color="#38bdf8" /> Upload Medical Report
              </h3>

              {uploadError && (
                <div
                  style={{
                    backgroundColor: "#450a0a",
                    color: "#f87171",
                    padding: "10px 12px",
                    borderRadius: 6,
                    fontSize: 12,
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid #7f1d1d"
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                    Report Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Complete Blood Count"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #374151",
                      backgroundColor: "#0f172a",
                      color: "#f8fafc",
                      fontSize: 13
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                    File (PNG, JPG, JPEG)
                  </label>
                  <input
                    id="reportFileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 6,
                      border: "1px dashed #4b5563",
                      backgroundColor: "#0f172a",
                      color: "#94a3b8",
                      fontSize: 12
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#0369a1" : "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 6,
                    padding: 12,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 4
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Running OCR Extraction...
                    </>
                  ) : (
                    "Analyze Report"
                  )}
                </button>
              </form>
            </div>

            {/* History List */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: 22 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={18} color="#38bdf8" /> Previous Reports
              </h3>

              {reports.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: 13 }}>No reports registered yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
                  {reports.map((r) => {
                    const isSelected = selectedReport?._id === r._id;
                    return (
                      <div
                        key={r._id}
                        onClick={() => setSelectedReport(r)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 8,
                          backgroundColor: isSelected ? "#1e293b" : "#0f172a",
                          border: `1px solid ${isSelected ? "#38bdf8" : "#1f2937"}`,
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{r.reportName}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{r.reportDate}</div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(r._id);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                            padding: 4
                          }}
                          title="Delete report"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Report Display, Parameters & Visualization */}
          <div>
            {selectedReport ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* AI Interpretation Box */}
                <div
                  style={{
                    backgroundColor: "#111827",
                    border: "1px solid #1e3a8a",
                    borderRadius: 10,
                    padding: 22
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Sparkles size={18} color="#38bdf8" />
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#38bdf8" }}>
                      AI Medical Interpretation
                    </h3>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: "1.6", color: "#e2e8f0" }}>
                    {selectedReport.aiSummary}
                  </p>
                  <div
                    style={{
                      marginTop: 14,
                      padding: "8px 12px",
                      backgroundColor: "#1e293b",
                      borderRadius: 6,
                      fontSize: 11,
                      color: "#94a3b8"
                    }}
                  >
                    ⚠️ <strong>Clinical Disclaimer:</strong> MediLens extracts parameters for educational interpretation and does not replace certified medical diagnosis.
                  </div>
                </div>

                {/* Extracted Parameter Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 16
                  }}
                >
                  {selectedReport.parameters && selectedReport.parameters.length > 0 ? (
                    selectedReport.parameters.map((param, idx) => (
                      <ParameterCard key={idx} param={param} />
                    ))
                  ) : (
                    <p style={{ color: "#94a3b8" }}>No specific biomarker matches detected in this scan.</p>
                  )}
                </div>

                {/* Recharts Graphical Distribution */}
                <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: 22 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
                    Parameter Comparison Graph
                  </h3>
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 6 }}
                          itemStyle={{ color: "#38bdf8" }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.status === "Normal"
                                  ? "#0284c7"
                                  : entry.status === "Below"
                                  ? "#d97706"
                                  : "#dc2626"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#111827",
                  border: "1px dashed #374151",
                  borderRadius: 10,
                  padding: 60,
                  textAlign: "center",
                  color: "#94a3b8"
                }}
              >
                <FileText size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <h3>No Report Selected</h3>
                <p style={{ fontSize: 13, marginTop: 4 }}>
                  Upload a medical document (.png or .jpg) to see OCR extraction and AI analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}