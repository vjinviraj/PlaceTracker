import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OnboardingModal from "../components/OnboardingModal";
import {
  BriefcaseBusiness,
  Clock,
  XCircle,
  Trophy,
  TrendingUp,
  Plus,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const COLORS = {
  Applied: "#5E77C0",
  Interview: "#22D3EE",
  Offer: "#10b981",
  Rejected: "#ef4444",
};

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="stat-card-wrapper"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
        transition: `opacity 0.6s cubic-bezier(0.25,1,0.5,1) ${delay}ms, transform 0.6s cubic-bezier(0.25,1,0.5,1) ${delay}ms`,
      }}
    >
      <div className="stat-card">
        <div className="stat-icon" style={{ background: `${color}18`, boxShadow: `0 0 20px ${color}20` }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value" style={{ color, textShadow: `0 0 20px ${color}40` }}>{value}</p>
        </div>
        <div className="stat-glow" style={{ background: `radial-gradient(circle at 80% 20%, ${color}10, transparent 60%)` }} />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(10,18,42,0.95)", border: "1px solid rgba(34,211,238,0.2)",
        borderRadius: 10, padding: "10px 14px", backdropFilter: "blur(16px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        fontFamily: "Montserrat, sans-serif",
      }}>
        <p style={{ color: "#E5E9F7", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{payload[0].name}</p>
        <p style={{ color: "#22D3EE", fontSize: 13 }}>{payload[0].value} applications</p>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const applications = JSON.parse(
    localStorage.getItem(`placetracker_apps_${user?.email}`) || "[]"
  );

  const stats = {
    total: applications.length,
    interview: applications.filter((a) => a.status === "Interview").length,
    offer: applications.filter((a) => a.status === "Offer").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const chartData = [
    { name: "Applied", value: applications.filter((a) => a.status === "Applied").length },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
  ].filter((d) => d.value > 0);

  const upcoming = applications.filter((a) => a.status === "Interview").slice(0, 4);
  const recent = [...applications]
    .sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied))
    .slice(0, 5);

  return (
    <div style={{ minHeight: "100vh", background: "#02050E", overflowX: "hidden", paddingTop: 80, fontFamily: "Montserrat, sans-serif", position: "relative" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

        :root { --mouse-x: 50vw; --mouse-y: 50vh; }

        .db-mouse-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 1;
          background: radial-gradient(circle 500px at var(--mouse-x) var(--mouse-y), rgba(34,211,238,0.06), transparent 55%);
          mix-blend-mode: screen;
        }
        .db-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(143,160,215,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143,160,215,0.035) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
        }
        .db-orb1 {
          position: fixed; top: -200px; left: -200px; width: 500px; height: 500px;
          border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.12), transparent 60%);
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .db-orb2 {
          position: fixed; bottom: -250px; right: -250px; width: 600px; height: 600px;
          border-radius: 50%; background: radial-gradient(circle, rgba(94,119,192,0.14), transparent 60%);
          filter: blur(100px); pointer-events: none; z-index: 0;
        }

        /* Stat Cards */
        .stat-card {
          position: relative; overflow: hidden;
          background: rgba(15,23,42,0.65);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(143,160,215,0.13);
          border-radius: 16px;
          padding: 22px 24px;
          display: flex; align-items: center; gap: 18px;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34,211,238,0.25);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(34,211,238,0.08), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .stat-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .stat-label { color: #8FA0D7; font-size: 12px; font-weight: 500; margin-bottom: 4px; letter-spacing: 0.3px; }
        .stat-value { font-size: 36px; font-weight: 700; line-height: 1.1; font-family: Montserrat, sans-serif; }
        .stat-glow { position: absolute; inset: 0; pointer-events: none; }

        /* Glass Cards */
        .glass-panel {
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(143,160,215,0.13);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .glass-panel:hover { border-color: rgba(143,160,215,0.2); }

        .panel-header {
          padding: 20px 24px 0;
          display: flex; align-items: center; gap: 8px;
          font-family: 'EB Garamond', serif;
          font-size: 18px; font-weight: 600; color: #E5E9F7;
        }
        .panel-body { padding: 16px 24px 24px; }

        /* App rows */
        .app-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 14px; border-radius: 10px;
          border: 1px solid rgba(143,160,215,0.08);
          background: rgba(255,255,255,0.02);
          transition: all 0.2s ease;
          margin-bottom: 8px;
        }
        .app-row:last-child { margin-bottom: 0; }
        .app-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(143,160,215,0.16); transform: translateX(3px); }

        .app-company { font-size: 13.5px; font-weight: 600; color: #E5E9F7; }
        .app-role { font-size: 12px; color: #8FA0D7; margin-top: 2px; }

        /* Section badge */
        .section-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.2);
          color: #22D3EE; font-size: 11px; font-weight: 600; padding: 4px 12px;
          border-radius: 999px; letter-spacing: 0.5px; margin-bottom: 6px;
        }

        /* Add button */
        .btn-add {
          background: linear-gradient(135deg, #22D3EE, #06B6D4);
          color: #040814; border: none; padding: 10px 22px;
          border-radius: 999px; font-size: 13px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 6px 16px rgba(34,211,238,0.25);
          font-family: Montserrat, sans-serif;
        }
        .btn-add:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(34,211,238,0.4); }

        .empty-state {
          display: flex; align-items: center; justify-content: center;
          height: 100px; color: #5A6386; font-size: 13px;
        }

        /* Status badge */
        .status-pill {
          font-size: 11px; font-weight: 600; padding: 3px 10px;
          border-radius: 999px; border: 1px solid; white-space: nowrap;
        }
      `}</style>

      {/* Background layers */}
      <div className="db-grid" />
      <div className="db-orb1" />
      <div className="db-orb2" />
      <div className="db-mouse-glow" />

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          marginBottom: 40,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "none" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div>
            <div className="section-badge"><Sparkles size={10} /> Your Placement Overview</div>
            <h1 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: "#F8FAFF", lineHeight: 1.15, marginTop: 4 }}>
              Welcome back,{" "}
              <span style={{
                background: "linear-gradient(90deg, #22D3EE, #5E77C0, #06B6D4)",
                backgroundSize: "200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{user?.name}.</span>
            </h1>
            <p style={{ color: "#8FA0D7", fontSize: 14, marginTop: 8 }}>
              Here's a snapshot of your placement journey.
            </p>
          </div>
          <button className="btn-add mt-10" onClick={() => navigate("/applications")} style={{ flexShrink: 0 }}>
            <Plus size={15} /> Add Application
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 28 }}>
          <StatCard icon={BriefcaseBusiness} label="Total Applications" value={stats.total} color="#5E77C0" delay={100} />
          <StatCard icon={Clock} label="Interviews" value={stats.interview} color="#22D3EE" delay={180} />
          <StatCard icon={Trophy} label="Offers" value={stats.offer} color="#10b981" delay={260} />
          <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="#ef4444" delay={340} />
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 20 }}>

          {/* Donut */}
          <div className="glass-panel">
            <div className="panel-header">
              <TrendingUp size={16} color="#22D3EE" />
              Status Breakdown
            </div>
            <div className="panel-body">
              {chartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                        {chartData.map((entry) => (
                          <Cell key={entry.name} fill={COLORS[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                    {chartData.map((d) => (
                      <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[d.name], boxShadow: `0 0 6px ${COLORS[d.name]}` }} />
                          <span style={{ fontSize: 12, color: "#8FA0D7" }}>{d.name}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS[d.name] }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state" style={{ height: 240 }}>No applications yet</div>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-panel">
            <div className="panel-header">
              <TrendingUp size={16} color="#22D3EE" />
              Applications by Status
            </div>
            <div className="panel-body">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(143,160,215,0.08)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#8FA0D7", fontSize: 12, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#8FA0D7", fontSize: 12, fontFamily: "Montserrat" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(143,160,215,0.04)" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={COLORS[entry.name]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state" style={{ height: 240 }}>No data to display yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Upcoming Interviews */}
          <div className="glass-panel">
            <div className="panel-header">
              <CalendarDays size={16} color="#22D3EE" />
              Upcoming Interviews
            </div>
            <div className="panel-body">
              {upcoming.length > 0 ? upcoming.map((app) => (
                <div className="app-row" key={app.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1E2F66, #22D3EE33)", border: "1px solid rgba(34,211,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#22D3EE", flexShrink: 0 }}>
                      {app.company[0]}
                    </div>
                    <div>
                      <div className="app-company">{app.company}</div>
                      <div className="app-role">{app.role}</div>
                    </div>
                  </div>
                  <span className="status-pill" style={{ color: "#22D3EE", borderColor: "rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.08)" }}>Interview</span>
                </div>
              )) : (
                <div className="empty-state">No upcoming interviews</div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="glass-panel">
            <div className="panel-header">
              <BriefcaseBusiness size={16} color="#22D3EE" />
              Recent Applications
            </div>
            <div className="panel-body">
              {recent.length > 0 ? recent.map((app) => (
                <div className="app-row" key={app.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(94,119,192,0.15)", border: "1px solid rgba(94,119,192,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#5E77C0", flexShrink: 0 }}>
                      {app.company[0]}
                    </div>
                    <div>
                      <div className="app-company">{app.company}</div>
                      <div className="app-role">{app.role} · {app.dateApplied}</div>
                    </div>
                  </div>
                  <span className="status-pill" style={{
                    color: COLORS[app.status],
                    borderColor: `${COLORS[app.status]}40`,
                    background: `${COLORS[app.status]}12`,
                  }}>{app.status}</span>
                </div>
              )) : (
                <div className="empty-state">No applications yet</div>
              )}
            </div>
          </div>
        </div>

      </div>
      <OnboardingModal userEmail={user?.email} />
    </div>
  );
}