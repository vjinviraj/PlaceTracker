import { useState, useEffect, useRef } from "react";

// --- Enhanced useInView with slightly earlier trigger ---
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px", ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// --- Enhanced FadeIn with Directions & Springy Bezier ---
function FadeIn({ children, delay = 0, direction = "up" }) {
  const [ref, inView] = useInView();
  
  let initialTransform = "translateY(40px)";
  if (direction === "left") initialTransform = "translateX(-40px)";
  if (direction === "right") initialTransform = "translateX(40px)";
  if (direction === "scale") initialTransform = "scale(0.9) translateY(20px)";

  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0) scale(1)" : initialTransform,
      transition: `opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
      willChange: "opacity, transform"
    }}>
      {children}
    </div>
  );
}

const NAV_LINKS = ["Features", "Dashboard", "Roadmap", "Reviews", "Docs"];

const FEATURES = [
  { icon: "◈", title: "Application Tracker", desc: "Every application in one place — roles, companies, statuses, and dates. Your job hunt, but actually organized." },
  { icon: "◎", title: "Interview Pipeline",desc: "Watch your applications move through the pipeline — Applied, Interview, Offer, or Rejected. Clean, colour-coded, easy."},
  { icon: "⬡", title: "Preparation Roadmap",desc: "DSA, DBMS, OS and more — all in structured checklists. Track progress, tick topics, and keep the grind organized." },
  { icon: "◬", title: "Analytics Dashboard", desc: "Visual charts of your job pipeline. See where your applications stand at a glance." },
  { icon: "◷", title: "Deadline Reminders",desc: "Track OAs, interviews, and deadlines with a built-in event calendar. Everything important, right on your dashboard." },
  { icon: "◻", title: "Resume Repository", desc: "Attach job postings, notes, and resources to each application for quick one-click access." },
];

const STEPS = [
  { n: "01", title: "Add Applications", desc: "Log jobs you've applied to with company, role, link, and date in seconds." },
  { n: "02", title: "Track Interviews", desc: "Update status as you progress. Offers, rejections, and interviews — all in one place." },
  { n: "03", title: "Follow the Roadmap", desc: "Check off topics as you study. Watch your preparation percentage climb." },
  { n: "04", title: "Analyse & Improve", desc: "See your placement pipeline visually. Identify gaps and double down on what's working." },
];

const REVIEWS = [
  { name: "Ananya Sharma", uni: "IIT Bombay", avatar: "AS", quote: "PlaceTracker completely changed how I approached placements. I had 40+ applications and never missed a single follow-up." },
  { name: "Rohan Mehta", uni: "BITS Pilani", avatar: "RM", quote: "The preparation roadmap alone is worth it. I knew exactly what to study and when. Got my offer at a top product company." },
  { name: "Priya Nair", uni: "NIT Trichy", avatar: "PN", quote: "Finally a tool built for students, not recruiters. The analytics showed me I was applying too broadly. I refined my strategy and converted." },
  { name: "Karan Verma", uni: "IIT Delhi", avatar: "KV", quote: "I was tracking everything in a spreadsheet before. PlaceTracker is just a completely different level of organisation." },
];

const STATS = [
  { value: "12,400+", label: "Applications Tracked" },
  { value: "3,200+", label: "Interviews Scheduled" },
  { value: "8,500+", label: "Students Onboarded" },
  { value: "94%", label: "Placement Success Rate" },
];

function DashboardMockup() {
  return (
    <div className="dashboard-mockup mockup-tilt" style={{ background: "linear-gradient(135deg, rgba(10,18,42,0.8) 0%, rgba(19,32,71,0.8) 100%)", backdropFilter: "blur(20px)", border: "1px solid rgba(143,160,215,0.2)", borderRadius: "16px", padding: "20px", boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.05), inset 0 1px 0 rgba(255,255,255,0.1)", fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 10px #ef4444" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 10px #f59e0b" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22D3EE", boxShadow: "0 0 10px #22D3EE" }} />
        <div style={{ flex: 1, height: 1, background: "rgba(143,160,215,0.1)", marginLeft: 8 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[{ l: "Total", v: "34", c: "#5E77C0" }, { l: "Interviews", v: "5", c: "#22D3EE" }, { l: "Offers", v: "2", c: "#10b981" }, { l: "Rejected", v: "8", c: "#ef4444" }].map((s) => (
          <div key={s.l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(143,160,215,0.1)", borderRadius: 10, padding: "10px 12px", transition: "transform 0.3s", cursor: "default" }} className="hover-lift">
            <div style={{ fontSize: 20, fontWeight: 700, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 9, color: "#8FA0D7", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 10, marginBottom: 10 }}>
        <div className="hover-lift" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(143,160,215,0.1)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <svg width="70" height="70" viewBox="0 0 70 70" style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.2))" }}>
            <circle cx="35" cy="35" r="28" fill="none" stroke="#1E2F66" strokeWidth="12" />
            <circle cx="35" cy="35" r="28" fill="none" stroke="#22D3EE" strokeWidth="12" strokeDasharray="50 126" strokeDashoffset="-31" strokeLinecap="round" />
            <circle cx="35" cy="35" r="28" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="25 126" strokeDashoffset="-81" strokeLinecap="round" />
            <circle cx="35" cy="35" r="28" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="30 126" strokeDashoffset="-106" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 8, color: "#8FA0D7", marginTop: 6, textAlign: "center" }}>Status Breakdown</div>
        </div>
        <div className="hover-lift" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(143,160,215,0.1)", borderRadius: 10, padding: 12, overflow: "hidden" }}>
          <div style={{ fontSize: 8, color: "#8FA0D7", marginBottom: 8, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Recent Applications</div>
          {[{ co: "Google", role: "SDE", s: "Interview", sc: "#22D3EE" }, { co: "Amazon", role: "SDE II", s: "Applied", sc: "#5E77C0" }, { co: "Microsoft", role: "SWE", s: "Offer", sc: "#10b981" }, { co: "Flipkart", role: "SDE", s: "Rejected", sc: "#ef4444" }].map((r) => (
            <div key={r.co} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(143,160,215,0.06)" }}>
              <div>
                <div style={{ fontSize: 9, color: "#E5E9F7", fontWeight: 600 }}>{r.co}</div>
                <div style={{ fontSize: 8, color: "#8FA0D7" }}>{r.role}</div>
              </div>
              <div style={{ fontSize: 7, color: r.sc, background: `${r.sc}18`, border: `1px solid ${r.sc}40`, borderRadius: 4, padding: "2px 6px" }}>{r.s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hover-lift" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(143,160,215,0.1)", borderRadius: 10, padding: 12 }}>
        <div style={{ fontSize: 8, color: "#8FA0D7", marginBottom: 8, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Preparation Roadmap</div>
        {[{ label: "Data Structures", pct: 72, color: "#22D3EE" }, { label: "Algorithms", pct: 55, color: "#5E77C0" }, { label: "DBMS", pct: 40, color: "#10b981" }].map((p) => (
          <div key={p.label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 8, color: "#C3CCEB" }}>{p.label}</span>
              <span style={{ fontSize: 8, color: p.color }}>{p.pct}%</span>
            </div>
            <div style={{ height: 4, background: "#1E2F66", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${p.pct}%`, background: p.color, borderRadius: 2, boxShadow: `0 0 10px ${p.color}` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  // High-performance CSS variables for Parallax and Mouse tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#02050E", minHeight: "100vh", overflowX: "hidden", fontFamily: "Montserrat, sans-serif", position: "relative" }}>

      {/* --- DYNAMIC BACKGROUND & PARALLAX CSS --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        
        :root {
          --scroll-y: 0px;
          --mouse-x: 50vw;
          --mouse-y: 50vh;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #02050E; }
        ::-webkit-scrollbar-thumb { background: #1E2F66; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #22D3EE; }

        /* Mouse Following Flashlight Glow */
        .mouse-glow {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none; z-index: 1;
          background: radial-gradient(circle 500px at var(--mouse-x) var(--mouse-y), rgba(34,211,238,0.06), transparent 50%);
          mix-blend-mode: screen;
        }

        /* Fixed Background Grid with Parallax */
        .parallax-bg {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
          background: linear-gradient(180deg, #02050E 0%, #060D20 100%);
          overflow: hidden;
        }
        
        .grid-overlay {
          position: absolute; inset: -50%;
          background-image: linear-gradient(rgba(143,160,215,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(143,160,215,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: translateY(calc(var(--scroll-y) * -0.15));
          mask-image: linear-gradient(to bottom, black 20%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 100%);
        }

        /* Floating Gradient Orbs */
        .orb-1 {
          position: absolute; top: 10%; left: 5%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 60%);
          transform: translateY(calc(var(--scroll-y) * -0.2)); filter: blur(40px);
        }
        .orb-2 {
          position: absolute; bottom: 20%; right: 5%; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(94,119,192,0.1) 0%, transparent 60%);
          transform: translateY(calc(var(--scroll-y) * -0.3)); filter: blur(60px);
        }

        /* All content wrapper to sit above fixed background */
        .content-wrapper { position: relative; z-index: 2; }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(1.5deg); }
        }
        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .float-anim { animation: float 7s ease-in-out infinite; }
        
        .text-gradient-anim {
          background: linear-gradient(270deg, #22D3EE, #5E77C0, #06B6D4, #22D3EE);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientText 6s ease infinite;
        }

        /* Navbar */
        .navbar {
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
          z-index: 1000; width: calc(100% - 48px); max-width: 1080px; height: 56px;
          display: flex; align-items: center; justify-content: space-between; padding: 0 20px;
          border-radius: 999px; background: rgba(8, 14, 36, 0.4);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(143, 160, 215, 0.12);
          box-shadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04);
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .navbar.scrolled {
          top: 12px; background: rgba(5, 9, 24, 0.85); border-color: rgba(34, 211, 238, 0.2);
          box-shadow: 0 10px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.08), inset 0 1px 0 rgba(255,255,255,0.06);
          width: calc(100% - 24px);
        }

        /* Buttons & Links */
        .nav-link {
          color: #8FA0D7; font-size: 13.5px; font-weight: 500;
          cursor: pointer; transition: color 0.2s; font-family: Montserrat, sans-serif;
        }
        .nav-link:hover { color: #E5E9F7; text-shadow: 0 0 8px rgba(229,233,247,0.3); }

        .btn-nav-ghost {
          background: transparent; color: #C3CCEB; border: 1px solid rgba(143,160,215,0.2);
          padding: 8px 20px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-nav-ghost:hover { border-color: rgba(34,211,238,0.45); color: #22D3EE; background: rgba(34,211,238,0.05); }

        .btn-nav-primary {
          background: linear-gradient(135deg, #22D3EE, #06B6D4); color: #040814;
          border: none; padding: 8px 24px; border-radius: 999px;
          font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 4px 12px rgba(34,211,238,0.2);
        }
        .btn-nav-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,211,238,0.4); }

        .btn-hero {
          background: linear-gradient(135deg, #22D3EE, #06B6D4); color: #040814; border: none;
          padding: 16px 36px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); font-family: Montserrat, sans-serif;
          box-shadow: 0 8px 20px rgba(34,211,238,0.25);
        }
        .btn-hero:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(34,211,238,0.4); }

        .btn-hero-ghost {
          background: rgba(143,160,215,0.05); color: #C3CCEB; border: 1px solid rgba(143,160,215,0.3);
          padding: 16px 36px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); backdrop-filter: blur(4px);
        }
        .btn-hero-ghost:hover { border-color: #22D3EE; color: #22D3EE; background: rgba(34,211,238,0.05); transform: translateY(-3px); }

        /* Glassmorphism Cards */
        .glass-card {
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(143,160,215,0.1); border-radius: 16px; padding: 32px 28px; 
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); cursor: default; height: 100%;
          position: relative; overflow: hidden;
        }
        .glass-card::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          transform: skewX(-20deg); transition: 0.5s;
        }
        .glass-card:hover {
          background: rgba(19, 32, 71, 0.8); border-color: rgba(34,211,238,0.3);
          transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(34,211,238,0.1);
        }
        .glass-card:hover::before { left: 150%; }

        /* Mockup Tilt / Lift */
        .mockup-tilt { transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); }
        .mockup-tilt:hover { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-5px); }
        .hover-lift { transition: transform 0.3s ease, background 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); background: rgba(255,255,255,0.06) !important; }

        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.2);
          color: #22D3EE; font-size: 12px; font-weight: 600; padding: 6px 14px;
          border-radius: 999px; letter-spacing: 0.5px; font-family: Montserrat, sans-serif;
          box-shadow: 0 0 20px rgba(34,211,238,0.1);
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .stat-container { grid-template-columns: 1fr !important; }
          .stat-card { border-right: none !important; border-bottom: 1px solid rgba(143,160,215,0.1); }
          .stat-card:last-child { border-bottom: none; }
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; gap: 60px !important; }
          .hero-buttons { justify-content: center; }
          .hero-stats { justify-content: center; }
        }
      `}</style>

      {/* --- PARALLAX BACKGROUND --- */}
      <div className="parallax-bg">
        <div className="orb-1" />
        <div className="orb-2" />
        <div className="grid-overlay" />
      </div>

      {/* --- MOUSE GLOW --- */}
      <div className="mouse-glow" />

      {/* --- MAIN CONTENT --- */}
      <div className="content-wrapper">
        
        {/* ══ NAVBAR ══ */}
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} onClick={() => scrollTo("hero")}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #22D3EE, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 16px rgba(34,211,238,0.4)" }}>◈</div>
            <span style={{ fontFamily: "EB Garamond, serif", fontSize: 20, color: "#E5E9F7", fontWeight: 600, letterSpacing: "-0.2px" }}>
              Place<span style={{ color: "#22D3EE" }}>Tracker</span>
            </span>
          </div>

          <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {NAV_LINKS.map((l) => (
              <span key={l} className="nav-link" onClick={() => scrollTo(l.toLowerCase())}>{l}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button className="btn-nav-ghost" onClick={() => window.location.href = "/login"}>Login</button>
            <button className="btn-nav-primary" onClick={() => window.location.href = "/register"}>Get Started</button>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "140px 24px 80px", position: "relative" }}>
          <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            
            <FadeIn direction="left" delay={0.1}>
              <div style={{ marginBottom: 24 }}><span className="badge">✦ Built for placement season</span></div>
              <h1 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(42px, 5vw, 68px)", fontWeight: 600, lineHeight: 1.1, color: "#F8FAFF", marginBottom: 24, letterSpacing: "-0.5px" }}>
                Track Your{" "}
                <span className="text-gradient-anim">Placement Journey</span>{" "}
                in One Dashboard
              </h1>
              <p style={{ fontSize: 18, color: "#8FA0D7", lineHeight: 1.7, marginBottom: 40, maxWidth: 500 }}>
                Manage job applications, track interview progress, and organise your technical preparation — all from a single, beautiful dashboard built for students.
              </p>
              <div className="hero-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
                <button className="btn-hero" onClick={() => window.location.href = "/register"}>Start for Free →</button>
                <button className="btn-hero-ghost" onClick={() => scrollTo("features")}>Explore Features</button>
              </div>
              <div className="hero-stats" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                {[["8,500+", "Students"], ["12,400+", "Applications"], ["94%", "Success Rate"]].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "Montserrat", fontSize: 24, fontWeight: 700, color: "#22D3EE", textShadow: "0 0 15px rgba(34,211,238,0.3)" }}>{v}</div>
                    <div style={{ fontSize: 13, color: "#8FA0D7", marginTop: 4, fontWeight: 500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div className="float-anim" style={{ position: "relative", zIndex: 10 }}>
                <div style={{ position: "absolute", inset: -40, background: "radial-gradient(circle at center, rgba(34,211,238,0.15) 0%, transparent 60%)", borderRadius: "50%", pointerEvents: "none", filter: "blur(30px)" }} />
                <DashboardMockup />
              </div>
            </FadeIn>

          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" style={{ padding: "120px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn direction="up">
              <div style={{ textAlign: "center", marginBottom: 72 }}>
                <span className="badge" style={{ marginBottom: 20 }}>Features</span>
                <h2 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "#F8FAFF", lineHeight: 1.15, marginBottom: 20 }}>
                  Everything you need to <span className="text-gradient-anim">land your dream job</span>
                </h2>
                <p style={{ fontSize: 17, color: "#8FA0D7", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                  From the first application to the final offer, PlaceTracker keeps you organised and ahead of the game.
                </p>
              </div>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 0.1} direction="scale">
                  <div className="glass-card">
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#22D3EE", marginBottom: 20, boxShadow: "inset 0 0 10px rgba(34,211,238,0.1)" }}>{f.icon}</div>
                    <h3 style={{ fontFamily: "Montserrat", fontSize: 18, fontWeight: 600, color: "#E5E9F7", marginBottom: 12 }}>{f.title}</h3>
                    <p style={{ fontSize: 14.5, color: "#8FA0D7", lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ DASHBOARD PREVIEW ══ */}
        <section id="dashboard" style={{ padding: "100px 24px", position: "relative" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 64 }}>
                <span className="badge" style={{ marginBottom: 20 }}>Dashboard</span>
                <h2 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "#F8FAFF", lineHeight: 1.15, marginBottom: 20 }}>Your placement command centre</h2>
                <p style={{ fontSize: 17, color: "#8FA0D7", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>A single view that shows you everything — applications, interviews, and preparation — so nothing falls through the cracks.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} direction="scale">
              <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
                {/* Floating Tags */}
                <div className="float-anim" style={{ position: "absolute", top: -20, left: -20, background: "rgba(15,23,42,0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#22D3EE", fontWeight: 600, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", zIndex: 10 }}>↗ Application Tracking</div>
                <div className="float-anim" style={{ position: "absolute", bottom: 80, right: -20, background: "rgba(15,23,42,0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#10b981", fontWeight: 600, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", zIndex: 10, animationDelay: "1s" }}>↙ Preparation Roadmap</div>
                <DashboardMockup />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="roadmap" style={{ padding: "120px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 80 }}>
                <span className="badge" style={{ marginBottom: 20 }}>How It Works</span>
                <h2 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "#F8FAFF", lineHeight: 1.15, marginBottom: 20 }}>Up and running in minutes</h2>
                <p style={{ fontSize: 17, color: "#8FA0D7", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Four simple steps to take control of your entire placement process.</p>
              </div>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40 }}>
              {STEPS.map((s, i) => (
                <FadeIn key={s.n} delay={i * 0.15} direction="up">
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,211,238,0.05)", border: "2px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontFamily: "Montserrat", fontSize: 16, fontWeight: 700, color: "#22D3EE", boxShadow: "0 0 20px rgba(34,211,238,0.15)" }}>{s.n}</div>
                    {i < STEPS.length - 1 && (<div style={{ position: "absolute", top: 31, left: "calc(50% + 32px)", width: "calc(100% - 64px)", height: 2, background: "linear-gradient(90deg, rgba(34,211,238,0.4), rgba(34,211,238,0.05))" }} />)}
                    <h3 style={{ fontFamily: "Montserrat", fontSize: 18, fontWeight: 600, color: "#E5E9F7", marginBottom: 12 }}>{s.title}</h3>
                    <p style={{ fontSize: 14.5, color: "#8FA0D7", lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <section style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn direction="scale">
              <div className="stat-container glass-card" style={{ padding: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "rgba(15,23,42,0.4)" }}>
                {STATS.map((s, i) => (
                  <div key={s.label} className="stat-card" style={{ textAlign: "center", padding: "48px 32px", borderRight: i !== 3 ? "1px solid rgba(143,160,215,0.15)" : "none" }}>
                    <div style={{ fontFamily: "Montserrat", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 700, color: "#22D3EE", lineHeight: 1.1, marginBottom: 12, textShadow: "0 0 20px rgba(34,211,238,0.2)" }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: "#8FA0D7", fontWeight: 500, letterSpacing: 0.5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section id="reviews" style={{ padding: "120px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 72 }}>
                <span className="badge" style={{ marginBottom: 20 }}>Reviews</span>
                <h2 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 600, color: "#F8FAFF", lineHeight: 1.15, marginBottom: 20 }}>Loved by students across India</h2>
                <p style={{ fontSize: 17, color: "#8FA0D7", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Don't just take our word for it. Here's what students say after their placement season.</p>
              </div>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {REVIEWS.map((r, i) => (
                <FadeIn key={r.name} delay={i * 0.1} direction="up">
                  <div className="glass-card">
                    <div style={{ fontSize: 40, color: "rgba(34,211,238,0.4)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 16 }}>"</div>
                    <p style={{ fontSize: 15, color: "#C3CCEB", lineHeight: 1.8, marginBottom: 32 }}>{r.quote}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #1E2F66, #22D3EE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#E5E9F7", boxShadow: "0 4px 10px rgba(34,211,238,0.2)" }}>{r.avatar}</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#E5E9F7" }}>{r.name}</div>
                        <div style={{ fontSize: 13, color: "#8FA0D7" }}>{r.uni}</div>
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                        {[...Array(5)].map((_, j) => <span key={j} style={{ color: "#22D3EE", fontSize: 14, filter: "drop-shadow(0 0 2px rgba(34,211,238,0.5))" }}>★</span>)}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section style={{ padding: "100px 24px 140px", position: "relative" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <FadeIn direction="scale">
              <div className="glass-card" style={{ padding: "80px 48px", border: "1px solid rgba(34,211,238,0.2)", background: "linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(19,32,71,0.6) 100%)" }}>
                <span className="badge" style={{ marginBottom: 24 }}>Get Started Today</span>
                <h2 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 600, color: "#F8FAFF", lineHeight: 1.15, marginBottom: 24 }}>
                  Start Organising Your <span className="text-gradient-anim">Placement Journey</span> Today
                </h2>
                <p style={{ fontSize: 17, color: "#8FA0D7", lineHeight: 1.7, marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}>Join thousands of students who trust PlaceTracker to stay organised and get placed. It's completely free to start.</p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-hero" onClick={() => window.location.href = "/register"}>Create Free Account →</button>
                  <button className="btn-hero-ghost" onClick={() => window.location.href = "/login"}>Sign In</button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer id="docs" style={{ borderTop: "1px solid rgba(143,160,215,0.1)", padding: "80px 24px 40px", background: "rgba(2, 5, 14, 0.8)", backdropFilter: "blur(10px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 48, marginBottom: 64 }}>
              <div style={{ gridColumn: "span 2" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #22D3EE, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 0 16px rgba(34,211,238,0.3)" }}>◈</div>
                  <span style={{ fontFamily: "EB Garamond, serif", fontSize: 24, color: "#E5E9F7", fontWeight: 600 }}>Place<span style={{ color: "#22D3EE" }}>Tracker</span></span>
                </div>
                <p style={{ fontSize: 14, color: "#8FA0D7", lineHeight: 1.8, maxWidth: 300 }}>The placement management platform built for students who want to take their job search seriously.</p>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  {["𝕏", "in", "gh"].map((s) => (
                    <div key={s} className="hover-lift" style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(143,160,215,0.05)", border: "1px solid rgba(143,160,215,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#8FA0D7", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"; e.currentTarget.style.color = "#22D3EE"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(143,160,215,0.15)"; e.currentTarget.style.color = "#8FA0D7"; }}
                    >{s}</div>
                  ))}
                </div>
              </div>
              {[
                { title: "Product", links: ["Features", "Roadmap", "Updates", "Changelog"] },
                { title: "Resources", links: ["Docs", "Help", "FAQ", "API"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy Policy", "Terms", "Cookie Policy"] },
              ].map((col) => (
                <div key={col.title}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#E5E9F7", letterSpacing: 1, textTransform: "uppercase", marginBottom: 24 }}>{col.title}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {col.links.map((l) => (
                      <span key={l} style={{ fontSize: 14, color: "#8FA0D7", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#22D3EE"; e.currentTarget.style.transform = "translateX(4px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#8FA0D7"; e.currentTarget.style.transform = "translateX(0)"; }}
                      >{l}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(143,160,215,0.1)", paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <p style={{ fontSize: 14, color: "#5A6386" }}>© 2025 PlaceTracker. All rights reserved.</p>
              <p style={{ fontSize: 14, color: "#5A6386" }}>Built for students, by students 🚀</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}