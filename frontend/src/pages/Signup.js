import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard, { LogoMark } from "../components/GlassCard";
import Input from "../components/Input";
import Button from "../components/Button";
import PasswordStrength from "../components/PasswordStrength";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { authAPI } from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Helper to update form state easily
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please enter your full name";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    
    if (Object.keys(errs).length) { 
        setErrors(errs); 
        return; 
    }
    
    setErrors({});
    setLoading(true);

    try {
      // Send the data to your Python backend
      const data = await authAPI.signup({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (data.success) {
        // Save to local storage for the Axios interceptor
        if (data.token) localStorage.setItem("uv_token", data.token);
        localStorage.setItem("uv_user", JSON.stringify(data.user));

        login(data.user);
        showToast(data.message || "Account created successfully!", "success");
        navigate("/dashboard");
      } else {
        // The backend rejected it (e.g., email already exists)
        showToast(data.message || "Signup failed", "error");
        setErrors({ email: data.message });
      }
    } catch (err) {
      showToast("Cannot connect to server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <GlassCard>
        <LogoMark />
        <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "6px", color: "#F0F4FF" }}>
          Create account
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(232,238,255,0.5)", marginBottom: "2rem" }}>
          Join thousands of users already on board
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            autoComplete="new-password"
          />
          
          <PasswordStrength password={form.password} />
          
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={form.confirm}
            onChange={set("confirm")}
            error={errors.confirm}
            autoComplete="new-password"
            style={{ marginTop: "1rem" }}
          />

          <Button type="submit" loading={loading} style={{ marginTop: "1rem" }}>
            Create Account →
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.4rem", fontSize: "14px", color: "rgba(232,238,255,0.45)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#818CF8", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}