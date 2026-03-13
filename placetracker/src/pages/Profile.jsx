import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  UserCircle, Mail, Lock, LogOut, Trash2,
  Save, Eye, EyeOff, ShieldAlert, Sparkles, X,
} from "lucide-react";
import toast from "react-hot-toast";

function SectionCard({ icon: Icon, iconColor, title, danger, children }) {
  const ic = iconColor || "#22D3EE";
  return (
    <div className={`profile-card${danger ? " profile-card-danger" : ""}`}>
      <div className="profile-card-header">
        <div className="card-icon-wrap" style={{
          background: danger ? "rgba(239,68,68,0.12)" : "rgba(34,211,238,0.1)",
          borderColor: danger ? "rgba(239,68,68,0.25)" : "rgba(34,211,238,0.2)"
        }}>
          <Icon size={16} color={ic} />
        </div>
        <span className="card-title" style={{ color: danger ? "#ef4444" : "#E5E9F7" }}>{title}</span>
      </div>
      <div className="profile-card-body">{children}</div>
    </div>
  );
}

function FieldWrap({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function PasswordInput({ value, onChange, show, onToggle }) {
  return (
    <div style={{ position:"relative" }}>
      <input type={show ? "text" : "password"} value={value} onChange={onChange}
        placeholder="..." className="field-input" style={{ paddingRight:40 }} />
      <button type="button" onClick={onToggle} className="eye-btn">
        {show ? <EyeOff size={15}/> : <Eye size={15}/>}
      </button>
    </div>
  );
}

function DeleteModal({ open, onClose, onConfirm, email }) {
  const [val, setVal] = useState("");
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth:400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Trash2 size={16} color="#ef4444"/>
            </div>
            <span className="modal-title" style={{ color:"#ef4444" }}>Delete Account</span>
          </div>
          <button className="modal-close" onClick={() => { onClose(); setVal(""); }}><X size={18}/></button>
        </div>
        <p style={{ fontSize:13.5, color:"#8FA0D7", lineHeight:1.75, marginBottom:20 }}>
          This will permanently delete your account and all data. <strong style={{ color:"#E5E9F7" }}>This cannot be undone.</strong>
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:22 }}>
          <label className="field-label">
            Type your email to confirm: <span style={{ color:"#22D3EE" }}>{email}</span>
          </label>
          <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={email}
            className="field-input" style={{ borderColor: val && val !== email ? "rgba(239,68,68,0.4)" : undefined }} />
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button className="btn-ghost" style={{ flex:1 }} onClick={() => { onClose(); setVal(""); }}>Cancel</button>
          <button className="btn-danger" style={{ flex:1, opacity: val !== email ? 0.5 : 1 }}
            onClick={() => { onConfirm(); setVal(""); }} disabled={val !== email}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [nameForm, setNameForm] = useState({ name: user?.name || "" });
  const [passForm, setPassForm] = useState({ current:"", newPass:"", confirm:"" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", fn, { passive:true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const getUsers = () => JSON.parse(localStorage.getItem("placetracker_users") || "[]");

  const handleUpdateName = (e) => {
    e.preventDefault();
    if (!nameForm.name.trim()) { toast.error("Name cannot be empty"); return; }
    const users = getUsers();
    localStorage.setItem("placetracker_users", JSON.stringify(
      users.map((u) => u.email === user.email ? { ...u, name: nameForm.name.trim() } : u)
    ));
    login({ ...user, name: nameForm.name.trim() });
    toast.success("Name updated successfully!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const users = getUsers();
    const cur = users.find((u) => u.email === user.email);
    if (!cur || cur.password !== passForm.current) { toast.error("Current password is incorrect"); return; }
    if (passForm.newPass.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (passForm.newPass !== passForm.confirm) { toast.error("New passwords do not match"); return; }
    localStorage.setItem("placetracker_users", JSON.stringify(
      users.map((u) => u.email === user.email ? { ...u, password: passForm.newPass } : u)
    ));
    setPassForm({ current:"", newPass:"", confirm:"" });
    toast.success("Password updated successfully!");
  };

  const handleLogout = () => { logout(); navigate("/login"); toast.success("Logged out successfully"); };

  const handleDeleteAccount = () => {
    localStorage.setItem("placetracker_users", JSON.stringify(getUsers().filter((u) => u.email !== user.email)));
    localStorage.removeItem(`placetracker_apps_${user.email}`);
    localStorage.removeItem(`placetracker_roadmap_${user.email}`);
    logout(); navigate("/login"); toast.success("Account deleted");
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0,2);

  return (
    <div style={{ minHeight:"100vh", background:"#02050E", overflowX:"hidden", paddingTop:80, fontFamily:"Montserrat, sans-serif", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        :root { --mouse-x:50vw; --mouse-y:50vh; }
        .pf-mouse-glow { position:fixed; inset:0; pointer-events:none; z-index:1; background:radial-gradient(circle 500px at var(--mouse-x) var(--mouse-y),rgba(34,211,238,0.05),transparent 55%); mix-blend-mode:screen; }
        .pf-grid { position:fixed; inset:0; pointer-events:none; z-index:0; background-image:linear-gradient(rgba(143,160,215,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(143,160,215,0.03) 1px,transparent 1px); background-size:50px 50px; mask-image:linear-gradient(to bottom,black 0%,transparent 100%); }
        .pf-orb1 { position:fixed; top:-140px; left:-140px; width:460px; height:460px; border-radius:50%; background:radial-gradient(circle,rgba(34,211,238,0.09),transparent 60%); filter:blur(80px); pointer-events:none; z-index:0; }
        .pf-orb2 { position:fixed; bottom:-180px; right:-180px; width:520px; height:520px; border-radius:50%; background:radial-gradient(circle,rgba(94,119,192,0.11),transparent 60%); filter:blur(90px); pointer-events:none; z-index:0; }
        .page-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(34,211,238,0.08); border:1px solid rgba(34,211,238,0.2); color:#22D3EE; font-size:11px; font-weight:600; padding:4px 12px; border-radius:999px; letter-spacing:0.5px; margin-bottom:6px; }
        .avatar-card { background:rgba(15,23,42,0.65); backdrop-filter:blur(16px); border:1px solid rgba(143,160,215,0.13); border-radius:18px; padding:24px 28px; margin-bottom:18px; box-shadow:0 10px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.04); display:flex; align-items:center; gap:20px; position:relative; overflow:hidden; }
        .avatar-card::before { content:''; position:absolute; top:-50px; right:-50px; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle,rgba(34,211,238,0.07),transparent 60%); pointer-events:none; }
        .avatar-circle { width:64px; height:64px; border-radius:18px; flex-shrink:0; background:linear-gradient(135deg,#1E2F66,rgba(34,211,238,0.4)); border:2px solid rgba(34,211,238,0.3); display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; color:#E5E9F7; box-shadow:0 0 20px rgba(34,211,238,0.15); }
        .profile-card { background:rgba(15,23,42,0.6); backdrop-filter:blur(14px); border:1px solid rgba(143,160,215,0.12); border-radius:16px; overflow:hidden; margin-bottom:16px; box-shadow:0 8px 30px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.03); transition:border-color 0.3s; }
        .profile-card:hover { border-color:rgba(143,160,215,0.2); }
        .profile-card-danger { border-color:rgba(239,68,68,0.18)!important; }
        .profile-card-danger:hover { border-color:rgba(239,68,68,0.3)!important; }
        .profile-card-header { display:flex; align-items:center; gap:12px; padding:18px 22px 14px; border-bottom:1px solid rgba(143,160,215,0.08); }
        .card-icon-wrap { width:32px; height:32px; border-radius:9px; border:1px solid; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .card-title { font-family:'EB Garamond',serif; font-size:17px; font-weight:600; }
        .profile-card-body { padding:20px 22px; }
        .field-label { font-size:12px; font-weight:600; color:#8FA0D7; letter-spacing:0.3px; }
        .field-input { width:100%; height:42px; padding:0 14px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(143,160,215,0.15); color:#E5E9F7; font-size:13.5px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; font-family:Montserrat,sans-serif; box-sizing:border-box; }
        .field-input::placeholder { color:#5A6386; }
        .field-input:focus { border-color:rgba(34,211,238,0.4); box-shadow:0 0 0 3px rgba(34,211,238,0.06); }
        .eye-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:#5A6386; cursor:pointer; display:flex; align-items:center; transition:color 0.15s; }
        .eye-btn:hover { color:#22D3EE; }
        .btn-save { display:inline-flex; align-items:center; gap:7px; padding:10px 22px; border-radius:999px; border:none; background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.3s cubic-bezier(0.25,1,0.5,1); box-shadow:0 6px 16px rgba(34,211,238,0.25); font-family:Montserrat,sans-serif; flex-shrink:0; }
        .btn-save:hover { transform:translateY(-2px); box-shadow:0 10px 24px rgba(34,211,238,0.4); }
        .btn-ghost { height:42px; border-radius:999px; font-size:13px; font-weight:600; background:transparent; border:1px solid rgba(143,160,215,0.2); color:#8FA0D7; cursor:pointer; transition:all 0.2s; font-family:Montserrat,sans-serif; padding:0 20px; }
        .btn-ghost:hover { border-color:rgba(143,160,215,0.4); color:#E5E9F7; }
        .btn-danger { height:42px; border-radius:999px; font-size:13px; font-weight:700; background:rgba(239,68,68,0.85); color:#fff; border:none; cursor:pointer; transition:all 0.2s; font-family:Montserrat,sans-serif; padding:0 20px; }
        .btn-danger:hover:not(:disabled) { background:#ef4444; box-shadow:0 6px 16px rgba(239,68,68,0.35); }
        .danger-row { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-radius:12px; border:1px solid rgba(143,160,215,0.1); background:rgba(255,255,255,0.02); transition:background 0.2s; }
        .danger-row:hover { background:rgba(255,255,255,0.03); }
        .danger-row-red { border-color:rgba(239,68,68,0.15)!important; background:rgba(239,68,68,0.03)!important; }
        .danger-row-red:hover { background:rgba(239,68,68,0.06)!important; }
        .btn-logout-row { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:999px; font-size:12.5px; font-weight:600; background:transparent; border:1px solid rgba(143,160,215,0.2); color:#8FA0D7; cursor:pointer; transition:all 0.2s; font-family:Montserrat,sans-serif; }
        .btn-logout-row:hover { color:#E5E9F7; border-color:rgba(143,160,215,0.4); }
        .btn-delete-row { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:999px; font-size:12.5px; font-weight:600; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); color:#ef4444; cursor:pointer; transition:all 0.2s; font-family:Montserrat,sans-serif; }
        .btn-delete-row:hover { background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.45); box-shadow:0 4px 12px rgba(239,68,68,0.2); }
        .modal-overlay { position:fixed; inset:0; z-index:9000; background:rgba(2,5,14,0.75); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:24px; }
        .modal-box { background:rgba(10,18,42,0.96); backdrop-filter:blur(24px); border:1px solid rgba(143,160,215,0.18); border-radius:20px; padding:28px; width:100%; box-shadow:0 40px 100px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.05); font-family:Montserrat,sans-serif; animation:modalIn 0.25s cubic-bezier(0.25,1,0.5,1); }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(12px); } to { opacity:1; transform:none; } }
        .modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .modal-title { font-family:'EB Garamond',serif; font-size:20px; font-weight:600; }
        .modal-close { width:32px; height:32px; border-radius:8px; border:1px solid rgba(143,160,215,0.15); background:transparent; color:#8FA0D7; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
        .modal-close:hover { border-color:rgba(239,68,68,0.35); color:#ef4444; }
      `}</style>

      <div className="pf-grid"/>
      <div className="pf-orb1"/>
      <div className="pf-orb2"/>
      <div className="pf-mouse-glow"/>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px", position:"relative", zIndex:2 }}>

        {/* Header */}
        <div style={{ marginBottom:28, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"opacity 0.6s ease, transform 0.6s ease" }}>
          <div className="page-badge"><Sparkles size={10}/> Account</div>
          <h1 style={{ fontFamily:"EB Garamond, serif", fontSize:"clamp(28px,3.5vw,42px)", fontWeight:600, color:"#F8FAFF", lineHeight:1.2, marginTop:4 }}>Profile &amp; Settings</h1>
          <p style={{ color:"#8FA0D7", fontSize:13.5, marginTop:6 }}>Manage your account details and preferences</p>
        </div>

        {/* Avatar Card */}
        <div className="avatar-card" style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)", transition:"opacity 0.6s ease 0.08s, transform 0.6s ease 0.08s" }}>
          <div className="avatar-circle">{initials}</div>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontFamily:"EB Garamond, serif", fontSize:22, fontWeight:600, color:"#E5E9F7" }}>{user?.name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4, color:"#8FA0D7", fontSize:13 }}>
              <Mail size={13}/> {user?.email}
            </div>
          </div>
        </div>

        {/* Update Name */}
        <div style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)", transition:"opacity 0.6s ease 0.14s, transform 0.6s ease 0.14s" }}>
          <SectionCard icon={UserCircle} title="Update Name">
            <form onSubmit={handleUpdateName} style={{ display:"flex", gap:10 }}>
              <input value={nameForm.name} onChange={(e) => setNameForm({ name:e.target.value })}
                placeholder="Your full name" className="field-input" style={{ flex:1 }}/>
              <button type="submit" className="btn-save"><Save size={14}/> Save</button>
            </form>
          </SectionCard>
        </div>

        {/* Change Password */}
        <div style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)", transition:"opacity 0.6s ease 0.20s, transform 0.6s ease 0.20s" }}>
          <SectionCard icon={Lock} title="Change Password">
            <form onSubmit={handleUpdatePassword} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <FieldWrap label="Current Password">
                <PasswordInput value={passForm.current} onChange={(e) => setPassForm({...passForm, current:e.target.value})} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)}/>
              </FieldWrap>
              <FieldWrap label="New Password">
                <PasswordInput value={passForm.newPass} onChange={(e) => setPassForm({...passForm, newPass:e.target.value})} show={showNew} onToggle={() => setShowNew(!showNew)}/>
              </FieldWrap>
              <FieldWrap label="Confirm New Password">
                <PasswordInput value={passForm.confirm} onChange={(e) => setPassForm({...passForm, confirm:e.target.value})} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}/>
              </FieldWrap>
              <div><button type="submit" className="btn-save"><Save size={14}/> Update Password</button></div>
            </form>
          </SectionCard>
        </div>

        {/* Danger Zone */}
        <div style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)", transition:"opacity 0.6s ease 0.26s, transform 0.6s ease 0.26s" }}>
          <SectionCard icon={ShieldAlert} iconColor="#ef4444" title="Danger Zone" danger>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div className="danger-row">
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"#E5E9F7" }}>Log out</div>
                  <div style={{ fontSize:12, color:"#8FA0D7", marginTop:2 }}>Sign out of your account</div>
                </div>
                <button className="btn-logout-row" onClick={handleLogout}><LogOut size={13}/> Logout</button>
              </div>
              <div className="danger-row danger-row-red">
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"#ef4444" }}>Delete account</div>
                  <div style={{ fontSize:12, color:"#8FA0D7", marginTop:2 }}>Permanently delete all your data</div>
                </div>
                <button className="btn-delete-row" onClick={() => setDeleteOpen(true)}><Trash2 size={13}/> Delete</button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDeleteAccount} email={user?.email}/>
    </div>
  );
}