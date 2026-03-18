import { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Plus, X, Calendar,
  Clock, Sparkles, Bell, Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const EVENT_TYPES = {
  oa:        { label:"Online Assessment", color:"#f59e0b", bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.3)"  },
  interview: { label:"Interview",         color:"#22D3EE", bg:"rgba(34,211,238,0.12)",  border:"rgba(34,211,238,0.3)"  },
  deadline:  { label:"Deadline",          color:"#ef4444", bg:"rgba(239,68,68,0.12)",   border:"rgba(239,68,68,0.3)"   },
  offer:     { label:"Offer Deadline",    color:"#10b981", bg:"rgba(16,185,129,0.12)",  border:"rgba(16,185,129,0.3)"  },
  other:     { label:"Other",             color:"#8FA0D7", bg:"rgba(143,160,215,0.1)",  border:"rgba(143,160,215,0.25)"},
};

const EMPTY_EVENT = { title:"", company:"", type:"interview", date:"", time:"", notes:"" };

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }
function toDateStr(year, month, day) { return `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; }
function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
}

// Map backend row → frontend shape
const fromApi = (row) => ({
  id:      row.id,
  title:   row.title,
  company: row.company || "",
  type:    row.type || "other",
  date:    row.date ? row.date.slice(0, 10) : "",
  time:    row.time || "",
  notes:   row.notes || "",
});

// Map frontend form → backend payload
const toApiPayload = (form) => ({
  title:   form.title,
  company: form.company || null,
  type:    form.type || "other",
  date:    form.date,
  time:    form.time || null,
  notes:   form.notes || null,
});

function EventModal({ open, onClose, onSave, initial, applications }) {
  const [form, setForm] = useState(initial || EMPTY_EVENT);
  useEffect(() => { if (open) setForm(initial || EMPTY_EVENT); }, [open]);
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) { toast.error("Title and date are required"); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth:480 }} onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"rgba(34,211,238,0.12)", border:"1px solid rgba(34,211,238,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Calendar size={16} color="#22D3EE"/>
            </div>
            <span className="modal-title">{initial?.id ? "Edit Event" : "Add Event"}</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"span 2", display:"flex", flexDirection:"column", gap:6 }}>
              <label className="field-label">Event Title <span style={{color:"#ef4444"}}>*</span></label>
              <input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="e.g. Google SDE Interview Round 1" className="field-input"/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label className="field-label">Company</label>
              <select value={form.company} onChange={(e)=>setForm({...form,company:e.target.value})} className="field-input">
                <option value="">— None —</option>
                {[...new Set(applications.map(a=>a.company))].map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label className="field-label">Type</label>
              <select value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})} className="field-input">
                {Object.entries(EVENT_TYPES).map(([k,v])=>(
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label className="field-label">Date <span style={{color:"#ef4444"}}>*</span></label>
              <input type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} className="field-input date-input"/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label className="field-label">Time</label>
              <input type="time" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} className="field-input date-input"/>
            </div>
            <div style={{ gridColumn:"span 2", display:"flex", flexDirection:"column", gap:6 }}>
              <label className="field-label">Notes</label>
              <textarea value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} placeholder="Preparation notes, links, contact info..." className="field-input" style={{ height:72, padding:"10px 14px", resize:"vertical" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:12, marginTop:4 }}>
            <button type="button" className="btn-ghost" style={{flex:1}} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" style={{flex:1}}>{initial?.id ? "Save Changes" : "Add Event"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventDetailPanel({ event, onClose, onEdit, onDelete }) {
  if (!event) return null;
  const cfg = EVENT_TYPES[event.type] || EVENT_TYPES.other;
  const date = new Date(event.date + "T12:00:00");
  const dateStr = date.toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  return (
    <div className="detail-panel">
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
        <span className="event-type-pill" style={{ color:cfg.color, background:cfg.bg, borderColor:cfg.border }}>{cfg.label}</span>
        <button className="modal-close" onClick={onClose}><X size={16}/></button>
      </div>
      <h3 style={{ fontFamily:"EB Garamond, serif", fontSize:22, fontWeight:600, color:"#F8FAFF", marginBottom:6, lineHeight:1.3 }}>{event.title}</h3>
      {event.company && <p style={{ color:"#22D3EE", fontSize:13.5, fontWeight:600, marginBottom:16 }}>{event.company}</p>}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#8FA0D7" }}>
          <Calendar size={14} color="#5A6386"/> {dateStr}
        </div>
        {event.time && (
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#8FA0D7" }}>
            <Clock size={14} color="#5A6386"/> {formatTime(event.time)}
          </div>
        )}
      </div>
      {event.notes && (
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(143,160,215,0.12)", borderRadius:10, padding:"12px 14px", fontSize:13, color:"#8FA0D7", lineHeight:1.7, marginBottom:16 }}>
          {event.notes}
        </div>
      )}
      <div style={{ display:"flex", gap:10 }}>
        <button className="btn-ghost" style={{ flex:1, height:36, fontSize:12 }} onClick={()=>onEdit(event)}>Edit</button>
        <button onClick={()=>onDelete(event.id)} style={{ flex:1, height:36, borderRadius:999, fontSize:12, fontWeight:600, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontFamily:"Montserrat, sans-serif" }}>
          <Trash2 size={12}/> Delete
        </button>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", fn, { passive:true });

    // Fetch events and applications in parallel
    Promise.all([
      api.get("/events"),
      api.get("/applications"),
    ]).then(([evRes, apRes]) => {
      setEvents(evRes.data.map(fromApi));
      setApplications(apRes.data);
    }).catch(() => toast.error("Failed to load calendar data"))
      .finally(() => setLoading(false));

    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const handleSave = async (form) => {
    try {
      if (editTarget) {
        const res = await api.put(`/events/${editTarget.id}`, toApiPayload(form));
        setEvents(prev => prev.map(e => e.id === editTarget.id ? fromApi(res.data) : e));
        toast.success("Event updated!");
        setEditTarget(null);
      } else {
        const res = await api.post("/events", toApiPayload(form));
        setEvents(prev => [...prev, fromApi(res.data)]);
        toast.success("Event added!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
      setSelectedEvent(null);
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const openAdd = (dateStr) => { setEditTarget(null); setModalOpen(true); setSelectedDate(dateStr); };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); };
  const eventsOnDate = (dateStr) => events.filter(e => e.date === dateStr);
  const upcoming = events
    .filter(e => { const d = new Date(e.date+"T12:00:00"); return d >= today && d <= new Date(today.getTime() + 7*86400000); })
    .sort((a,b) => a.date.localeCompare(b.date));

  return (
    <div style={{ minHeight:"100vh", background:"#02050E", overflowX:"hidden", paddingTop:80, fontFamily:"Montserrat, sans-serif", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        :root { --mouse-x:50vw; --mouse-y:50vh; }
        .cal-mouse-glow { position:fixed; inset:0; pointer-events:none; z-index:1; background:radial-gradient(circle 500px at var(--mouse-x) var(--mouse-y),rgba(34,211,238,0.055),transparent 55%); mix-blend-mode:screen; }
        .cal-grid-bg { position:fixed; inset:0; pointer-events:none; z-index:0; background-image:linear-gradient(rgba(143,160,215,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(143,160,215,0.035) 1px,transparent 1px); background-size:50px 50px; }
        .cal-orb1 { position:fixed; top:-150px; left:-150px; width:480px; height:480px; border-radius:50%; background:radial-gradient(circle,rgba(34,211,238,0.09),transparent 60%); filter:blur(80px); pointer-events:none; z-index:0; }
        .cal-orb2 { position:fixed; bottom:-200px; right:-200px; width:550px; height:550px; border-radius:50%; background:radial-gradient(circle,rgba(94,119,192,0.11),transparent 60%); filter:blur(90px); pointer-events:none; z-index:0; }
        .page-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(34,211,238,0.08); border:1px solid rgba(34,211,238,0.2); color:#22D3EE; font-size:11px; font-weight:600; padding:4px 12px; border-radius:999px; letter-spacing:0.5px; margin-bottom:6px; }
        .btn-add-hero { background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; border:none; padding:11px 24px; border-radius:999px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all 0.3s cubic-bezier(0.25,1,0.5,1); box-shadow:0 6px 16px rgba(34,211,238,0.25); font-family:Montserrat,sans-serif; flex-shrink:0; }
        .btn-add-hero:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(34,211,238,0.4); }
        .cal-shell { background:rgba(15,23,42,0.6); backdrop-filter:blur(16px); border:1px solid rgba(143,160,215,0.13); border-radius:18px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.04); }
        .month-nav { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 16px; border-bottom:1px solid rgba(143,160,215,0.08); }
        .nav-btn { width:34px; height:34px; border-radius:9px; border:1px solid rgba(143,160,215,0.15); background:transparent; color:#8FA0D7; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .nav-btn:hover { border-color:rgba(34,211,238,0.3); color:#22D3EE; background:rgba(34,211,238,0.05); }
        .day-headers { display:grid; grid-template-columns:repeat(7,1fr); border-bottom:1px solid rgba(143,160,215,0.06); }
        .day-header { padding:10px 0; text-align:center; font-size:11px; font-weight:600; color:#5A6386; letter-spacing:0.8px; text-transform:uppercase; }
        .cal-cells { display:grid; grid-template-columns:repeat(7,1fr); }
        .cal-cell { min-height:88px; padding:8px 8px 6px; border-right:1px solid rgba(143,160,215,0.05); border-bottom:1px solid rgba(143,160,215,0.05); position:relative; cursor:pointer; transition:background 0.15s; }
        .cal-cell:hover { background:rgba(255,255,255,0.025); }
        .cal-cell.today { background:rgba(34,211,238,0.04); }
        .cal-cell.other-month { opacity:0.3; }
        .cal-cell:nth-child(7n) { border-right:none; }
        .cell-day { font-size:12px; font-weight:600; color:#8FA0D7; margin-bottom:4px; width:24px; height:24px; display:flex; align-items:center; justify-content:center; border-radius:50%; }
        .cell-day.today-num { background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; font-weight:700; box-shadow:0 0 12px rgba(34,211,238,0.4); }
        .cal-event-dot { font-size:10px; font-weight:600; padding:2px 7px; border-radius:4px; margin-bottom:2px; border:1px solid; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; cursor:pointer; display:block; }
        .detail-panel { background:rgba(15,23,42,0.8); backdrop-filter:blur(16px); border:1px solid rgba(143,160,215,0.13); border-radius:16px; padding:22px; box-shadow:0 10px 30px rgba(0,0,0,0.4); }
        .sidebar-card { background:rgba(15,23,42,0.6); backdrop-filter:blur(14px); border:1px solid rgba(143,160,215,0.12); border-radius:16px; padding:20px; box-shadow:0 8px 24px rgba(0,0,0,0.35); }
        .upcoming-item { padding:12px 14px; border-radius:10px; border:1px solid rgba(143,160,215,0.08); background:rgba(255,255,255,0.02); margin-bottom:8px; cursor:pointer; transition:all 0.2s; }
        .upcoming-item:hover { background:rgba(255,255,255,0.05); border-color:rgba(143,160,215,0.18); transform:translateX(3px); }
        .event-type-pill { font-size:11px; font-weight:600; padding:3px 10px; border-radius:999px; border:1px solid; }
        .modal-overlay { position:fixed; inset:0; z-index:9000; background:rgba(2,5,14,0.75); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:24px; }
        .modal-box { background:rgba(10,18,42,0.96); backdrop-filter:blur(24px); border:1px solid rgba(143,160,215,0.18); border-radius:20px; padding:28px; width:100%; box-shadow:0 40px 100px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.05); font-family:Montserrat,sans-serif; animation:modalIn 0.25s cubic-bezier(0.25,1,0.5,1); }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(12px); } to { opacity:1; transform:none; } }
        .modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .modal-title { font-family:'EB Garamond',serif; font-size:20px; font-weight:600; color:#E5E9F7; }
        .modal-close { width:32px; height:32px; border-radius:8px; border:1px solid rgba(143,160,215,0.15); background:transparent; color:#8FA0D7; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
        .modal-close:hover { border-color:rgba(239,68,68,0.35); color:#ef4444; }
        .field-label { font-size:12px; font-weight:600; color:#8FA0D7; letter-spacing:0.3px; }
        .field-input { width:100%; height:40px; padding:0 12px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(143,160,215,0.15); color:#E5E9F7; font-size:13px; outline:none; transition:border-color 0.2s; font-family:Montserrat,sans-serif; box-sizing:border-box; }
        .field-input::placeholder { color:#5A6386; }
        .field-input:focus { border-color:rgba(34,211,238,0.4); box-shadow:0 0 0 3px rgba(34,211,238,0.06); }
        .date-input { color-scheme:dark; }
        select.field-input option { background:#0A1228; }
        .btn-ghost { height:40px; border-radius:999px; font-size:13px; font-weight:600; background:transparent; border:1px solid rgba(143,160,215,0.2); color:#8FA0D7; cursor:pointer; transition:all 0.2s; font-family:Montserrat,sans-serif; }
        .btn-ghost:hover { border-color:rgba(143,160,215,0.4); color:#E5E9F7; }
        .btn-submit { height:40px; border-radius:999px; font-size:13px; font-weight:700; background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; border:none; cursor:pointer; transition:all 0.3s; box-shadow:0 6px 16px rgba(34,211,238,0.25); font-family:Montserrat,sans-serif; }
        .btn-submit:hover { transform:translateY(-1px); box-shadow:0 10px 24px rgba(34,211,238,0.4); }
        .spinner { width:28px; height:28px; border:2.5px solid rgba(34,211,238,0.15); border-top-color:#22D3EE; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (max-width: 900px) { .cal-layout { flex-direction:column !important; } .cal-sidebar { width:100% !important; } }
      `}</style>

      <div className="cal-grid-bg"/>
      <div className="cal-orb1"/>
      <div className="cal-orb2"/>
      <div className="cal-mouse-glow"/>

      <div style={{ maxWidth:1300, margin:"0 auto", padding:"40px 24px", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"opacity 0.6s ease, transform 0.6s ease" }}>
          <div>
            <div className="page-badge"><Sparkles size={10}/> Schedule</div>
            <h1 style={{ fontFamily:"EB Garamond, serif", fontSize:"clamp(28px,3.5vw,42px)", fontWeight:600, color:"#F8FAFF", lineHeight:1.2, marginTop:4 }}>Interview Calendar</h1>
            <p style={{ color:"#8FA0D7", fontSize:13.5, marginTop:6 }}>Track OAs, interviews, and deadlines in one place</p>
          </div>
          <button className="btn-add-hero" onClick={() => openAdd("")}><Plus size={15}/> Add Event</button>
        </div>

        <div className="cal-layout" style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
          <div style={{ flex:1, minWidth:0, opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)", transition:"opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s" }}>
            <div className="cal-shell">
              <div className="month-nav">
                <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={16}/></button>
                <div style={{ fontFamily:"EB Garamond, serif", fontSize:22, fontWeight:600, color:"#F8FAFF" }}>
                  {MONTHS[month]} <span style={{ color:"#5A6386" }}>{year}</span>
                </div>
                <button className="nav-btn" onClick={nextMonth}><ChevronRight size={16}/></button>
              </div>
              <div className="day-headers">
                {DAYS.map(d => <div key={d} className="day-header">{d}</div>)}
              </div>
              <div className="cal-cells">
                {loading ? (
                  <div style={{ gridColumn:"span 7", padding:60, display:"flex", flexDirection:"column", alignItems:"center", gap:12, color:"#5A6386" }}>
                    <div className="spinner"/>
                    <span style={{ fontSize:13 }}>Loading events...</span>
                  </div>
                ) : Array.from({ length: totalCells }, (_, i) => {
                  const dayNum = i - firstDay + 1;
                  const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                  const dateStr = isCurrentMonth ? toDateStr(year, month, dayNum) : "";
                  const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
                  const dayEvents = dateStr ? eventsOnDate(dateStr) : [];
                  return (
                    <div key={i} className={`cal-cell${isToday?" today":""}${!isCurrentMonth?" other-month":""}`} onClick={() => isCurrentMonth && openAdd(dateStr)}>
                      <div className={`cell-day${isToday?" today-num":""}`} style={{ color: isToday ? undefined : isCurrentMonth ? "#C3CCEB" : "#3A4566" }}>
                        {isCurrentMonth ? dayNum : ""}
                      </div>
                      {dayEvents.slice(0,3).map(ev => {
                        const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.other;
                        return (
                          <span key={ev.id} className="cal-event-dot" style={{ color:cfg.color, background:cfg.bg, borderColor:cfg.border }} onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}>
                            {ev.title}
                          </span>
                        );
                      })}
                      {dayEvents.length > 3 && <span style={{ fontSize:10, color:"#5A6386", paddingLeft:2 }}>+{dayEvents.length-3} more</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:14, paddingLeft:2 }}>
              {Object.entries(EVENT_TYPES).map(([k,v]) => (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:v.color, boxShadow:`0 0 6px ${v.color}80` }}/>
                  <span style={{ fontSize:11.5, color:"#5A6386" }}>{v.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cal-sidebar" style={{ width:300, flexShrink:0, display:"flex", flexDirection:"column", gap:16, opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)", transition:"opacity 0.6s ease 0.18s, transform 0.6s ease 0.18s" }}>
            {selectedEvent && (
              <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)}
                onEdit={(ev) => { setEditTarget(ev); setModalOpen(true); setSelectedEvent(null); }}
                onDelete={handleDelete}
              />
            )}
            <div className="sidebar-card">
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <Bell size={15} color="#22D3EE"/>
                <span style={{ fontFamily:"EB Garamond, serif", fontSize:17, fontWeight:600, color:"#E5E9F7" }}>Next 7 Days</span>
                {upcoming.length > 0 && <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:"#22D3EE", background:"rgba(34,211,238,0.1)", border:"1px solid rgba(34,211,238,0.2)", borderRadius:999, padding:"2px 8px" }}>{upcoming.length}</span>}
              </div>
              {upcoming.length > 0 ? upcoming.map(ev => {
                const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.other;
                const d = new Date(ev.date+"T12:00:00");
                const isEvtToday = ev.date === toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
                return (
                  <div key={ev.id} className="upcoming-item" onClick={() => setSelectedEvent(ev)}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                      <span className="event-type-pill" style={{ color:cfg.color, background:cfg.bg, borderColor:cfg.border }}>{cfg.label}</span>
                      <span style={{ fontSize:11, color: isEvtToday ? "#22D3EE" : "#5A6386", fontWeight: isEvtToday ? 700 : 400 }}>
                        {isEvtToday ? "Today" : d.toLocaleDateString("en-IN",{month:"short",day:"numeric"})}
                      </span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#E5E9F7", marginBottom:2 }}>{ev.title}</div>
                    {ev.company && <div style={{ fontSize:11.5, color:"#8FA0D7" }}>{ev.company}</div>}
                    {ev.time && <div style={{ fontSize:11, color:"#5A6386", marginTop:4 }}>{formatTime(ev.time)}</div>}
                  </div>
                );
              }) : <div style={{ textAlign:"center", padding:"24px 0", color:"#5A6386", fontSize:13 }}>No events in the next 7 days</div>}
            </div>
            <div className="sidebar-card" style={{ padding:"16px 20px" }}>
              <div style={{ fontFamily:"EB Garamond, serif", fontSize:16, fontWeight:600, color:"#E5E9F7", marginBottom:12 }}>Event Summary</div>
              {Object.entries(EVENT_TYPES).map(([k,v]) => {
                const count = events.filter(e=>e.type===k).length;
                return (
                  <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:12.5, color:"#8FA0D7" }}>{v.label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color: count > 0 ? v.color : "#3A4566" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        initial={editTarget || (selectedDate ? { ...EMPTY_EVENT, date: selectedDate } : EMPTY_EVENT)}
        applications={applications}
      />
    </div>
  );
}