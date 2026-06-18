import React from "react";

const styles = {
  wrapper: { marginBottom: "1rem" },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(232,238,255,0.5)",
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    height: "46px",
    padding: "0 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "12px",
    color: "#E8EEFF",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.2s",
  },
  inputError: {
    borderColor: "rgba(248,113,113,0.6)",
    background: "rgba(248,113,113,0.05)",
  },
  inputFocus: {
    borderColor: "rgba(99,102,241,0.7)",
    background: "rgba(99,102,241,0.08)",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.15)",
  },
  error: { fontSize: "12px", color: "#F87171", marginTop: "5px" },
  hint: { fontSize: "12px", color: "rgba(232,238,255,0.35)", marginTop: "5px" },
};

export default function Input({ label, error, hint, style, ...props }) {
  const [focused, setFocused] = React.useState(false);

  const inputStyle = {
    ...styles.input,
    ...(error ? styles.inputError : {}),
    ...(focused ? styles.inputFocus : {}),
    ...style,
  };

  return (
    <div style={styles.wrapper}>
      {label && <label style={styles.label}>{label}</label>}
      <input
        {...props}
        style={inputStyle}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      />
      {error && <p style={styles.error}>{error}</p>}
      {!error && hint && <p style={styles.hint}>{hint}</p>}
    </div>
  );
}