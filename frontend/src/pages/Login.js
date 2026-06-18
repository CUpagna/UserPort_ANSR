import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard, { LogoMark } from "../components/GlassCard";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { authAPI } from "../utils/api"; // 1. Use the authAPI wrapper

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast(); // 2. Destructure showToast

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setErrors({});
    setLoading(true);
    
    // 3. Call the Python backend using our wrapper
    const data = await authAPI.login({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    setLoading(false);

    if (data.success) {
      // 4. Save to localStorage so your Axios interceptor can find it!
      if (data.token) localStorage.setItem("uv_token", data.token);
      localStorage.setItem("uv_user", JSON.stringify(data.user));

      login(data.user); 
      showToast(data.message, "success");
      navigate("/dashboard");
    } else {
      // 5. Display the clean error message from our Python error_handlers.py
      showToast(data.message || "Invalid credentials", "error");
      setErrors({ password: data.message || "Login failed" });
    }
  };

  return (
    <div className="screen">
      <GlassCard>
        <LogoMark />
        <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "6px", color: "#F0F4FF" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(232,238,255,0.5)", marginBottom: "2rem" }}>
          Sign in to access your profile
        </p>

        <form onSubmit={handleSubmit} noValidate>
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
            placeholder="Your password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button type="submit" isLoading={loading} style={{ marginTop: "0.5rem" }}>
            Sign In →
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.4rem", fontSize: "14px", color: "rgba(232,238,255,0.45)" }}>
          No account yet?{" "}
          <Link to="/signup" style={{ color: "#818CF8", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Sign up
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}