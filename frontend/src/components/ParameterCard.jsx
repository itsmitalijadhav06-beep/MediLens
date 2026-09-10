import { CheckCircle2, ArrowDown, ArrowUp, HelpCircle } from "lucide-react";

export default function ParameterCard({ param }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Normal":
        return {
          bg: "#064e3b",
          text: "#34d399",
          border: "#059669",
          icon: <CheckCircle2 size={15} />
        };
      case "Below":
        return {
          bg: "#451a03",
          text: "#fbbf24",
          border: "#d97706",
          icon: <ArrowDown size={15} />
        };
      case "Above":
        return {
          bg: "#450a0a",
          text: "#f87171",
          border: "#dc2626",
          icon: <ArrowUp size={15} />
        };
      default:
        return {
          bg: "#1e293b",
          text: "#94a3b8",
          border: "#475569",
          icon: <HelpCircle size={15} />
        };
    }
  };

  const badge = getStatusBadge(param.status);

  return (
    <div style={{
      backgroundColor: "#111827",
      borderRadius: 10,
      border: "1px solid #1f2937",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "4px",
        height: "100%",
        backgroundColor: badge.border
      }} />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>{param.name}</h4>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 8px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: badge.bg,
            color: badge.text,
            border: `1px solid ${badge.border}`
          }}>
            {badge.icon}
            {param.status}
          </span>
        </div>

        <div style={{ margin: "14px 0 6px 0" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc" }}>
            {param.value}
          </span>
          <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: 6 }}>
            {param.unit}
          </span>
        </div>

        <div style={{ fontSize: 12, color: "#64748b" }}>
          Reference Range: <strong style={{ color: "#94a3b8" }}>{param.referenceRange || "Not specified"}</strong>
        </div>
      </div>

      {param.explanation && (
        <div style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: "1px solid #1f2937",
          fontSize: 12,
          color: "#cbd5e1",
          lineHeight: 1.4
        }}>
          {param.explanation}
        </div>
      )}
    </div>
  );
}