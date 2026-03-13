// hooks/useReminders.js  — inline hook + bell component, import where needed
// Usage: import { ReminderBell } from "./Reminders"

import { useState, useEffect, useCallback } from "react";
import { Bell, X, Calendar, Clock, CheckCheck, Trash2, BriefcaseBusiness } from "lucide-react";

const EVENT_COLORS = {
  oa:        "#f59e0b",
  interview: "#22D3EE",
  deadline:  "#ef4444",
  offer:     "#10b981",
  other:     "#8FA0D7",
};
const EVENT_LABELS = {
  oa:"Online Assessment", interview:"Interview", deadline:"Deadline", offer:"Offer Deadline", other:"Other",
};

function getDaysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr+"T00:00:00"); d.setHours(0,0,0,0);
  return Math.round((d - today) / 86400000);
}

function formatTime(t) {
  if (!t) return "";
  const [h,m] = t.split(":").map(Number);
  return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;
}

export function useReminders(userEmail) {
  const eventsKey = `placetracker_events_${userEmail}`;
  const dismissKey = `placetracker_dismissed_${userEmail}`;

  const getEvents = useCallback(() => JSON.parse(localStorage.getItem(eventsKey)||"[]"), [eventsKey]);
  const getDismissed = useCallback(() => JSON.parse(localStorage.getItem(dismissKey)||"[]"), [dismissKey]);

  const getActive = useCallback(() => {
    const dismissed = getDismissed();
    return getEvents().filter(e => {
      const days = getDaysUntil(e.date);
      return days >= 0 && days <= 3 && !dismissed.includes(e.id);
    }).sort((a,b)=>a.date.localeCompare(b.date));
  }, [getEvents, getDismissed]);

  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    setReminders(getActive());
    const id = setInterval(() => setReminders(getActive()), 60000);
    return () => clearInterval(id);
  }, [getActive]);

  const dismiss = (id) => {
    const d = getDismissed();
    if (!d.includes(id)) {
      localStorage.setItem(dismissKey, JSON.stringify([...d, id]));
      setReminders(prev => prev.filter(r => r.id !== id));
    }
  };

  const dismissAll = () => {
    const ids = reminders.map(r=>r.id);
    const d = getDismissed();
    localStorage.setItem(dismissKey, JSON.stringify([...d, ...ids]));
    setReminders([]);
  };

  return { reminders, dismiss, dismissAll };
}

