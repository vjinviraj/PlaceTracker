import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Plus, CheckCircle2, Circle, Clock,
  ChevronDown, ChevronUp, Map, Trash2, X, Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { EmptyRoadmap } from "../components/EmptyStates";

const DEFAULT_CATEGORIES = [
  {
    id: "dsa", label: "Data Structures & Algorithms", emoji: "🧠",
    topics: [
      { id: "arrays", label: "Arrays", status: "not-started" },
      { id: "linked-list", label: "Linked List", status: "not-started" },
      { id: "stacks-queues", label: "Stacks & Queues", status: "not-started" },
      { id: "trees", label: "Trees", status: "not-started" },
      { id: "graphs", label: "Graphs", status: "not-started" },
      { id: "dp", label: "Dynamic Programming", status: "not-started" },
      { id: "sorting", label: "Sorting Algorithms", status: "not-started" },
      { id: "hashing", label: "Hashing", status: "not-started" },
    ],
  },
  {
    id: "dbms", label: "Database Management", emoji: "🗄️",
    topics: [
      { id: "sql-basics", label: "SQL Basics", status: "not-started" },
      { id: "joins", label: "Joins & Subqueries", status: "not-started" },
      { id: "normalization", label: "Normalization", status: "not-started" },
      { id: "transactions", label: "Transactions & ACID", status: "not-started" },
      { id: "indexing", label: "Indexing", status: "not-started" },
    ],
  },
  {
    id: "os", label: "Operating Systems", emoji: "💻",
    topics: [
      { id: "processes", label: "Processes & Threads", status: "not-started" },
      { id: "scheduling", label: "CPU Scheduling", status: "not-started" },
      { id: "memory", label: "Memory Management", status: "not-started" },
      { id: "deadlock", label: "Deadlocks", status: "not-started" },
      { id: "file-systems", label: "File Systems", status: "not-started" },
    ],
  },
  {
    id: "cn", label: "Computer Networks", emoji: "🌐",
    topics: [
      { id: "osi", label: "OSI Model", status: "not-started" },
      { id: "tcp-ip", label: "TCP/IP", status: "not-started" },
      { id: "http", label: "HTTP & HTTPS", status: "not-started" },
      { id: "dns", label: "DNS & DHCP", status: "not-started" },
      { id: "sockets", label: "Sockets", status: "not-started" },
    ],
  },
  {
    id: "aptitude", label: "Aptitude & Reasoning", emoji: "🧮",
    topics: [
      { id: "quant", label: "Quantitative Aptitude", status: "not-started" },
      { id: "logical", label: "Logical Reasoning", status: "not-started" },
      { id: "verbal", label: "Verbal Ability", status: "not-started" },
    ],
  },
];

const STATUS_CONFIG = {
  "not-started": { label: "Not Started", icon: Circle,       color: "#5A6386", next: "in-progress" },
  "in-progress":  { label: "In Progress",  icon: Clock,        color: "#22D3EE", next: "completed"  },
  "completed":    { label: "Completed",    icon: CheckCircle2, color: "#10b981", next: "not-started" },
};

function getProgress(topics) {
  if (!topics.length) return 0;
  return Math.round((topics.filter((t) => t.status === "completed").length / topics.length) * 100);
}

