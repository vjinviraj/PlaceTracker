import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
;
import {
  Plus, Search, Pencil, Trash2, ExternalLink,
  BriefcaseBusiness, Filter, X, ChevronDown, ChevronUp,
  FileText, StickyNote, Link2, Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";



const COLORS = {
  Applied: "#5E77C0", Interview: "#22D3EE", Offer: "#10b981", Rejected: "#ef4444",
};
const STATUSES = ["All","Applied","Interview","Offer","Rejected"];
const EMPTY_FORM = { company:"", role:"", link:"", dateApplied:"", status:"Applied", notes:"", resumeLabel:"", resumeLink:"" };

/* ─── App Modal ─── */
function AppModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [tab, setTab] = useState("basic");
  useEffect(() => { if (open) { setForm(initial || EMPTY_FORM); setTab("basic"); } }, [open]);
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company || !form.role || !form.dateApplied) { toast.error("Please fill in required fields"); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth:520 }} onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"rgba(34,211,238,0.12)", border:"1px solid rgba(34,211,238,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <BriefcaseBusiness size={16} color="#22D3EE"/>
            </div>
            <span className="modal-title">{initial?.id ? "Edit Application" : "Add Application"}</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18}/></button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:20, background:"rgba(255,255,255,0.03)", borderRadius:10, padding:4 }}>
          {[["basic","Details"],["notes","Notes"],["resume","Resume"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ flex:1, height:32, borderRadius:7, border:"none", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"Montserrat,sans-serif", background: tab===k ? "rgba(34,211,238,0.15)" : "transparent", color: tab===k ? "#22D3EE" : "#8FA0D7", boxShadow: tab===k ? "0 0 0 1px rgba(34,211,238,0.25)" : "none" }}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === "basic" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
              <div style={{ gridColumn:"span 2", display:"flex", flexDirection:"column", gap:6 }}>
                <label className="field-label">Company <span style={{color:"#ef4444"}}>*</span></label>
                <input name="company" placeholder="e.g. Google" value={form.company} onChange={(e)=>setForm({...form,company:e.target.value})} className="field-input"/>
              </div>
              <div style={{ gridColumn:"span 2", display:"flex", flexDirection:"column", gap:6 }}>
                <label className="field-label">Job Role <span style={{color:"#ef4444"}}>*</span></label>
                <input name="role" placeholder="e.g. Software Engineer" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className="field-input"/>
              </div>
              <div style={{ gridColumn:"span 2", display:"flex", flexDirection:"column", gap:6 }}>
                <label className="field-label">Application Link</label>
                <input name="link" placeholder="https://..." value={form.link} onChange={(e)=>setForm({...form,link:e.target.value})} className="field-input"/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label className="field-label">Date Applied <span style={{color:"#ef4444"}}>*</span></label>
                <input name="dateApplied" type="date" value={form.dateApplied} onChange={(e)=>setForm({...form,dateApplied:e.target.value})} className="field-input date-input"/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label className="field-label">Status</label>
                <select name="status" value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})} className="field-input">
                  {STATUSES.filter(s=>s!=="All").map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          {tab === "notes" && (
            <div style={{ marginBottom:20, display:"flex", flexDirection:"column", gap:6 }}>
              <label className="field-label">Notes & Interview Feedback</label>
              <textarea
                value={form.notes}
                onChange={(e)=>setForm({...form,notes:e.target.value})}
                placeholder="Recruiter name, interview rounds, feedback, next steps, links to Glassdoor reviews..."
                className="field-input"
                style={{ height:160, padding:"12px 14px", resize:"vertical", lineHeight:1.7 }}
              />
              <p style={{ fontSize:11, color:"#5A6386" }}>Use this to track everything about this application — rounds, contact info, prep notes.</p>
            </div>
          )}

          {tab === "resume" && (
            <div style={{ marginBottom:20, display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label className="field-label">Resume Version Label</label>
                <input value={form.resumeLabel} onChange={(e)=>setForm({...form,resumeLabel:e.target.value})} placeholder='e.g. "SDE Resume v3 - Jan 2025"' className="field-input"/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label className="field-label">Resume Link</label>
                <input value={form.resumeLink} onChange={(e)=>setForm({...form,resumeLink:e.target.value})} placeholder="Google Drive / Notion / Dropbox link..." className="field-input"/>
              </div>
              <div style={{ background:"rgba(34,211,238,0.05)", border:"1px solid rgba(34,211,238,0.15)", borderRadius:10, padding:"12px 14px" }}>
                <p style={{ fontSize:12.5, color:"#8FA0D7", lineHeight:1.7 }}>
                  Link the exact resume version you sent for this application. This helps you track which version performed best across different companies.
                </p>
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:12 }}>
            <button type="button" className="btn-ghost" style={{flex:1}} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" style={{flex:1}}>{initial?.id ? "Save Changes" : "Add Application"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Dialog ─── */
function DeleteDialog({ open, onClose, onConfirm, company }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth:380 }} onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Trash2 size={16} color="#ef4444"/>
            </div>
            <span className="modal-title">Delete Application</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18}/></button>
        </div>
        <p style={{ color:"#8FA0D7", fontSize:14, lineHeight:1.7, marginBottom:24 }}>
          Are you sure you want to delete the application to <strong style={{color:"#E5E9F7"}}>{company}</strong>? This cannot be undone.
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <button className="btn-ghost" style={{flex:1}} onClick={onClose}>Cancel</button>
          <button className="btn-danger" style={{flex:1}} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Expandable Row Detail ─── */
function RowDetail({ app }) {
  const color = COLORS[app.status];
  const hasNotes = app.notes?.trim();
  const hasResume = app.resumeLabel || app.resumeLink;
  if (!hasNotes && !hasResume) return (
    <div style={{ padding:"12px 20px 14px", color:"#5A6386", fontSize:13, fontStyle:"italic" }}>No notes or resume linked yet.</div>
  );
  return (
    <div style={{ padding:"14px 20px 16px", display:"grid", gridTemplateColumns: hasNotes && hasResume ? "1fr 1fr" : "1fr", gap:16 }}>
      {hasNotes && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <StickyNote size={12} color="#8FA0D7"/>
            <span style={{ fontSize:11, fontWeight:700, color:"#8FA0D7", letterSpacing:0.5, textTransform:"uppercase" }}>Notes</span>
          </div>
          <p style={{ fontSize:13, color:"#C3CCEB", lineHeight:1.75, whiteSpace:"pre-wrap" }}>{app.notes}</p>
        </div>
      )}
      {hasResume && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <FileText size={12} color="#8FA0D7"/>
            <span style={{ fontSize:11, fontWeight:700, color:"#8FA0D7", letterSpacing:0.5, textTransform:"uppercase" }}>Resume</span>
          </div>
          {app.resumeLabel && <p style={{ fontSize:13, color:"#E5E9F7", fontWeight:600, marginBottom:4 }}>{app.resumeLabel}</p>}
          {app.resumeLink && (
            <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12.5, color:"#22D3EE", textDecoration:"none", padding:"5px 12px", borderRadius:8, background:"rgba(34,211,238,0.07)", border:"1px solid rgba(34,211,238,0.2)", transition:"all 0.2s" }}>
              <Link2 size={12}/> View Resume
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main ─── */
export default function Applications() {
  const { user } = useAuth();
  const storageKey = `placetracker_apps_${user?.email}`;

  const [apps, setApps] = useState(() => JSON.parse(localStorage.getItem(storageKey) || "[]"));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", fn, { passive:true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const save = (updated) => { setApps(updated); localStorage.setItem(storageKey, JSON.stringify(updated)); };
  const handleAdd = (form) => { save([{ ...form, id:Date.now().toString() }, ...apps]); toast.success("Application added!"); setModalOpen(false); };
  const handleEdit = (form) => { save(apps.map(a => a.id===editTarget.id ? {...form,id:a.id} : a)); toast.success("Application updated!"); setEditTarget(null); };
  const handleDelete = () => { save(apps.filter(a => a.id!==deleteTarget.id)); toast.success("Application deleted"); setDeleteTarget(null); };

  const filtered = apps.filter(a => {
    const ms = a.company.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter==="All" || a.status===statusFilter;
    return ms && mf;
  });

  const toggleExpand = (id) => setExpandedId(expandedId===id ? null : id);

  return (
    <div style={{ minHeight:"100vh", background:"#02050E", overflowX:"hidden", paddingTop:80, fontFamily:"Montserrat, sans-serif", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        :root { --mouse-x:50vw; --mouse-y:50vh; }
        .ap-mouse-glow { position:fixed; inset:0; pointer-events:none; z-index:1; background:radial-gradient(circle 500px at var(--mouse-x) var(--mouse-y),rgba(34,211,238,0.055),transparent 55%); mix-blend-mode:screen; }
        .ap-grid { position:fixed; inset:0; pointer-events:none; z-index:0; background-image:linear-gradient(rgba(143,160,215,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(143,160,215,0.035) 1px,transparent 1px); background-size:50px 50px; mask-image:linear-gradient(to bottom,black 0%,transparent 100%); }
        .ap-orb1 { position:fixed; top:-150px; left:-150px; width:480px; height:480px; border-radius:50%; background:radial-gradient(circle,rgba(34,211,238,0.1),transparent 60%); filter:blur(80px); pointer-events:none; z-index:0; }
        .ap-orb2 { position:fixed; bottom:-200px; right:-200px; width:550px; height:550px; border-radius:50%; background:radial-gradient(circle,rgba(94,119,192,0.12),transparent 60%); filter:blur(100px); pointer-events:none; z-index:0; }
        .page-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(34,211,238,0.08); border:1px solid rgba(34,211,238,0.2); color:#22D3EE; font-size:11px; font-weight:600; padding:4px 12px; border-radius:999px; letter-spacing:0.5px; margin-bottom:6px; }
        .btn-add-hero { background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; border:none; padding:11px 24px; border-radius:999px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all 0.3s cubic-bezier(0.25,1,0.5,1); box-shadow:0 6px 16px rgba(34,211,238,0.25); font-family:Montserrat,sans-serif; flex-shrink:0; }
        .btn-add-hero:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(34,211,238,0.4); }
        .search-wrap { position:relative; flex:1; min-width:200px; }
        .search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#5A6386; pointer-events:none; }
        .search-input { width:100%; height:42px; padding:0 14px 0 40px; background:rgba(15,23,42,0.65); border:1px solid rgba(143,160,215,0.15); border-radius:999px; color:#E5E9F7; font-size:13px; outline:none; backdrop-filter:blur(12px); transition:border-color 0.2s; font-family:Montserrat,sans-serif; box-sizing:border-box; }
        .search-input::placeholder { color:#5A6386; }
        .search-input:focus { border-color:rgba(34,211,238,0.4); box-shadow:0 0 0 3px rgba(34,211,238,0.06); }
        .filter-pill { padding:7px 16px; border-radius:999px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s ease; border:1px solid rgba(143,160,215,0.15); background:rgba(15,23,42,0.5); color:#8FA0D7; font-family:Montserrat,sans-serif; }
        .filter-pill:hover { border-color:rgba(143,160,215,0.35); color:#E5E9F7; }
        .filter-pill.active { background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; border-color:transparent; box-shadow:0 4px 12px rgba(34,211,238,0.25); }
        .table-glass { background:rgba(15,23,42,0.6); backdrop-filter:blur(16px); border:1px solid rgba(143,160,215,0.13); border-radius:16px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.04); }
        .tbl { width:100%; border-collapse:collapse; }
        .tbl-head th { text-align:left; padding:14px 20px; font-size:11px; font-weight:600; color:#5A6386; letter-spacing:0.8px; text-transform:uppercase; border-bottom:1px solid rgba(143,160,215,0.1); font-family:Montserrat,sans-serif; }
        .tbl-row td { padding:14px 20px; vertical-align:middle; border-bottom:1px solid rgba(143,160,215,0.06); }
        .tbl-row:last-child td { border-bottom:none; }
        .tbl-row:hover td { background:rgba(255,255,255,0.02); }
        .tbl-row.expanded td { border-bottom:none; background:rgba(255,255,255,0.02); }
        .expand-row td { padding:0; border-bottom:1px solid rgba(143,160,215,0.08); }
        .co-avatar { width:36px; height:36px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; border:1px solid rgba(143,160,215,0.15); }
        .status-pill { font-size:11px; font-weight:600; padding:4px 12px; border-radius:999px; border:1px solid; white-space:nowrap; }
        .action-btn { width:30px; height:30px; border-radius:8px; border:none; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.15s ease; background:transparent; color:#5A6386; }
        .action-btn:hover { background:rgba(255,255,255,0.06); color:#22D3EE; }
        .action-btn.danger:hover { color:#ef4444; background:rgba(239,68,68,0.08); }
        .expand-btn { width:28px; height:28px; border-radius:7px; border:1px solid rgba(143,160,215,0.12); background:transparent; color:#5A6386; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .expand-btn:hover { border-color:rgba(34,211,238,0.3); color:#22D3EE; }
        .expand-btn.open { border-color:rgba(34,211,238,0.3); color:#22D3EE; background:rgba(34,211,238,0.06); }
        .has-indicator { width:6px; height:6px; border-radius:50%; background:#22D3EE; box-shadow:0 0 6px rgba(34,211,238,0.6); flex-shrink:0; }
        .mob-card { background:rgba(15,23,42,0.6); backdrop-filter:blur(12px); border:1px solid rgba(143,160,215,0.13); border-radius:14px; padding:16px; margin-bottom:10px; box-shadow:0 6px 20px rgba(0,0,0,0.3); }
        .empty-state { text-align:center; padding:60px 20px; color:#5A6386; font-size:14px; }
        .modal-overlay { position:fixed; inset:0; z-index:9000; background:rgba(2,5,14,0.75); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:24px; }
        .modal-box { background:rgba(10,18,42,0.95); backdrop-filter:blur(24px); border:1px solid rgba(143,160,215,0.18); border-radius:20px; padding:28px; width:100%; box-shadow:0 40px 100px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.05); font-family:Montserrat,sans-serif; animation:modalIn 0.25s cubic-bezier(0.25,1,0.5,1); }
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
        .btn-ghost { height:40px; border-radius:999px; font-size:13px; font-weight:600; background:transparent; border:1px solid rgba(143,160,215,0.2); color:#8FA0D7; cursor:pointer; transition:all 0.2s; font-family:Montserrat,sans-serif; padding:0 16px; }
        .btn-ghost:hover { border-color:rgba(143,160,215,0.4); color:#E5E9F7; }
        .btn-submit { height:40px; border-radius:999px; font-size:13px; font-weight:700; background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; border:none; cursor:pointer; transition:all 0.3s; box-shadow:0 6px 16px rgba(34,211,238,0.25); font-family:Montserrat,sans-serif; padding:0 16px; }
        .btn-submit:hover { transform:translateY(-1px); box-shadow:0 10px 24px rgba(34,211,238,0.4); }
        .btn-danger { height:40px; border-radius:999px; font-size:13px; font-weight:700; background:rgba(239,68,68,0.85); color:#fff; border:none; cursor:pointer; transition:all 0.2s; font-family:Montserrat,sans-serif; padding:0 16px; }
        .btn-danger:hover { background:#ef4444; box-shadow:0 6px 16px rgba(239,68,68,0.35); }
        @media(max-width:768px){ .desktop-table{display:none!important;} }
        @media(min-width:769px){ .mobile-cards{display:none!important;} }
      `}</style>

      <div className="ap-grid"/>
      <div className="ap-orb1"/>
      <div className="ap-orb2"/>
      <div className="ap-mouse-glow"/>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 24px", position:"relative", zIndex:2 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32, opacity:mounted?1:0, transform:mounted?"none":"translateY(16px)", transition:"opacity 0.6s ease, transform 0.6s ease" }}>
          <div>
            <div className="page-badge"><BriefcaseBusiness size={10}/> Manage Your Pipeline</div>
            <h1 style={{ fontFamily:"EB Garamond, serif", fontSize:"clamp(28px,3.5vw,42px)", fontWeight:600, color:"#F8FAFF", lineHeight:1.2, marginTop:4 }}>Applications</h1>
            <p style={{ color:"#8FA0D7", fontSize:13.5, marginTop:6 }}>{apps.length} total · {filtered.length} shown</p>
          </div>
          <button className="btn-add-hero" onClick={() => { setEditTarget(null); setModalOpen(true); }}><Plus size={15}/> Add Application</button>
        </div>

        {/* Search + Filter */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
          <div className="search-wrap">
            <Search size={15} className="search-icon"/>
            <input placeholder="Search by company or role…" value={search} onChange={(e)=>setSearch(e.target.value)} className="search-input"/>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <Filter size={14} style={{ color:"#5A6386", flexShrink:0 }}/>
            {STATUSES.map(s => (
              <button key={s} onClick={()=>setStatusFilter(s)} className={`filter-pill${statusFilter===s?" active":""}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="desktop-table table-glass">
          <table className="tbl">
            <thead><tr className="tbl-head">
              <th>Company</th><th>Role</th><th>Date Applied</th><th>Status</th><th>Extras</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((app) => {
                const color = COLORS[app.status];
                const isExp = expandedId === app.id;
                const hasExtras = app.notes?.trim() || app.resumeLabel || app.resumeLink;
                return (
                  <>
                    <tr className={`tbl-row${isExp?" expanded":""}`} key={app.id}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div className="co-avatar" style={{ background:`${color}18`, color }}>{app.company[0].toUpperCase()}</div>
                          <span style={{ fontSize:14, fontWeight:600, color:"#E5E9F7" }}>{app.company}</span>
                        </div>
                      </td>
                      <td style={{ fontSize:13.5, color:"#8FA0D7" }}>{app.role}</td>
                      <td style={{ fontSize:13, color:"#5A6386" }}>{app.dateApplied}</td>
                      <td><span className="status-pill" style={{ color, borderColor:`${color}40`, background:`${color}12` }}>{app.status}</span></td>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          {app.notes?.trim() && <span title="Has notes" style={{ fontSize:10, color:"#8FA0D7", background:"rgba(143,160,215,0.1)", border:"1px solid rgba(143,160,215,0.2)", borderRadius:4, padding:"2px 7px" }}>Note</span>}
                          {(app.resumeLabel||app.resumeLink) && <span title="Resume linked" style={{ fontSize:10, color:"#22D3EE", background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.2)", borderRadius:4, padding:"2px 7px" }}>CV</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                          {app.link && <button className="action-btn"><a href={app.link} target="_blank" rel="noopener noreferrer" style={{ color:"inherit", display:"flex" }}><ExternalLink size={14}/></a></button>}
                          <button className="action-btn" onClick={()=>setEditTarget(app)}><Pencil size={14}/></button>
                          <button className="action-btn danger" onClick={()=>setDeleteTarget(app)}><Trash2 size={14}/></button>
                          {hasExtras && (
                            <button className={`expand-btn${isExp?" open":""}`} onClick={()=>toggleExpand(app.id)}>
                              {isExp ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExp && (
                      <tr className="expand-row" key={`${app.id}-exp`}>
                        <td colSpan={6}><RowDetail app={app}/></td>
                      </tr>
                    )}
                  </>
                );
              }) : (
                <tr><td colSpan={6}><div className="empty-state">{apps.length===0 ? "No applications yet. Click 'Add Application' to get started." : "No results match your search or filter."}</div></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mobile-cards">
          {filtered.length > 0 ? filtered.map(app => {
            const color = COLORS[app.status];
            const isExp = expandedId === app.id;
            const hasExtras = app.notes?.trim() || app.resumeLabel || app.resumeLink;
            return (
              <div className="mob-card" key={app.id}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div className="co-avatar" style={{ background:`${color}18`, color }}>{app.company[0].toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#E5E9F7" }}>{app.company}</div>
                      <div style={{ fontSize:12, color:"#8FA0D7", marginTop:2 }}>{app.role}</div>
                    </div>
                  </div>
                  <span className="status-pill" style={{ color, borderColor:`${color}40`, background:`${color}12` }}>{app.status}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"#5A6386" }}>{app.dateApplied}</span>
                  <div style={{ display:"flex", gap:4 }}>
                    {app.link && <button className="action-btn"><a href={app.link} target="_blank" rel="noopener noreferrer" style={{ color:"inherit", display:"flex" }}><ExternalLink size={14}/></a></button>}
                    <button className="action-btn" onClick={()=>setEditTarget(app)}><Pencil size={14}/></button>
                    <button className="action-btn danger" onClick={()=>setDeleteTarget(app)}><Trash2 size={14}/></button>
                    {hasExtras && <button className={`expand-btn${isExp?" open":""}`} onClick={()=>toggleExpand(app.id)}>{isExp?<ChevronUp size={13}/>:<ChevronDown size={13}/>}</button>}
                  </div>
                </div>
                {isExp && <div style={{ marginTop:12, borderTop:"1px solid rgba(143,160,215,0.08)", paddingTop:12 }}><RowDetail app={app}/></div>}
              </div>
            );
          }) : (
            <div className="empty-state">{apps.length===0 ? "No applications yet." : "No results match."}</div>
          )}
        </div>
      </div>

      <AppModal open={modalOpen} onClose={()=>{setModalOpen(false);setEditTarget(null);}} onSave={handleAdd} initial={EMPTY_FORM}/>
      <AppModal open={!!editTarget} onClose={()=>setEditTarget(null)} onSave={handleEdit} initial={editTarget}/>
      <DeleteDialog open={!!deleteTarget} onClose={()=>setDeleteTarget(null)} onConfirm={handleDelete} company={deleteTarget?.company}/>
    </div>
  );
}