export function ReminderBell({ userEmail }) {
  const { reminders, dismiss, dismissAll } = useReminders(userEmail);
  const [open, setOpen] = useState(false);

  const count = reminders.length;

  return (
    <>
      <style>{`
        .bell-wrap { position:relative; }
        .bell-btn { width:38px; height:38px; border-radius:999px; background:rgba(143,160,215,0.06); border:1px solid rgba(143,160,215,0.15); color:#8FA0D7; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; position:relative; font-family:Montserrat,sans-serif; }
        .bell-btn:hover { color:#22D3EE; border-color:rgba(34,211,238,0.3); background:rgba(34,211,238,0.05); }
        .bell-badge { position:absolute; top:-3px; right:-3px; width:17px; height:17px; border-radius:50%; background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; border:2px solid #02050E; animation:pulseBadge 2s ease-in-out infinite; }
        @keyframes pulseBadge { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 5px rgba(239,68,68,0)} }

        .notif-dropdown {
          position:absolute; top:calc(100% + 10px); right:0; width:340px; z-index:9999;
          background:rgba(10,18,42,0.97); backdrop-filter:blur(24px);
          border:1px solid rgba(143,160,215,0.18); border-radius:16px;
          box-shadow:0 20px 60px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.05);
          animation:dropIn 0.2s cubic-bezier(0.25,1,0.5,1);
          font-family:Montserrat,sans-serif;
          overflow:hidden;
        }
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:none} }

        .notif-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px 10px; border-bottom:1px solid rgba(143,160,215,0.1); }
        .notif-title { font-family:'EB Garamond',serif; font-size:16px; font-weight:600; color:#E5E9F7; }

        .notif-item { display:flex; align-items:flex-start; gap:12px; padding:12px 16px; border-bottom:1px solid rgba(143,160,215,0.06); transition:background 0.15s; cursor:default; }
        .notif-item:last-child { border-bottom:none; }
        .notif-item:hover { background:rgba(255,255,255,0.025); }

        .notif-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px; }
        .notif-dismiss { width:22px; height:22px; border-radius:6px; border:1px solid rgba(143,160,215,0.15); background:transparent; color:#5A6386; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; flex-shrink:0; margin-top:1px; }
        .notif-dismiss:hover { border-color:rgba(239,68,68,0.3); color:#ef4444; }

        .notif-urgency { font-size:10px; font-weight:700; padding:2px 8px; border-radius:999px; border:1px solid; }

        .notif-empty { padding:32px 20px; text-align:center; color:#5A6386; font-size:13px; }

        .dismiss-all-btn { font-size:11px; font-weight:600; color:#8FA0D7; background:transparent; border:none; cursor:pointer; display:flex; align-items:center; gap:4px; padding:4px 8px; border-radius:6px; transition:color 0.15s; font-family:Montserrat,sans-serif; }
        .dismiss-all-btn:hover { color:#22D3EE; }

        .notif-backdrop { position:fixed; inset:0; z-index:9998; }
      `}</style>

      <div className="bell-wrap">
        <button className="bell-btn" onClick={() => setOpen(o=>!o)}>
          <Bell size={17}/>
          {count > 0 && <span className="bell-badge">{count > 9 ? "9+" : count}</span>}
        </button>

        {open && (
          <>
            <div className="notif-backdrop" onClick={() => setOpen(false)}/>
            <div className="notif-dropdown">
              <div className="notif-header">
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Bell size={14} color="#22D3EE"/>
                  <span className="notif-title">Reminders</span>
                  {count > 0 && <span style={{ fontSize:10, fontWeight:700, color:"#ef4444", background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:999, padding:"1px 7px" }}>{count}</span>}
                </div>
                {count > 0 && (
                  <button className="dismiss-all-btn" onClick={dismissAll}>
                    <CheckCheck size={12}/> Dismiss all
                  </button>
                )}
              </div>

              <div style={{ maxHeight:360, overflowY:"auto" }}>
                {count === 0 ? (
                  <div className="notif-empty">
                    <Bell size={28} style={{ opacity:0.2, margin:"0 auto 10px", display:"block" }}/>
                    No upcoming reminders.<br/>
                    <span style={{ fontSize:11, color:"#3A4566" }}>Events in the next 3 days will appear here.</span>
                  </div>
                ) : reminders.map(r => {
                  const days = getDaysUntil(r.date);
                  const color = EVENT_COLORS[r.type] || "#8FA0D7";
                  const urgency = days === 0 ? { label:"Today", color:"#ef4444", bg:"rgba(239,68,68,0.12)", border:"rgba(239,68,68,0.3)" }
                    : days === 1 ? { label:"Tomorrow", color:"#f59e0b", bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.25)" }
                    : { label:`In ${days} days`, color:"#8FA0D7", bg:"rgba(143,160,215,0.08)", border:"rgba(143,160,215,0.2)" };
                  return (
                    <div key={r.id} className="notif-item">
                      <div className="notif-dot" style={{ background:color, boxShadow:`0 0 6px ${color}80` }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
                          <span style={{ fontSize:11, color, fontWeight:600 }}>{EVENT_LABELS[r.type]||"Event"}</span>
                          <span className="notif-urgency" style={{ color:urgency.color, background:urgency.bg, borderColor:urgency.border }}>{urgency.label}</span>
                        </div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#E5E9F7", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                          {r.company && <span style={{ fontSize:11.5, color:"#8FA0D7", display:"flex", alignItems:"center", gap:3 }}><BriefcaseBusiness size={10}/>{r.company}</span>}
                          {r.time && <span style={{ fontSize:11.5, color:"#5A6386", display:"flex", alignItems:"center", gap:3 }}><Clock size={10}/>{formatTime(r.time)}</span>}
                        </div>
                      </div>
                      <button className="notif-dismiss" onClick={()=>dismiss(r.id)}><X size={11}/></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}