/* ─── Category Card ─── */
function CategoryCard({ category, onTopicToggle, onAddTopic, onDeleteTopic }) {
  const [expanded, setExpanded] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  const progress = getProgress(category.topics);
  const completed = category.topics.filter((t) => t.status === "completed").length;
  const inProgress = category.topics.filter((t) => t.status === "in-progress").length;
  const progressColor = progress === 100 ? "#10b981" : "#22D3EE";

  const handleAdd = () => {
    if (!newTopic.trim()) { toast.error("Topic name cannot be empty"); return; }
    onAddTopic(category.id, newTopic.trim());
    setNewTopic(""); setAdding(false);
    toast.success("Topic added!");
  };

  return (
    <div className="cat-card">
      {/* Header */}
      <div className="cat-header" onClick={() => setExpanded(!expanded)}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="cat-emoji-wrap">{category.emoji}</div>
          <div>
            <div className="cat-title">{category.label}</div>
            <div className="cat-meta">
              <span style={{ color: "#10b981" }}>{completed} done</span>
              {" · "}
              <span style={{ color: "#22D3EE" }}>{inProgress} in progress</span>
              {" · "}
              <span>{category.topics.length} total</span>
            </div>
          </div>
        </div>
        <button className="chevron-btn">
          {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#5A6386", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: progressColor, textShadow: `0 0 10px ${progressColor}50` }}>{progress}%</span>
        </div>
        <div style={{ height: 5, background: "rgba(143,160,215,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`, borderRadius: 4,
            background: progressColor,
            boxShadow: `0 0 10px ${progressColor}`,
            transition: "width 0.6s cubic-bezier(0.25,1,0.5,1)",
          }} />
        </div>
      </div>

      {/* Topics */}
      {expanded && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {category.topics.map((topic) => {
              const cfg = STATUS_CONFIG[topic.status];
              const Icon = cfg.icon;
              return (
                <div key={topic.id} className="topic-row" style={{ "--status-color": cfg.color }}>
                  <button
                    onClick={() => onTopicToggle(category.id, topic.id)}
                    style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
                  >
                    <Icon size={16} style={{ color: cfg.color, flexShrink: 0, filter: topic.status !== "not-started" ? `drop-shadow(0 0 4px ${cfg.color}80)` : "none" }} />
                    <span style={{
                      fontSize: 13.5, color: topic.status === "completed" ? "#5A6386" : "#E5E9F7",
                      textDecoration: topic.status === "completed" ? "line-through" : "none",
                      transition: "color 0.2s",
                    }}>{topic.label}</span>
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="status-tag" style={{ color: cfg.color, borderColor: `${cfg.color}35`, background: `${cfg.color}10` }}>
                      {cfg.label}
                    </span>
                    <button
                      onClick={() => onDeleteTopic(category.id, topic.id)}
                      className="del-topic-btn"
                    ><Trash2 size={12} /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add topic */}
          {adding ? (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input
                placeholder="Topic name…"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                autoFocus
                className="topic-input"
              />
              <button className="btn-add-topic" onClick={handleAdd}>Add</button>
              <button className="btn-cancel-topic" onClick={() => { setAdding(false); setNewTopic(""); }}>Cancel</button>
            </div>
          ) : (
            <button className="add-topic-link" onClick={() => setAdding(true)}>
              <Plus size={13} /> Add topic
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Add Category Modal ─── */
function AddCategoryModal({ open, onClose, onAdd }) {
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("📚");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) { toast.error("Category name cannot be empty"); return; }
    onAdd({ label: label.trim(), emoji });
    setLabel(""); setEmoji("📚"); onClose();
    toast.success("Category added!");
  };

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Map size={16} color="#22D3EE" />
            </div>
            <span className="modal-title">Add Category</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="field-label">Emoji</label>
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="📚"
                className="field-input" style={{ width: 64, textAlign: "center", fontSize: 20 }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="field-label">Category Name</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. System Design" autoFocus className="field-input" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="btn-cancel" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" style={{ flex: 1 }}>Add Category</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function Roadmap() {
  const { user } = useAuth();
  const storageKey = `placetracker_roadmap_${user?.email}`;
  const [mounted, setMounted] = useState(false);

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  const [addCatOpen, setAddCatOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const persist = (updated) => { setCategories(updated); localStorage.setItem(storageKey, JSON.stringify(updated)); };

  const handleTopicToggle = (catId, topicId) => persist(
    categories.map((cat) => cat.id !== catId ? cat : {
      ...cat,
      topics: cat.topics.map((t) => t.id !== topicId ? t : { ...t, status: STATUS_CONFIG[t.status].next }),
    })
  );

  const handleAddTopic = (catId, label) => persist(
    categories.map((cat) => cat.id !== catId ? cat : {
      ...cat, topics: [...cat.topics, { id: `${catId}-${Date.now()}`, label, status: "not-started" }],
    })
  );

  const handleDeleteTopic = (catId, topicId) => {
    persist(categories.map((cat) => cat.id !== catId ? cat : { ...cat, topics: cat.topics.filter((t) => t.id !== topicId) }));
    toast.success("Topic removed");
  };

  const handleAddCategory = ({ label, emoji }) => {
    persist([...categories, { id: `cat-${Date.now()}`, label, emoji, topics: [] }]);
  };

  const totalTopics = categories.reduce((sum, c) => sum + c.topics.length, 0);
  const totalCompleted = categories.reduce((sum, c) => sum + c.topics.filter((t) => t.status === "completed").length, 0);
  const overallProgress = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
  const overallColor = overallProgress === 100 ? "#10b981" : "#22D3EE";

  return (
    <div style={{ minHeight: "100vh", background: "#02050E", overflowX: "hidden", paddingTop: 80, fontFamily: "Montserrat, sans-serif", position: "relative" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        :root { --mouse-x: 50vw; --mouse-y: 50vh; }

        .rm-mouse-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; background: radial-gradient(circle 500px at var(--mouse-x) var(--mouse-y), rgba(34,211,238,0.055), transparent 55%); mix-blend-mode: screen; }
        .rm-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(143,160,215,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(143,160,215,0.035) 1px, transparent 1px); background-size: 50px 50px; mask-image: linear-gradient(to bottom, black 0%, transparent 100%); }
        .rm-orb1 { position: fixed; top: -150px; left: -150px; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.1), transparent 60%); filter: blur(80px); pointer-events: none; z-index: 0; }
        .rm-orb2 { position: fixed; bottom: -200px; right: -200px; width: 550px; height: 550px; border-radius: 50%; background: radial-gradient(circle, rgba(94,119,192,0.12), transparent 60%); filter: blur(100px); pointer-events: none; z-index: 0; }

        .page-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.2); color: #22D3EE; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 999px; letter-spacing: 0.5px; margin-bottom: 6px; }

        .btn-add-hero { background: linear-gradient(135deg, #22D3EE, #06B6D4); color: #040814; border: none; padding: 11px 24px; border-radius: 999px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s cubic-bezier(0.25,1,0.5,1); box-shadow: 0 6px 16px rgba(34,211,238,0.25); font-family: Montserrat, sans-serif; flex-shrink: 0; }
        .btn-add-hero:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(34,211,238,0.4); }

        /* Overall progress card */
        .overall-card { background: rgba(15,23,42,0.65); backdrop-filter: blur(16px); border: 1px solid rgba(143,160,215,0.13); border-radius: 18px; padding: 28px 28px 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04); margin-bottom: 28px; position: relative; overflow: hidden; }
        .overall-card::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.08), transparent 60%); pointer-events: none; }

        /* Legend items */
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; }

        /* Category cards */
        .cat-card { background: rgba(15,23,42,0.6); backdrop-filter: blur(14px); border: 1px solid rgba(143,160,215,0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03); transition: border-color 0.3s ease, box-shadow 0.3s ease; }
        .cat-card:hover { border-color: rgba(143,160,215,0.2); box-shadow: 0 16px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04); }

        .cat-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 14px; cursor: pointer; user-select: none; }
        .cat-emoji-wrap { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(143,160,215,0.1); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .cat-title { font-family: 'EB Garamond', serif; font-size: 17px; font-weight: 600; color: #E5E9F7; margin-bottom: 3px; }
        .cat-meta { font-size: 11.5px; color: #5A6386; }
        .chevron-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(143,160,215,0.12); background: transparent; color: #5A6386; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .chevron-btn:hover { border-color: rgba(34,211,238,0.3); color: #22D3EE; background: rgba(34,211,238,0.05); }

        /* Topic rows */
        .topic-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(143,160,215,0.08); background: rgba(255,255,255,0.02); transition: all 0.2s ease; }
        .topic-row:hover { background: rgba(255,255,255,0.04); border-color: var(--status-color, rgba(143,160,215,0.15)); }

        .status-tag { font-size: 10.5px; font-weight: 600; padding: 3px 10px; border-radius: 999px; border: 1px solid; white-space: nowrap; display: none; }
        @media (min-width: 480px) { .status-tag { display: inline-block; } }

        .del-topic-btn { width: 26px; height: 26px; border-radius: 7px; border: none; background: transparent; color: #5A6386; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.15s; }
        .topic-row:hover .del-topic-btn { opacity: 1; }
        .del-topic-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }

        .add-topic-link { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 12px; color: #5A6386; background: none; border: none; cursor: pointer; transition: color 0.2s; font-family: Montserrat, sans-serif; }
        .add-topic-link:hover { color: #22D3EE; }

        .topic-input { flex: 1; height: 36px; padding: 0 12px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(143,160,215,0.2); color: #E5E9F7; font-size: 13px; outline: none; font-family: Montserrat, sans-serif; transition: border-color 0.2s; }
        .topic-input::placeholder { color: #5A6386; }
        .topic-input:focus { border-color: rgba(34,211,238,0.4); box-shadow: 0 0 0 3px rgba(34,211,238,0.06); }
        .btn-add-topic { padding: 0 16px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #22D3EE, #06B6D4); color: #040814; font-size: 12px; font-weight: 700; border: none; cursor: pointer; flex-shrink: 0; font-family: Montserrat, sans-serif; transition: box-shadow 0.2s; }
        .btn-add-topic:hover { box-shadow: 0 4px 12px rgba(34,211,238,0.35); }
        .btn-cancel-topic { padding: 0 14px; height: 36px; border-radius: 8px; background: transparent; color: #8FA0D7; font-size: 12px; font-weight: 500; border: 1px solid rgba(143,160,215,0.2); cursor: pointer; flex-shrink: 0; font-family: Montserrat, sans-serif; }
        .btn-cancel-topic:hover { border-color: rgba(143,160,215,0.4); }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; z-index: 9000; background: rgba(2,5,14,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal-box { background: rgba(10,18,42,0.96); backdrop-filter: blur(24px); border: 1px solid rgba(143,160,215,0.18); border-radius: 20px; padding: 28px; width: 100%; box-shadow: 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05); font-family: Montserrat, sans-serif; animation: modalIn 0.25s cubic-bezier(0.25,1,0.5,1); }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(12px); } to { opacity: 1; transform: none; } }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .modal-title { font-family: 'EB Garamond', serif; font-size: 20px; font-weight: 600; color: #E5E9F7; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(143,160,215,0.15); background: transparent; color: #8FA0D7; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .modal-close:hover { border-color: rgba(239,68,68,0.35); color: #ef4444; }
        .field-label { font-size: 12px; font-weight: 600; color: #8FA0D7; letter-spacing: 0.3px; }
        .field-input { height: 40px; padding: 0 12px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(143,160,215,0.15); color: #E5E9F7; font-size: 13px; outline: none; transition: border-color 0.2s; font-family: Montserrat, sans-serif; width: 100%; }
        .field-input::placeholder { color: #5A6386; }
        .field-input:focus { border-color: rgba(34,211,238,0.4); box-shadow: 0 0 0 3px rgba(34,211,238,0.06); }
        .btn-cancel { height: 42px; border-radius: 999px; font-size: 13px; font-weight: 600; background: transparent; border: 1px solid rgba(143,160,215,0.2); color: #8FA0D7; cursor: pointer; transition: all 0.2s; font-family: Montserrat, sans-serif; }
        .btn-cancel:hover { border-color: rgba(143,160,215,0.4); color: #E5E9F7; }
        .btn-submit { height: 42px; border-radius: 999px; font-size: 13px; font-weight: 700; background: linear-gradient(135deg, #22D3EE, #06B6D4); color: #040814; border: none; cursor: pointer; transition: all 0.3s; box-shadow: 0 6px 16px rgba(34,211,238,0.25); font-family: Montserrat, sans-serif; }
        .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(34,211,238,0.4); }
      `}</style>

      <div className="rm-grid" />
      <div className="rm-orb1" />
      <div className="rm-orb2" />
      <div className="rm-mouse-glow" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32,
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div>
            <div className="page-badge"><Sparkles size={10} /> Study Progress</div>
            <h1 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 600, color: "#F8FAFF", lineHeight: 1.2, marginTop: 4 }}>
              Preparation Roadmap
            </h1>
            <p style={{ color: "#8FA0D7", fontSize: 13.5, marginTop: 6 }}>
              Track your study progress topic by topic
            </p>
          </div>
          <button className="btn-add-hero mt-10" onClick={() => setAddCatOpen(true)}>
            <Plus size={15} /> Add Category
          </button>
        </div>

        {/* Overall Progress */}
        <div className="overall-card">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: "EB Garamond, serif", fontSize: 22, fontWeight: 600, color: "#E5E9F7", marginBottom: 4 }}>Overall Progress</div>
              <div style={{ fontSize: 13, color: "#8FA0D7" }}>
                <span style={{ color: "#10b981", fontWeight: 600 }}>{totalCompleted}</span>
                {" of "}
                <span style={{ color: "#E5E9F7", fontWeight: 600 }}>{totalTopics}</span>
                {" topics completed"}
              </div>
            </div>
            <div style={{ fontSize: 42, fontWeight: 700, color: overallColor, textShadow: `0 0 24px ${overallColor}50`, lineHeight: 1, fontFamily: "Montserrat, sans-serif" }}>
              {overallProgress}%
            </div>
          </div>

          <div style={{ height: 8, background: "rgba(143,160,215,0.08)", borderRadius: 6, overflow: "hidden", marginBottom: 18 }}>
            <div style={{
              height: "100%", width: `${overallProgress}%`, borderRadius: 6,
              background: overallColor, boxShadow: `0 0 14px ${overallColor}80`,
              transition: "width 0.8s cubic-bezier(0.25,1,0.5,1)",
            }} />
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { icon: Circle, color: "#5A6386", label: "Not Started" },
              { icon: Clock, color: "#22D3EE", label: "In Progress" },
              { icon: CheckCircle2, color: "#10b981", label: "Completed" },
            ].map(({ icon: Icon, color, label }) => (
              <div key={label} className="legend-item" style={{ color }}>
                <Icon size={13} style={{ filter: color !== "#5A6386" ? `drop-shadow(0 0 4px ${color}80)` : "none" }} />
                <span style={{ fontSize: 12, color: color === "#5A6386" ? "#5A6386" : color }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id} category={cat}
              onTopicToggle={handleTopicToggle}
              onAddTopic={handleAddTopic}
              onDeleteTopic={handleDeleteTopic}
            />
          ))}
        </div>
      </div>

      <AddCategoryModal open={addCatOpen} onClose={() => setAddCatOpen(false)} onAdd={handleAddCategory} />
    </div>
  );
}