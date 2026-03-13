// src/components/OnboardingModal.jsx
// Drop into your Dashboard or App.jsx — shows once on first login per user

import { useState, useEffect } from "react";
import {
  BriefcaseBusiness, Map, Calendar, ChevronRight,
  CheckCircle2, X, Sparkles, ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    icon: BriefcaseBusiness,
    color: "#22D3EE",
    title: "Track Every Application",
    subtitle: "Step 1 of 3",
    heading: "Never lose track of where you've applied",
    body: "Add each job application with the company, role, date, and status. As you progress through interviews, update the status to keep your pipeline accurate.",
    tip: "Tip: The Applications page lets you attach notes and your resume version to each entry — so you always know which CV got which response.",
    illustration: (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect x="20" y="20" width="200" height="120" rx="12" fill="rgba(15,23,42,0.8)" stroke="rgba(34,211,238,0.2)" strokeWidth="1"/>
        {/* Header row */}
        <rect x="35" y="35" width="60" height="8" rx="3" fill="rgba(143,160,215,0.3)"/>
        <rect x="35" y="47" width="40" height="6" rx="2" fill="rgba(143,160,215,0.15)"/>
        {/* Status pill */}
        <rect x="160" y="33" width="45" height="14" rx="7" fill="rgba(34,211,238,0.15)" stroke="rgba(34,211,238,0.3)" strokeWidth="1"/>
        <rect x="168" y="38" width="29" height="4" rx="2" fill="rgba(34,211,238,0.6)"/>
        {/* Divider */}
        <rect x="35" y="60" width="170" height="1" fill="rgba(143,160,215,0.08)"/>
        {/* Row 2 */}
        <rect x="35" y="70" width="55" height="7" rx="2" fill="rgba(143,160,215,0.25)"/>
        <rect x="35" y="81" width="38" height="5" rx="2" fill="rgba(143,160,215,0.12)"/>
        <rect x="160" y="68" width="45" height="14" rx="7" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
        <rect x="168" y="73" width="29" height="4" rx="2" fill="rgba(16,185,129,0.5)"/>
        <rect x="35" y="95" width="170" height="1" fill="rgba(143,160,215,0.08)"/>
        {/* Row 3 */}
        <rect x="35" y="105" width="48" height="7" rx="2" fill="rgba(143,160,215,0.2)"/>
        <rect x="35" y="116" width="32" height="5" rx="2" fill="rgba(143,160,215,0.1)"/>
        <rect x="160" y="103" width="45" height="14" rx="7" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.25)" strokeWidth="1"/>
        <rect x="168" y="108" width="29" height="4" rx="2" fill="rgba(239,68,68,0.4)"/>
        {/* Plus button */}
        <circle cx="210" cy="130" r="12" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.4)" strokeWidth="1"/>
        <rect x="205" y="129" width="10" height="2" rx="1" fill="#22D3EE"/>
        <rect x="209" y="125" width="2" height="10" rx="1" fill="#22D3EE"/>
      </svg>
    ),
  },
  {
    icon: Map,
    color: "#10b981",
    title: "Master Your Prep",
    subtitle: "Step 2 of 3",
    heading: "Study smarter with the Roadmap",
    body: "The Preparation Roadmap breaks down every topic you need — DSA, DBMS, OS, Networks. Click a topic to cycle it from Not Started → In Progress → Completed.",
    tip: "Tip: Add your own custom categories. If you're targeting frontend roles, add a 'React & JavaScript' section with your own checklist.",
    illustration: (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect x="20" y="15" width="200" height="130" rx="12" fill="rgba(15,23,42,0.8)" stroke="rgba(16,185,129,0.2)" strokeWidth="1"/>
        {/* Title */}
        <rect x="35" y="28" width="80" height="8" rx="3" fill="rgba(143,160,215,0.3)"/>
        {/* Overall progress */}
        <rect x="35" y="45" width="170" height="6" rx="3" fill="rgba(143,160,215,0.1)"/>
        <rect x="35" y="45" width="102" height="6" rx="3" fill="rgba(16,185,129,0.6)" style={{filter:"drop-shadow(0 0 4px rgba(16,185,129,0.5))"}}/>
        <rect x="185" y="43" width="20" height="10" rx="2" fill="rgba(16,185,129,0.15)"/>
        <rect x="187" y="46" width="16" height="4" rx="1" fill="rgba(16,185,129,0.5)"/>
        {/* Topic rows */}
        {[
          {y:65, w:110, done:true, pct:0.8, c:"#22D3EE"},
          {y:82, w:90,  done:true, pct:0.55, c:"#22D3EE"},
          {y:99, w:75,  done:false, pct:0.3, c:"#10b981"},
          {y:116, w:60, done:false, pct:0.1, c:"#f59e0b"},
        ].map((r,i)=>(
          <g key={i}>
            <circle cx="44" cy={r.y+4} r="5" fill={r.done?"rgba(34,211,238,0.2)":"rgba(143,160,215,0.1)"} stroke={r.done?"rgba(34,211,238,0.5)":"rgba(143,160,215,0.2)"} strokeWidth="1"/>
            {r.done && <path d={`M${41} ${r.y+4} l3 3 l5-5`} stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round"/>}
            <rect x="56" y={r.y} width={r.w} height="5" rx="2" fill="rgba(143,160,215,0.2)"/>
            <rect x="145" y={r.y} width="50" height="5" rx="2" fill="rgba(143,160,215,0.1)"/>
            <rect x="145" y={r.y} width={50*r.pct} height="5" rx="2" fill={r.c} style={{filter:`drop-shadow(0 0 3px ${r.c}80)`}}/>
          </g>
        ))}
      </svg>
    ),
  },
  {
    icon: Calendar,
    color: "#f59e0b",
    title: "Never Miss a Date",
    subtitle: "Step 3 of 3",
    heading: "Schedule OAs, interviews & deadlines",
    body: "The Calendar lets you plot every important date — online assessments, interview rounds, offer deadlines. Events within 3 days show up as reminders in the navbar bell.",
    tip: "Tip: When you add an event, link it to a company from your applications list. The sidebar will show you everything coming up in the next 7 days.",
    illustration: (
      <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        <rect x="20" y="15" width="200" height="130" rx="12" fill="rgba(15,23,42,0.8)" stroke="rgba(245,158,11,0.2)" strokeWidth="1"/>
        {/* Month header */}
        <rect x="35" y="27" width="60" height="8" rx="3" fill="rgba(143,160,215,0.3)"/>
        <circle cx="195" cy="31" r="7" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.3)" strokeWidth="1"/>
        <rect x="192" y="30" width="6" height="2" rx="1" fill="#f59e0b"/>
        <rect x="194" y="27" width="2" height="7" rx="1" fill="#f59e0b"/>
        {/* Day headers */}
        {["S","M","T","W","T","F","S"].map((d,i)=>(
          <text key={i} x={38+i*26} y="52" fontSize="7" fill="rgba(143,160,215,0.4)" fontFamily="monospace">{d}</text>
        ))}
        {/* Grid cells — 5 rows x 7 cols */}
        {Array.from({length:35},(_,i)=>{
          const x = 35 + (i%7)*26;
          const y = 58 + Math.floor(i/7)*17;
          const isToday = i===10;
          const hasEvent = [3,10,17,22,28].includes(i);
          const eventColor = i===10?"#22D3EE":i===17?"#ef4444":i===22?"#10b981":"#f59e0b";
          return (
            <g key={i}>
              {isToday && <circle cx={x+5} cy={y+5} r="7" fill="rgba(34,211,238,0.15)" stroke="rgba(34,211,238,0.3)" strokeWidth="1"/>}
              <text x={x+5} y={y+8} fontSize="7" fill={isToday?"#22D3EE":"rgba(143,160,215,0.5)"} textAnchor="middle" fontFamily="monospace">{i+1}</text>
              {hasEvent && <rect x={x} y={y+11} width="14" height="3" rx="1.5" fill={eventColor} style={{filter:`drop-shadow(0 0 2px ${eventColor}80)`}}/>}
            </g>
          );
        })}
      </svg>
    ),
  },
];

