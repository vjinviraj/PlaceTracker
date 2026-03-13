import { useState, useEffect } from "react";
import {
  HelpCircle, PlusCircle, RefreshCw, Map,
  KeyRound, ChevronDown, ChevronUp, Mail, BookOpen, Sparkles,
} from "lucide-react";

const FAQS = [
  {
    id: "add-job", icon: PlusCircle,
    question: "How do I add a job application?",
    answer: "Go to the Applications page and click the 'Add Application' button in the top right. Fill in the company name, job role, application date, and status. You can also add the job link for quick reference. Click 'Add Application' to save it.",
  },
  {
    id: "update-status", icon: RefreshCw,
    question: "How do I update the status of an application?",
    answer: "On the Applications page, find the application you want to update and click the pencil (edit) icon on the right. Change the status from the dropdown — options are Applied, Interview, Offer, or Rejected — and click 'Save Changes'.",
  },
  {
    id: "roadmap", icon: Map,
    question: "How does the Preparation Roadmap work?",
    answer: "The Roadmap page lets you track your study progress across topics like DSA, DBMS, OS, and more. Click on any topic to cycle through three states: Not Started → In Progress → Completed. You can add custom topics inside any category, or create entirely new categories using the 'Add Category' button.",
  },
  {
    id: "password", icon: KeyRound,
    question: "How do I reset or change my password?",
    answer: "Go to the Profile page and scroll to the 'Change Password' section. Enter your current password, then your new password twice. Your new password must be at least 8 characters long. Click 'Update Password' to save the change.",
  },
  {
    id: "dashboard", icon: BookOpen,
    question: "What does the Dashboard show?",
    answer: "The Dashboard gives you a quick overview of your placement journey. It shows summary cards for total applications, interviews, offers, and rejections. It also includes a pie chart and bar chart breaking down your application statuses, a list of upcoming interviews, and your most recent applications.",
  },
  {
    id: "delete", icon: HelpCircle,
    question: "How do I delete my account?",
    answer: "Go to the Profile page and scroll to the Danger Zone section. Click 'Delete Account'. You will be asked to type your email address to confirm. Once confirmed, your account and all associated data including applications and roadmap progress will be permanently deleted.",
  },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const Icon = item.icon;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120 + index * 70);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`faq-item ${open ? "faq-open" : ""}`}
      onClick={() => setOpen(!open)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms, border-color 0.25s, box-shadow 0.25s`,
      }}
    >
      <div className="faq-trigger">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="faq-icon-wrap" style={{ background: open ? "rgba(34,211,238,0.12)" : "rgba(34,211,238,0.07)", borderColor: open ? "rgba(34,211,238,0.3)" : "rgba(34,211,238,0.15)" }}>
            <Icon size={15} color="#22D3EE" />
          </div>
          <span className="faq-question">{item.question}</span>
        </div>
        <div className="faq-chevron" style={{ color: open ? "#22D3EE" : "#5A6386" }}>
          {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </div>
      </div>

      {open && (
        <div className="faq-body">
          <div className="faq-divider" />
          <p className="faq-answer">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function Help() {
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

  return (
    <div style={{ minHeight: "100vh", background: "#02050E", overflowX: "hidden", paddingTop: 80, fontFamily: "Montserrat, sans-serif", position: "relative" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        :root { --mouse-x: 50vw; --mouse-y: 50vh; }

        .hp-mouse-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; background: radial-gradient(circle 500px at var(--mouse-x) var(--mouse-y), rgba(34,211,238,0.05), transparent 55%); mix-blend-mode: screen; }
        .hp-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(143,160,215,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(143,160,215,0.03) 1px, transparent 1px); background-size: 50px 50px; mask-image: linear-gradient(to bottom, black 0%, transparent 100%); }
        .hp-orb1 { position: fixed; top: -120px; left: -120px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.09), transparent 60%); filter: blur(80px); pointer-events: none; z-index: 0; }
        .hp-orb2 { position: fixed; bottom: -160px; right: -160px; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, rgba(94,119,192,0.1), transparent 60%); filter: blur(90px); pointer-events: none; z-index: 0; }

        .page-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.2); color: #22D3EE; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 999px; letter-spacing: 0.5px; margin-bottom: 6px; }

        /* Hero banner */
        .help-hero {
          background: rgba(15,23,42,0.6); backdrop-filter: blur(16px);
          border: 1px solid rgba(143,160,215,0.13); border-radius: 18px;
          padding: 28px 28px; margin-bottom: 28px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
          position: relative; overflow: hidden;
        }
        .help-hero::before {
          content: ''; position: absolute; top: -60px; right: -60px; width: 220px; height: 220px;
          border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.1), transparent 60%);
          pointer-events: none;
        }
        .hero-icon-large {
          width: 56px; height: 56px; border-radius: 16px;
          background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.25);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          box-shadow: 0 0 20px rgba(34,211,238,0.1);
        }

        /* FAQ items */
        .faq-item {
          background: rgba(15,23,42,0.55); backdrop-filter: blur(12px);
          border: 1px solid rgba(143,160,215,0.12); border-radius: 14px;
          overflow: hidden; cursor: pointer;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          margin-bottom: 10px;
        }
        .faq-item:hover { border-color: rgba(143,160,215,0.22); }
        .faq-open { border-color: rgba(34,211,238,0.25) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(34,211,238,0.05); }

        .faq-trigger { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; }
        .faq-icon-wrap { width: 34px; height: 34px; border-radius: 10px; border: 1px solid; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s, border-color 0.2s; }
        .faq-question { font-size: 14px; font-weight: 600; color: #E5E9F7; line-height: 1.4; }
        .faq-chevron { flex-shrink: 0; margin-left: 14px; transition: color 0.2s; }

        .faq-body { padding: 0 20px 18px; }
        .faq-divider { height: 1px; background: rgba(143,160,215,0.1); margin-bottom: 14px; }
        .faq-answer { font-size: 13.5px; color: #8FA0D7; line-height: 1.8; padding-left: 48px; }

        /* Contact card */
        .contact-card {
          background: rgba(15,23,42,0.6); backdrop-filter: blur(16px);
          border: 1px solid rgba(143,160,215,0.13); border-radius: 18px;
          padding: 28px; margin-top: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
          position: relative; overflow: hidden;
          transition: border-color 0.3s;
        }
        .contact-card:hover { border-color: rgba(34,211,238,0.2); }
        .contact-card::before {
          content: ''; position: absolute; bottom: -40px; left: -40px; width: 160px; height: 160px;
          border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.06), transparent 60%);
          pointer-events: none;
        }
        .contact-icon-wrap { width: 46px; height: 46px; border-radius: 14px; background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 16px rgba(34,211,238,0.1); }
        .contact-email { display: inline-block; margin-top: 12px; color: #22D3EE; font-size: 14px; font-weight: 600; text-decoration: none; padding: 8px 18px; border-radius: 999px; border: 1px solid rgba(34,211,238,0.25); background: rgba(34,211,238,0.06); transition: all 0.2s; }
        .contact-email:hover { background: rgba(34,211,238,0.12); border-color: rgba(34,211,238,0.45); box-shadow: 0 4px 14px rgba(34,211,238,0.2); }
      `}</style>

      <div className="hp-grid" />
      <div className="hp-orb1" />
      <div className="hp-orb2" />
      <div className="hp-mouse-glow" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 2 }}>

        {/* Page Header */}
        <div style={{
          marginBottom: 32,
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div className="page-badge"><Sparkles size={10} /> Support</div>
          <h1 style={{ fontFamily: "EB Garamond, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 600, color: "#F8FAFF", lineHeight: 1.2, marginTop: 4 }}>
            Help & FAQ
          </h1>
          <p style={{ color: "#8FA0D7", fontSize: 13.5, marginTop: 6 }}>
            Find answers to common questions about PlaceTracker
          </p>
        </div>

        {/* Hero Banner */}
        <div className="help-hero" style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)", transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative", zIndex: 1 }}>
            <div className="hero-icon-large">
              <HelpCircle size={24} color="#22D3EE" />
            </div>
            <div>
              <div style={{ fontFamily: "EB Garamond, serif", fontSize: 20, fontWeight: 600, color: "#E5E9F7", marginBottom: 4 }}>
                How can we help you?
              </div>
              <p style={{ color: "#8FA0D7", fontSize: 13.5, lineHeight: 1.6 }}>
                Click on any question below to expand the answer.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div style={{ marginBottom: 10 }}>
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.id} item={faq} index={i} />
          ))}
        </div>

        {/* Contact Card */}
        <div className="contact-card" style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)", transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, position: "relative", zIndex: 1 }}>
            <div className="contact-icon-wrap">
              <Mail size={20} color="#22D3EE" />
            </div>
            <div>
              <div style={{ fontFamily: "EB Garamond, serif", fontSize: 19, fontWeight: 600, color: "#E5E9F7", marginBottom: 6 }}>
                Still have questions?
              </div>
              <p style={{ color: "#8FA0D7", fontSize: 13.5, lineHeight: 1.75, maxWidth: 480 }}>
                If you couldn't find what you were looking for, feel free to reach out. We're happy to help you get the most out of PlaceTracker.
              </p>
              <a href="mailto:support@placetracker.app" className="contact-email">
                support@placetracker.app
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}