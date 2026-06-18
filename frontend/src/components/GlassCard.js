import React from "react";

export default function GlassCard({ children, style, maxWidth = "420px" }) {
  return (
    <div style={{
      position: "relative",
      zIndex: 1,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "24px",
        padding: "2.5rem",
        width: "100%",
        maxWidth,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}>
        {/* Top shimmer border */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(6,182,212,0.6), transparent)",
        }} />
        {children}
      </div>
    </div>
  );
}

export function LogoMark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
      <div style={{
        width: "38px", height: "38px", borderRadius: "10px",
        background: "linear-gradient(135deg, #6366F1, #06B6D4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", fontWeight: 700, color: "#fff",
        boxShadow: "0 0 20px rgba(99,102,241,0.4)",
      }}>U</div>
      <div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "#E8EEFF", letterSpacing: "-0.3px" }}>UserVault</div>
        <div style={{ fontSize: "11px", color: "rgba(232,238,255,0.4)", marginTop: "1px" }}>Identity Platform</div>
      </div>
    </div>
  );
}