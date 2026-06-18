import React from "react";

export default function Button({ children, loading, variant = "primary", style, ...props }) {
  const base = {
    width: "100%",
    height: "48px",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    letterSpacing: "-0.2px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    opacity: loading ? 0.7 : 1,
  };

  const variants = {
    primary: {
      background: "linear-gradient(135deg, #6366F1, #4F46E5)",
      color: "#fff",
      boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
    },
    ghost: {
      background: "rgba(255,255,255,0.04)",
      color: "rgba(232,238,255,0.7)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "none",
    },
    danger: {
      background: "rgba(248,113,113,0.15)",
      color: "#F87171",
      border: "1px solid rgba(248,113,113,0.25)",
      boxShadow: "none",
    },
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {loading ? (
        <>
          <Spinner />
          {typeof children === "string" ? "Loading..." : children}
        </>
      ) : children}
    </button>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" style={{ animation: "spin 0.8s linear infinite" }} />
    </svg>
  );
}