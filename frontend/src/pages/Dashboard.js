import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../utils/api";

/* ─── helpers ─── */
function initials(name = "") {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/* ─── sub-components ─── */
function StatCard({ label, value, color, pulse }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px", padding: "1.4rem",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "14px", right: "14px",
        width: "8px", height: "8px", borderRadius: "50%",
        background: color, boxShadow: `0 0 8px ${color}`,
        animation: pulse ? "uvpulse 2s infinite" : "none",
      }} />
      <p style={{ fontSize: "11px", color: "rgba(232,238,255,0.4)", letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "22px", fontWeight: 700, color, letterSpacing: "-0.5px" }}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <span style={{ fontSize: "13px", color: "rgba(232,238,255,0.4)" }}>{label}</span>
      <span style={{
        fontSize: mono ? "11px" : "13px",
        color: mono ? "rgba(232,238,255,0.35)" : "#E8EEFF",
        fontWeight: 500, fontFamily: mono ? "monospace" : "inherit",
        wordBreak: "break-all", maxWidth: "60%", textAlign: "right",
      }}>{value || "—"}</span>
    </div>
  );
}

function ActivityItem({ color, text, time }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, background: color, boxShadow: `0 0 8px ${color}` }} />
      <span style={{ flex: 1, fontSize: "13px", color: "rgba(232,238,255,0.75)" }}>{text}</span>
      <span style={{ fontSize: "12px", color: "rgba(232,238,255,0.3)", flexShrink: 0 }}>{time}</span>
    </div>
  );
}

