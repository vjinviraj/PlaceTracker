// src/components/EmptyStates.jsx
// Usage:
//   import { EmptyApplications, EmptyRoadmap, EmptyCalendar, EmptySearch } from "./EmptyStates"

import { useState, useEffect } from "react";
import { Plus, Map, Calendar, Search, BriefcaseBusiness, Sparkles } from "lucide-react";

function FloatingParticles({ color = "#22D3EE", count = 6 }) {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          position:"absolute",
          width: 3 + (i % 3),
          height: 3 + (i % 3),
          borderRadius:"50%",
          background: color,
          opacity: 0.15 + (i * 0.05),
          left: `${15 + i * 13}%`,
          top: `${20 + (i % 3) * 25}%`,
          animation: `floatParticle${i % 3} ${3 + i * 0.5}s ease-in-out infinite`,
          boxShadow: `0 0 6px ${color}`,
        }}/>
      ))}
    </div>
  );
}

// ─── Applications Empty State ───────────────────────────────────────────────
export function EmptyApplications({ onAdd }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes floatParticle0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatParticle1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatParticle2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(1.08);opacity:0.15} }
        @keyframes floatCard { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(-2deg)} }
        @keyframes floatCard2 { 0%,100%{transform:translateY(0) rotate(3deg)} 50%{transform:translateY(-6px) rotate(3deg)} }
        @keyframes floatCard3 { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(-1deg)} }
        .empty-cta { display:inline-flex; align-items:center; gap:8px; padding:12px 28px; border-radius:999px; border:none; background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; font-size:13.5px; font-weight:700; cursor:pointer; transition:all 0.3s cubic-bezier(0.25,1,0.5,1); box-shadow:0 8px 20px rgba(34,211,238,0.3); font-family:Montserrat,sans-serif; }
        .empty-cta:hover { transform:translateY(-3px); box-shadow:0 14px 32px rgba(34,211,238,0.5); }
        .empty-cta-ghost { display:inline-flex; align-items:center; gap:6px; padding:10px 22px; border-radius:999px; background:transparent; border:1px solid rgba(143,160,215,0.2); color:#8FA0D7; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:Montserrat,sans-serif; }
        .empty-cta-ghost:hover { border-color:rgba(143,160,215,0.4); color:#E5E9F7; }
      `}</style>

      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"80px 24px", textAlign:"center", position:"relative",
        opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)",
        transition:"opacity 0.6s ease, transform 0.6s ease",
        fontFamily:"Montserrat, sans-serif",
      }}>
        <FloatingParticles color="#22D3EE"/>

        {/* Illustration */}
        <div style={{ position:"relative", width:220, height:160, marginBottom:32 }}>
          {/* Glow ring */}
          <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle, rgba(34,211,238,0.06), transparent 60%)", animation:"pulseRing 3s ease-in-out infinite" }}/>

          {/* Floating cards */}
          <div style={{ position:"absolute", left:10, top:20, width:80, height:50, borderRadius:10, background:"rgba(15,23,42,0.9)", border:"1px solid rgba(143,160,215,0.15)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"8px 10px", gap:5, animation:"floatCard 3.5s ease-in-out infinite", boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
            <div style={{ height:5, borderRadius:3, width:"80%", background:"rgba(143,160,215,0.25)" }}/>
            <div style={{ height:4, borderRadius:2, width:"55%", background:"rgba(143,160,215,0.12)" }}/>
            <div style={{ height:6, borderRadius:3, width:28, background:"rgba(34,211,238,0.2)", border:"1px solid rgba(34,211,238,0.3)" }}/>
          </div>

          <div style={{ position:"absolute", right:8, top:10, width:88, height:54, borderRadius:10, background:"rgba(15,23,42,0.9)", border:"1px solid rgba(143,160,215,0.12)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"8px 10px", gap:5, animation:"floatCard2 4s ease-in-out infinite", boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
            <div style={{ height:5, borderRadius:3, width:"75%", background:"rgba(143,160,215,0.2)" }}/>
            <div style={{ height:4, borderRadius:2, width:"45%", background:"rgba(143,160,215,0.1)" }}/>
            <div style={{ height:6, borderRadius:3, width:32, background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)" }}/>
          </div>

          <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", top:75, width:96, height:58, borderRadius:12, background:"rgba(15,23,42,0.95)", border:"1px solid rgba(34,211,238,0.25)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"10px 12px", gap:6, animation:"floatCard3 3s ease-in-out infinite", boxShadow:"0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.1)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:18, height:18, borderRadius:5, background:"rgba(34,211,238,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <BriefcaseBusiness size={10} color="#22D3EE"/>
              </div>
              <div style={{ height:5, borderRadius:2, width:50, background:"rgba(143,160,215,0.3)" }}/>
            </div>
            <div style={{ height:4, borderRadius:2, width:"60%", background:"rgba(143,160,215,0.15)" }}/>
            <div style={{ height:5, borderRadius:3, width:36, background:"rgba(34,211,238,0.25)", border:"1px solid rgba(34,211,238,0.4)" }}/>
          </div>
        </div>

        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(34,211,238,0.07)", border:"1px solid rgba(34,211,238,0.18)", borderRadius:999, padding:"4px 12px", marginBottom:14 }}>
          <Sparkles size={10} color="#22D3EE"/>
          <span style={{ fontSize:11, fontWeight:600, color:"#22D3EE", letterSpacing:0.5 }}>GET STARTED</span>
        </div>

        <h3 style={{ fontFamily:"EB Garamond, serif", fontSize:28, fontWeight:600, color:"#F8FAFF", marginBottom:10, lineHeight:1.2 }}>
          Your pipeline is empty
        </h3>
        <p style={{ fontSize:14, color:"#8FA0D7", maxWidth:360, lineHeight:1.8, marginBottom:28 }}>
          Start tracking your placement journey. Add your first application and watch your pipeline grow.
        </p>
        <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", justifyContent:"center" }}>
          <button className="empty-cta" onClick={onAdd}><Plus size={15}/> Add First Application</button>
        </div>
        <p style={{ fontSize:12, color:"#3A4566", marginTop:16 }}>Takes less than 30 seconds per application</p>
      </div>
    </>
  );
}

// ─── Search Empty State ──────────────────────────────────────────────────────
export function EmptySearch({ query, onClear }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"60px 24px", textAlign:"center",
      opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
      transition:"opacity 0.5s ease, transform 0.5s ease",
      fontFamily:"Montserrat, sans-serif",
    }}>
      {/* SVG illustration */}
      <div style={{ marginBottom:24, position:"relative" }}>
        <svg viewBox="0 0 120 120" width="100" height="100" fill="none">
          <circle cx="52" cy="52" r="32" stroke="rgba(143,160,215,0.2)" strokeWidth="3"/>
          <circle cx="52" cy="52" r="32" stroke="rgba(143,160,215,0.08)" strokeWidth="8"/>
          <line x1="75" y1="75" x2="96" y2="96" stroke="rgba(143,160,215,0.25)" strokeWidth="4" strokeLinecap="round"/>
          {/* X inside */}
          <line x1="44" y1="44" x2="60" y2="60" stroke="rgba(143,160,215,0.35)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="60" y1="44" x2="44" y2="60" stroke="rgba(143,160,215,0.35)" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Stars */}
          <circle cx="20" cy="25" r="2" fill="rgba(34,211,238,0.3)"/>
          <circle cx="100" cy="40" r="1.5" fill="rgba(94,119,192,0.4)"/>
          <circle cx="15" cy="80" r="1.5" fill="rgba(34,211,238,0.2)"/>
        </svg>
      </div>

      <h3 style={{ fontFamily:"EB Garamond, serif", fontSize:24, fontWeight:600, color:"#E5E9F7", marginBottom:8 }}>
        No results for "{query}"
      </h3>
      <p style={{ fontSize:13.5, color:"#8FA0D7", lineHeight:1.75, marginBottom:22, maxWidth:300 }}>
        Try a different company name, role, or clear the filter.
      </p>
      <button className="empty-cta-ghost" onClick={onClear}><Search size={13}/> Clear search</button>
    </div>
  );
}

// ─── Roadmap Empty State ─────────────────────────────────────────────────────
export function EmptyRoadmap({ onAdd }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"80px 24px", textAlign:"center", position:"relative",
      opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)",
      transition:"opacity 0.6s ease, transform 0.6s ease",
      fontFamily:"Montserrat, sans-serif",
    }}>
      <FloatingParticles color="#10b981" count={5}/>

      <div style={{ marginBottom:28, position:"relative" }}>
        <svg viewBox="0 0 200 160" width="200" height="160" fill="none">
          {/* Road */}
          <path d="M20 140 Q100 60 180 20" stroke="rgba(16,185,129,0.15)" strokeWidth="3" strokeDasharray="6 4"/>
          <path d="M20 140 Q100 60 180 20" stroke="rgba(16,185,129,0.08)" strokeWidth="12" strokeLinecap="round"/>
          {/* Nodes */}
          {[[20,140],[72,95],[124,58],[180,20]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r={i===0?10:8} fill={i===0?"rgba(16,185,129,0.2)":"rgba(143,160,215,0.1)"} stroke={i===0?"rgba(16,185,129,0.5)":"rgba(143,160,215,0.2)"} strokeWidth="1.5"/>
              {i===0 && <circle cx={x} cy={y} r={5} fill="rgba(16,185,129,0.6)"/>}
              {i>0 && <circle cx={x} cy={y} r={4} fill="rgba(143,160,215,0.2)"/>}
            </g>
          ))}
          {/* Rocket */}
          <g transform="translate(165,8) rotate(-45)">
            <ellipse cx="8" cy="12" rx="5" ry="8" fill="rgba(34,211,238,0.3)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
            <path d="M3 18 L0 24 L8 21 L16 24 L13 18" fill="rgba(34,211,238,0.15)" stroke="rgba(34,211,238,0.3)" strokeWidth="1"/>
            <circle cx="8" cy="11" r="2" fill="rgba(34,211,238,0.6)"/>
          </g>
          {/* Sparkles */}
          <text x="150" y="55" fontSize="12" opacity="0.4">✦</text>
          <text x="40" y="115" fontSize="8" opacity="0.25">✦</text>
          <text x="95" y="35" fontSize="10" opacity="0.3">✦</text>
        </svg>
      </div>

      <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:999, padding:"4px 12px", marginBottom:14 }}>
        <Map size={10} color="#10b981"/>
        <span style={{ fontSize:11, fontWeight:600, color:"#10b981", letterSpacing:0.5 }}>PREPARATION</span>
      </div>

      <h3 style={{ fontFamily:"EB Garamond, serif", fontSize:28, fontWeight:600, color:"#F8FAFF", marginBottom:10, lineHeight:1.2 }}>
        Your roadmap awaits
      </h3>
      <p style={{ fontSize:14, color:"#8FA0D7", maxWidth:380, lineHeight:1.8, marginBottom:28 }}>
        Build a structured preparation plan. Add topics like DSA, DBMS, and OS — then track your progress as you study.
      </p>
      <button className="empty-cta" style={{ background:"linear-gradient(135deg,#10b981,#059669)", boxShadow:"0 8px 20px rgba(16,185,129,0.3)" }} onClick={onAdd}>
        <Plus size={15}/> Add First Category
      </button>
    </div>
  );
}

// ─── Calendar Empty State ────────────────────────────────────────────────────
export function EmptyCalendar({ onAdd }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"60px 24px", textAlign:"center", position:"relative",
      opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)",
      transition:"opacity 0.6s ease, transform 0.6s ease",
      fontFamily:"Montserrat, sans-serif",
    }}>
      <FloatingParticles color="#f59e0b" count={5}/>

      <div style={{ marginBottom:24, position:"relative" }}>
        <svg viewBox="0 0 160 140" width="160" height="140" fill="none">
          {/* Calendar body */}
          <rect x="20" y="30" width="120" height="100" rx="12" fill="rgba(15,23,42,0.8)" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5"/>
          {/* Header */}
          <rect x="20" y="30" width="120" height="28" rx="12" fill="rgba(245,158,11,0.08)"/>
          <rect x="30" y="40" width="50" height="6" rx="2" fill="rgba(245,158,11,0.4)"/>
          {/* Binding circles */}
          <circle cx="50" cy="30" r="5" fill="rgba(15,23,42,0.9)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5"/>
          <circle cx="80" cy="30" r="5" fill="rgba(15,23,42,0.9)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5"/>
          <circle cx="110" cy="30" r="5" fill="rgba(15,23,42,0.9)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5"/>
          {/* Grid dots */}
          {Array.from({length:20},(_,i)=>(
            <circle key={i} cx={36+(i%5)*22} cy={74+Math.floor(i/5)*16} r="2.5" fill={i===6?"rgba(245,158,11,0.6)":"rgba(143,160,215,0.15)"} stroke={i===6?"rgba(245,158,11,0.4)":"none"} strokeWidth="1"/>
          ))}
          {/* Event pill */}
          <rect x="30" y="96" width="55" height="10" rx="5" fill="rgba(34,211,238,0.15)" stroke="rgba(34,211,238,0.3)" strokeWidth="1"/>
          <rect x="33" y="99" width="30" height="4" rx="2" fill="rgba(34,211,238,0.5)"/>
          {/* Plus */}
          <circle cx="130" cy="120" r="14" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5"/>
          <rect x="124" y="119" width="12" height="2" rx="1" fill="#f59e0b"/>
          <rect x="129" y="114" width="2" height="12" rx="1" fill="#f59e0b"/>
        </svg>
      </div>

      <h3 style={{ fontFamily:"EB Garamond, serif", fontSize:26, fontWeight:600, color:"#F8FAFF", marginBottom:10 }}>
        No events this month
      </h3>
      <p style={{ fontSize:13.5, color:"#8FA0D7", maxWidth:320, lineHeight:1.8, marginBottom:24 }}>
        Add your OA dates, interview rounds, and deadlines to stay on top of your schedule.
      </p>
      <button className="empty-cta" style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", boxShadow:"0 8px 20px rgba(245,158,11,0.25)" }} onClick={onAdd}>
        <Calendar size={15}/> Add First Event
      </button>
    </div>
  );
}

// ─── Dashboard Empty State ───────────────────────────────────────────────────
export function EmptyDashboard({ onAddApp }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"48px 24px 36px", textAlign:"center", position:"relative",
      opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
      transition:"opacity 0.6s ease, transform 0.6s ease",
      fontFamily:"Montserrat, sans-serif",
    }}>
      <FloatingParticles color="#5E77C0" count={4}/>

      <div style={{ marginBottom:20 }}>
        <svg viewBox="0 0 180 120" width="180" height="120" fill="none">
          {/* Bar chart */}
          {[40,65,35,80,55,70].map((h,i)=>(
            <g key={i}>
              <rect x={15+i*26} y={90-h} width={18} height={h} rx="4"
                fill={i===3?"rgba(34,211,238,0.25)":"rgba(143,160,215,0.1)"}
                stroke={i===3?"rgba(34,211,238,0.4)":"rgba(143,160,215,0.2)"} strokeWidth="1"/>
              {i===3 && <rect x={15+i*26} y={90-h} width={18} height={4} rx="2" fill="rgba(34,211,238,0.6)"/>}
            </g>
          ))}
          {/* Baseline */}
          <line x1="10" y1="90" x2="170" y2="90" stroke="rgba(143,160,215,0.15)" strokeWidth="1"/>
          {/* Sparkle */}
          <text x="130" y="20" fontSize="14" opacity="0.5">✦</text>
          <text x="20" y="30" fontSize="9" opacity="0.25">✦</text>
        </svg>
      </div>

      <h3 style={{ fontFamily:"EB Garamond, serif", fontSize:22, fontWeight:600, color:"#E5E9F7", marginBottom:8, lineHeight:1.2 }}>
        No data yet
      </h3>
      <p style={{ fontSize:13, color:"#8FA0D7", maxWidth:280, lineHeight:1.75, marginBottom:20 }}>
        Add your first application and your dashboard will come alive with stats and charts.
      </p>
      <button className="empty-cta" style={{ fontSize:12.5, padding:"9px 20px" }} onClick={onAddApp}>
        <Plus size={13}/> Add Application
      </button>
    </div>
  );
}