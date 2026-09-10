import { useNavigate } from "react-router-dom";
import { Activity, LogOut, User } from "lucide-react";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 36px",
      backgroundColor: "#111827",
      borderBottom: "1px solid #1f2937"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          backgroundColor: "#0284c7",
          padding: 8,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Activity size={22} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#f8fafc", margin: 0 }}>
            Medi<span style={{ color: "#38bdf8" }}>Lens</span>
          </h2>
          <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
            Clinical Report Intelligence
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "#1e293b",
          padding: "6px 14px",
          borderRadius: 20,
          border: "1px solid #334155"
        }}>
          <User size={16} color="#38bdf8" />
          <span style={{ fontSize: 13, color: "#e2e8f0" }}>{user?.name || "Patient"}</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "transparent",
            border: "1px solid #dc2626",
            color: "#f87171",
            padding: "6px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500
          }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </header>
  );
}