/* ─── main ─── */
export default function Dashboard() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // FIXED: Destructured showToast
  const { showToast } = useToast();

  const [profile, setProfile] = useState(user);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [editName, setEditName] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);

  /* Fetch fresh profile from backend */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data.user);
      updateUser(res.data.user);
    } catch {
      // FIXED: Used showToast
      showToast("Could not load profile", "error");
    } finally {
      setFetchLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  /* Session timer */
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setSessionSecs(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const fmtSession = () => {
    const m = Math.floor(sessionSecs / 60), s = sessionSecs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const handleLogout = () => {
    logout();
    // FIXED: Used showToast
    showToast("Signed out safely", "info");
    navigate("/login");
  };

  const handleSaveName = async () => {
    // 1. Frontend Validation: Catch empty inputs before calling the server!
    if (!editName.trim()) { 
      setNameError("Name cannot be empty"); 
      return; 
    }
    
    // 2. Clear old errors and start loading
    setSaving(true); 
    setNameError(""); 
    
    try {
      const res = await api.put("/user/profile", { name: editName.trim() });
      setProfile(res.data.user);
      updateUser(res.data.user);
      setEditing(false);
      showToast("Profile updated!", "success");
      
    } catch (err) {
      // 3. Dynamic Backend Errors: Look for the exact message FastAPI sent
      const backendMessage = err.response?.data?.message;
      
      // If the backend sent a message, show it. Otherwise, assume the server is offline.
      setNameError(backendMessage || "Network error. Is the server running?");
      
    } finally {
      setSaving(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px", height: "40px", border: "3px solid rgba(99,102,241,0.2)",
            borderTopColor: "#6366F1", borderRadius: "50%", margin: "0 auto 12px",
            animation: "uvspin 0.8s linear infinite",
          }} />
          <p style={{ color: "rgba(232,238,255,0.4)", fontSize: "14px" }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes uvpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        @keyframes uvspin { to { transform: rotate(360deg) } }
        @keyframes uvfadein { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .dash-section { animation: uvfadein 0.4s ease both; }
        .dash-section:nth-child(2) { animation-delay: 0.05s; }
        .dash-section:nth-child(3) { animation-delay: 0.1s; }
        .dash-section:nth-child(4) { animation-delay: 0.15s; }
        @media(max-width:640px){
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", padding: "1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* ── Nav ── */}
          <nav className="dash-section" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px", padding: "12px 20px", marginBottom: "1.5rem",
            backdropFilter: "blur(20px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "linear-gradient(135deg, #6366F1, #06B6D4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 700, color: "#fff",
              }}>U</div>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#E8EEFF" }}>UserPort</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{
                padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                background: "rgba(52,211,153,0.12)", color: "#34D399",
                border: "1px solid rgba(52,211,153,0.25)",
              }}>● Active</span>
              <Button variant="ghost" onClick={handleLogout} style={{ width: "auto", height: "36px", padding: "0 14px", fontSize: "13px" }}>
                Sign out
              </Button>
            </div>
          </nav>

          {/* ── Greeting ── */}
          <div className="dash-section" style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px", color: "#F0F4FF" }}>
              Hey, {profile?.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(232,238,255,0.4)", marginTop: "4px" }}>
              Here's your account overview
            </p>
          </div>

          {/* ── Stat Cards ── */}
          <div className="dash-section stat-grid" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem", marginBottom: "1.5rem",
          }}>
            <StatCard label="Account Status" value="Verified ✓" color="#34D399" pulse />
            <StatCard label="Session Time" value={fmtSession()} color="#818CF8" pulse />
            <StatCard label="Total Logins" value={profile?.login_count ?? 1} color="#06B6D4" />
          </div>

          {/* ── Profile + Security ── */}
          <div className="dash-section profile-grid" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "1rem", marginBottom: "1rem",
          }}>
            {/* Profile card */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", padding: "1.6rem",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(232,238,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1.2rem" }}>
                Your Profile
              </p>

              {/* Avatar row */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.4rem" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #6366F1, #06B6D4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", fontWeight: 700, color: "#fff",
                  boxShadow: "0 0 0 3px rgba(99,102,241,0.25)",
                }}>
                  {initials(profile?.name)}
                </div>
                <div>
                  <p style={{ fontSize: "17px", fontWeight: 600, color: "#F0F4FF" }}>{profile?.name}</p>
                  <p style={{ fontSize: "13px", color: "rgba(232,238,255,0.4)", marginTop: "2px" }}>
                    @{profile?.name?.toLowerCase().replace(/\s+/g, "")}
                  </p>
                </div>
              </div>

              <InfoRow label="Email" value={profile?.email} />
              <InfoRow label="Member since" value={fmtDate(profile?.created_at)} />
              <InfoRow label="Account ID" value={profile?.id} mono />

              {/* Edit name */}
              <div style={{ marginTop: "1.2rem" }}>
                {editing ? (
                  <div>
                    <Input
                      label="Update Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      error={nameError}
                      placeholder="Your full name"
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button onClick={handleSaveName} loading={saving} style={{ height: "36px", fontSize: "13px" }}>
                        Save
                      </Button>
                      <Button variant="ghost" onClick={() => { setEditing(false); setNameError(""); }}
                        style={{ height: "36px", fontSize: "13px" }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" onClick={() => { setEditName(profile?.name || ""); setEditing(true); }}
                    style={{ height: "36px", fontSize: "13px" }}>
                    ✏️  Edit Name
                  </Button>
                )}
              </div>
            </div>

            {/* Security card */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", padding: "1.6rem",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(232,238,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1.2rem" }}>
                Security & Access
              </p>
              <InfoRow label="Last login" value={fmtTime(profile?.last_login)} />
              <InfoRow label="Last login date" value={fmtDate(profile?.last_login)} />
              <InfoRow label="Total sign-ins" value={profile?.login_count} />
              <InfoRow label="Active sessions" value="1" />
              <InfoRow label="2FA" value="Not configured" />

              <div style={{
                marginTop: "1.2rem", padding: "12px",
                background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: "10px",
              }}>
                <p style={{ fontSize: "12px", color: "rgba(232,238,255,0.5)", lineHeight: 1.5 }}>
                  🔒 Your password is securely hashed with <strong style={{ color: "#818CF8" }}>bcrypt</strong>. We never store plaintext credentials.
                </p>
              </div>
            </div>
          </div>

          
          {/* ── Footer ── */}
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "12px", color: "rgba(232,238,255,0.2)" }}>
            UserVault Identity Platform · Session secured with JWT · Data stored in SQLite
          </p>
        </div>
      </div>
    </>
  );
}