export default function OnboardingModal({ userEmail }) {
  const key = `placetracker_onboarded_${userEmail}`;
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(key)) setVisible(true);
  }, [key]);

  const dismiss = () => {
    localStorage.setItem(key, "true");
    setVisible(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setAnimating(true);
      setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 180);
    } else {
      dismiss();
    }
  };

  const goTo = (i) => {
    if (i === step) return;
    setAnimating(true);
    setTimeout(() => { setStep(i); setAnimating(false); }, 180);
  };

  if (!visible) return null;

  const s = STEPS[step];
  const Icon = s.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        .ob-overlay { position:fixed; inset:0; z-index:10000; background:rgba(2,5,14,0.85); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:24px; animation:obFadeIn 0.3s ease; }
        @keyframes obFadeIn { from{opacity:0} to{opacity:1} }
        .ob-card { background:rgba(10,18,42,0.97); backdrop-filter:blur(24px); border:1px solid rgba(143,160,215,0.18); border-radius:24px; width:100%; max-width:560px; box-shadow:0 40px 100px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,255,255,0.05); overflow:hidden; font-family:Montserrat,sans-serif; animation:obSlideUp 0.35s cubic-bezier(0.25,1,0.5,1); }
        @keyframes obSlideUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }
        .ob-step { transition:opacity 0.18s ease, transform 0.18s ease; }
        .ob-step.animating { opacity:0; transform:translateX(12px); }
        .ob-illus { width:100%; height:180px; background:linear-gradient(135deg,rgba(15,23,42,0.9),rgba(10,15,35,0.95)); border-bottom:1px solid rgba(143,160,215,0.08); display:flex; align-items:center; justify-content:center; padding:20px 40px; position:relative; overflow:hidden; }
        .ob-illus::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 50%, rgba(34,211,238,0.04), transparent 60%); }
        .ob-body { padding:28px 32px 24px; }
        .ob-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; padding:4px 12px; border-radius:999px; letter-spacing:0.5px; margin-bottom:12px; }
        .ob-heading { font-family:'EB Garamond',serif; font-size:26px; font-weight:600; color:#F8FAFF; line-height:1.2; margin-bottom:12px; }
        .ob-body-text { font-size:13.5px; color:#8FA0D7; line-height:1.8; margin-bottom:14px; }
        .ob-tip { background:rgba(255,255,255,0.03); border:1px solid rgba(143,160,215,0.1); border-radius:10px; padding:12px 14px; font-size:12.5px; color:#8FA0D7; line-height:1.7; margin-bottom:24px; }
        .ob-tip strong { color:#22D3EE; }
        .ob-footer { display:flex; align-items:center; justify-content:space-between; padding:0 32px 26px; }
        .ob-dots { display:flex; gap:6px; align-items:center; }
        .ob-dot { width:6px; height:6px; border-radius:50%; background:rgba(143,160,215,0.2); cursor:pointer; transition:all 0.25s; }
        .ob-dot.active { width:20px; border-radius:3px; background:linear-gradient(90deg,#22D3EE,#06B6D4); box-shadow:0 0 8px rgba(34,211,238,0.4); }
        .ob-dot:hover:not(.active) { background:rgba(143,160,215,0.4); }
        .ob-next { display:flex; align-items:center; gap:8px; padding:11px 24px; border-radius:999px; border:none; background:linear-gradient(135deg,#22D3EE,#06B6D4); color:#040814; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.3s cubic-bezier(0.25,1,0.5,1); box-shadow:0 6px 16px rgba(34,211,238,0.25); font-family:Montserrat,sans-serif; }
        .ob-next:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(34,211,238,0.4); }
        .ob-skip { background:none; border:none; color:#5A6386; font-size:12px; cursor:pointer; font-family:Montserrat,sans-serif; transition:color 0.2s; padding:4px 0; }
        .ob-skip:hover { color:#8FA0D7; }
        .ob-close { position:absolute; top:16px; right:16px; width:30px; height:30px; border-radius:8px; border:1px solid rgba(143,160,215,0.15); background:transparent; color:#5A6386; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; z-index:1; }
        .ob-close:hover { color:#E5E9F7; border-color:rgba(143,160,215,0.35); }
      `}</style>

      <div className="ob-overlay">
        <div className="ob-card" style={{ position:"relative" }}>
          <button className="ob-close" onClick={dismiss}><X size={14}/></button>

          {/* Illustration */}
          <div className="ob-illus" style={{ borderColor:`rgba(${s.color==="#22D3EE"?"34,211,238":s.color==="#10b981"?"16,185,129":"245,158,11"},0.12)` }}>
            {s.illustration}
          </div>

          {/* Content */}
          <div className={`ob-step${animating?" animating":""}`}>
            <div className="ob-body">
              <div className="ob-badge" style={{ background:`${s.color}12`, border:`1px solid ${s.color}30`, color:s.color }}>
                <Icon size={10}/> {s.subtitle}
              </div>
              <h2 className="ob-heading">{s.heading}</h2>
              <p className="ob-body-text">{s.body}</p>
              <div className="ob-tip">
                <strong>✦ {s.tip.split(":")[0]}:</strong>{s.tip.split(":").slice(1).join(":")}
              </div>
            </div>

            <div className="ob-footer">
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div className="ob-dots">
                  {STEPS.map((_,i) => (
                    <div key={i} className={`ob-dot${i===step?" active":""}`} onClick={()=>goTo(i)}/>
                  ))}
                </div>
                <button className="ob-skip" onClick={dismiss}>Skip tour</button>
              </div>
              <button className="ob-next" onClick={next}>
                {step < STEPS.length - 1 ? <><span>Next</span><ChevronRight size={15}/></> : <><Sparkles size={14}/><span>Let's go!</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}