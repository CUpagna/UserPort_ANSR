import React from "react";

export function getStrength(password) {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const labels = ["", "Weak", "Fair", "Good", "Strong"];
const colors = ["", "#F87171", "#FB923C", "#FBBF24", "#34D399"];

export default function PasswordStrength({ password }) {
  const score = getStrength(password);
  if (!password) return null;

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "5px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            flex: 1, height: "3px", borderRadius: "2px",
            background: i <= score ? colors[score] : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      {score > 0 && (
        <p style={{ fontSize: "11px", color: colors[score], fontWeight: 500 }}>
          {labels[score]} password
        </p>
      )}
    </div>
  );
}