// src/components/KeyboardShortcuts.jsx
// Drop into your root layout — it listens globally and renders the overlay
// Usage: <KeyboardShortcuts />  (inside ProtectedRoute layout)

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Command } from "lucide-react";

const SHORTCUTS = [
  { key:"G then D", desc:"Go to Dashboard",    action:"nav:/dashboard"    },
  { key:"G then A", desc:"Go to Applications", action:"nav:/applications" },
  { key:"G then C", desc:"Go to Calendar",     action:"nav:/calendar"     },
  { key:"G then R", desc:"Go to Roadmap",      action:"nav:/roadmap"      },
  { key:"G then P", desc:"Go to Profile",      action:"nav:/profile"      },
  { key:"N",        desc:"New application",    action:"new-app"           },
  { key:"?",        desc:"Show this panel",    action:"shortcuts"         },
  { key:"Esc",      desc:"Close overlay",      action:"close"             },
];

const NAV_KEYS = { d:"/dashboard", a:"/applications", c:"/calendar", r:"/roadmap", p:"/profile" };

export default function KeyboardShortcuts({ onNewApp }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false); // waiting for second key after G

  const handleKey = useCallback((e) => {
    const tag = e.target.tagName.toLowerCase();
    if (["input","textarea","select"].includes(tag)) return;

    const key = e.key.toLowerCase();

    if (key === "escape") { setOpen(false); setPending(false); return; }
    if (key === "?" || (e.shiftKey && key === "/")) { setOpen(o => !o); setPending(false); return; }

    if (pending) {
      setPending(false);
      if (NAV_KEYS[key]) { navigate(NAV_KEYS[key]); setOpen(false); }
      return;
    }

    if (key === "g") { setPending(true); setTimeout(() => setPending(false), 1500); return; }
    if (key === "n" && !open) { if (onNewApp) onNewApp(); return; }
  }, [pending, navigate, open, onNewApp]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!open) return (
    <>
      {/* Subtle hint badge — bottom right */}
      <div
        onClick={() => setOpen(true)}
        title="Keyboard shortcuts (?)"
        style={{
          position:"fixed", bottom:24, right:24, zIndex:8000,
          width:36, height:36, borderRadius:10,
          background:"rgba(15,23,42,0.7)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(143,160,215,0.15)",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", transition:"all 0.2s",
          color:"#5A6386",
          boxShadow:"0 4px 16px rgba(0,0,0,0.3)",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(34,211,238,0.3)"; e.currentTarget.style.color="#22D3EE"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(143,160,215,0.15)"; e.currentTarget.style.color="#5A6386"; }}
      >
        <span style={{ fontSize:14, fontWeight:700, fontFamily:"monospace" }}>?</span>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        .ks-overlay { position:fixed; inset:0; z-index:9500; background:rgba(2,5,14,0.8); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:24px; animation:ksFadeIn 0.2s ease; }
        @keyframes ksFadeIn { from{opacity:0} to{opacity:1} }
        .ks-panel { background:rgba(10,18,42,0.97); border:1px solid rgba(143,160,215,0.18); border-radius:20px; padding:0; width:100%; max-width:440px; box-shadow:0 30px 80px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.05); overflow:hidden; animation:ksPanelIn 0.25s cubic-bezier(0.25,1,0.5,1); font-family:Montserrat,sans-serif; }
        @keyframes ksPanelIn { from{opacity:0;transform:scale(0.96) translateY(10px)} to{opacity:1;transform:none} }
        .ks-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 14px; border-bottom:1px solid rgba(143,160,215,0.08); }
        .ks-title { font-family:'EB Garamond',serif; font-size:20px; font-weight:600; color:#E5E9F7; }
        .ks-close { width:30px; height:30px; border-radius:8px; border:1px solid rgba(143,160,215,0.15); background:transparent; color:#8FA0D7; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
        .ks-close:hover { border-color:rgba(239,68,68,0.35); color:#ef4444; }
        .ks-section { padding:6px 0; }
        .ks-section-label { font-size:10px; font-weight:700; color:#3A4566; letter-spacing:1px; text-transform:uppercase; padding:8px 24px 4px; }
        .ks-row { display:flex; align-items:center; justify-content:space-between; padding:8px 24px; transition:background 0.15s; }
        .ks-row:hover { background:rgba(255,255,255,0.02); }
        .ks-desc { font-size:13px; color:#8FA0D7; }
        .ks-key { display:flex; gap:4px; align-items:center; }
        .kbd { display:inline-flex; align-items:center; justify-content:center; min-width:24px; height:22px; padding:0 7px; background:rgba(143,160,215,0.08); border:1px solid rgba(143,160,215,0.2); border-bottom:2px solid rgba(143,160,215,0.3); border-radius:5px; font-size:11px; font-weight:600; color:#C3CCEB; letter-spacing:0.2px; font-family:monospace; }
        .ks-footer { padding:12px 24px 16px; border-top:1px solid rgba(143,160,215,0.08); display:flex; align-items:center; gap:8px; }
        .ks-footer-text { font-size:11.5px; color:#3A4566; }
      `}</style>

      <div className="ks-overlay" onClick={() => setOpen(false)}>
        <div className="ks-panel" onClick={(e) => e.stopPropagation()}>
          <div className="ks-header">
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Command size={14} color="#22D3EE"/>
              </div>
              <span className="ks-title">Keyboard Shortcuts</span>
            </div>
            <button className="ks-close" onClick={() => setOpen(false)}><X size={14}/></button>
          </div>

          <div className="ks-section">
            <div className="ks-section-label">Navigation</div>
            {[
              { keys:["G", "D"], desc:"Dashboard" },
              { keys:["G", "A"], desc:"Applications" },
              { keys:["G", "C"], desc:"Calendar" },
              { keys:["G", "R"], desc:"Roadmap" },
              { keys:["G", "P"], desc:"Profile" },
            ].map(s => (
              <div className="ks-row" key={s.desc}>
                <span className="ks-desc">Go to {s.desc}</span>
                <div className="ks-key">
                  {s.keys.map((k, i) => (
                    <span key={k} style={{ display:"flex", alignItems:"center", gap:4 }}>
                      {i > 0 && <span style={{ fontSize:10, color:"#3A4566" }}>then</span>}
                      <span className="kbd">{k}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="ks-section" style={{ borderTop:"1px solid rgba(143,160,215,0.06)" }}>
            <div className="ks-section-label">Actions</div>
            {[
              { keys:["N"],   desc:"New application" },
              { keys:["?"],   desc:"Toggle this panel" },
              { keys:["Esc"], desc:"Close overlay / modal" },
            ].map(s => (
              <div className="ks-row" key={s.desc}>
                <span className="ks-desc">{s.desc}</span>
                <div className="ks-key">
                  {s.keys.map(k => <span key={k} className="kbd">{k}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className="ks-footer">
            <Command size={12} color="#3A4566"/>
            <span className="ks-footer-text">Press <strong style={{color:"#5A6386"}}>?</strong> anytime to toggle this panel</span>
          </div>
        </div>
      </div>
    </>
  );
}