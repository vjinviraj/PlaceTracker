import { SignIn } from "@clerk/react";
import { BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";

export default function Login() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Montserrat:wght@400;500;600;700&display=swap');

        :root { --mouse-x: 50vw; --mouse-y: 50vh; --cyan: #06B6D4; --cyan-light: #CFFAFE; }

        .login-root {
          min-height: 100vh;
          background: #F0F4FF;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          font-family: Montserrat, sans-serif;
          position: relative;
        }

        /* Subtle dot grid */
        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(6,182,212,0.18) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
          z-index: 0;
        }

        /* Soft colour blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          width: 420px; height: 420px;
          top: -100px; right: -80px;
          background: radial-gradient(circle, rgba(6,182,212,0.22), transparent 65%);
        }
        .blob-2 {
          width: 340px; height: 340px;
          bottom: -80px; left: -60px;
          background: radial-gradient(circle, rgba(99,102,241,0.14), transparent 65%);
        }
        .mouse-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(circle 300px at var(--mouse-x) var(--mouse-y), rgba(6,182,212,0.08), transparent 60%);
        }

        /* Centered column — this is the ONLY layout we control */
        .login-col {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .login-col.show { opacity: 1; transform: none; }

        /* Logo block */
        .login-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 24px;
          width: 100%;
        }
        .login-logo-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #06B6D4, #0891B2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
          box-shadow: 0 8px 24px rgba(6,182,212,0.35), 0 2px 4px rgba(6,182,212,0.2);
        }
        .login-logo h1 {
          font-family: 'EB Garamond', serif;
          font-size: 34px;
          font-weight: 600;
          color: #0F172A;
          margin: 0;
          line-height: 1.15;
          letter-spacing: -0.3px;
        }
        .login-logo h1 span {
          color: #06B6D4;
          font-style: italic;
        }
        .login-logo p {
          font-size: 13px;
          color: #64748B;
          margin: 6px 0 0;
          font-weight: 500;
          letter-spacing: 0.1px;
        }

        /* Clerk card overrides — light, clean, sharp */
        .clerk-wrap {
          width: 100%;
        }
        .clerk-wrap .cl-rootBox { width: 100% !important; }
        .clerk-wrap .cl-card {
          width: 100% !important;
          background: #FFFFFF !important;
          border: 1px solid rgba(6,182,212,0.18) !important;
          border-radius: 18px !important;
          box-shadow:
            0 4px 6px rgba(15,23,42,0.04),
            0 20px 48px rgba(15,23,42,0.08),
            0 0 0 1px rgba(255,255,255,0.8) inset !important;
          padding: 28px 32px !important;
          margin: 0 !important;
        }
        .clerk-wrap .cl-headerTitle {
          font-family: 'EB Garamond', serif !important;
          font-size: 24px !important;
          font-weight: 600 !important;
          color: #0F172A !important;
          letter-spacing: -0.2px !important;
        }
        .clerk-wrap .cl-headerSubtitle {
          color: #64748B !important;
          font-size: 13px !important;
          font-family: Montserrat, sans-serif !important;
        }
        .clerk-wrap .cl-formFieldLabel {
          color: #374151 !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          font-family: Montserrat, sans-serif !important;
          letter-spacing: 0.2px !important;
        }
        .clerk-wrap .cl-formFieldInput {
          background: #F8FAFC !important;
          border: 1.5px solid #E2E8F0 !important;
          color: #0F172A !important;
          border-radius: 10px !important;
          font-family: Montserrat, sans-serif !important;
          font-size: 14px !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
        }
        .clerk-wrap .cl-formFieldInput::placeholder {
          color: #94A3B8 !important;
          opacity: 1 !important;
        }
        .clerk-wrap .cl-formFieldInput:focus {
          border-color: #06B6D4 !important;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.12) !important;
          outline: none !important;
          background: #FFFFFF !important;
        }
        .clerk-wrap .cl-formButtonPrimary {
          background: linear-gradient(135deg, #06B6D4, #0891B2) !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
          border: none !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 14px rgba(6,182,212,0.4) !important;
          font-size: 14px !important;
          font-family: Montserrat, sans-serif !important;
          letter-spacing: 0.2px !important;
          transition: all 0.2s ease !important;
        }
        .clerk-wrap .cl-formButtonPrimary:hover {
          box-shadow: 0 6px 20px rgba(6,182,212,0.55) !important;
          transform: translateY(-1px) !important;
        }
        .clerk-wrap .cl-footerActionLink {
          color: #06B6D4 !important;
          font-weight: 600 !important;
          font-family: Montserrat, sans-serif !important;
        }
        .clerk-wrap .cl-footerActionText {
          color: #64748B !important;
          font-family: Montserrat, sans-serif !important;
        }
        .clerk-wrap .cl-dividerLine { background: #E2E8F0 !important; }
        .clerk-wrap .cl-dividerText {
          color: #94A3B8 !important;
          font-size: 12px !important;
          font-family: Montserrat, sans-serif !important;
        }
        .clerk-wrap .cl-socialButtonsBlockButton {
          background: #F8FAFC !important;
          border: 1.5px solid #E2E8F0 !important;
          border-radius: 10px !important;
          transition: all 0.18s !important;
        }
        .clerk-wrap .cl-socialButtonsBlockButton:hover {
          border-color: #06B6D4 !important;
          background: #F0FDFF !important;
          box-shadow: 0 2px 8px rgba(6,182,212,0.12) !important;
        }
        .clerk-wrap .cl-socialButtonsBlockButtonText {
          color: #1E293B !important;
          font-family: Montserrat, sans-serif !important;
          font-weight: 500 !important;
        }
        .clerk-wrap .cl-formFieldInputShowPasswordButton { color: #94A3B8 !important; }
        .clerk-wrap .cl-formFieldInputShowPasswordButton:hover { color: #06B6D4 !important; }
        .clerk-wrap .cl-formFieldErrorText {
          color: #EF4444 !important;
          font-size: 12px !important;
          font-family: Montserrat, sans-serif !important;
        }
        .clerk-wrap .cl-formResendCodeLink { color: #06B6D4 !important; font-weight: 600 !important; }
        .clerk-wrap .cl-otpCodeFieldInput {
          background: #F8FAFC !important;
          border: 1.5px solid #E2E8F0 !important;
          color: #0F172A !important;
          border-radius: 10px !important;
        }
        .clerk-wrap .cl-identityPreviewText { color: #0F172A !important; }
        .clerk-wrap .cl-identityPreviewEditButton { color: #06B6D4 !important; }
        .clerk-wrap .cl-phoneInputBox {
          background: #F8FAFC !important;
          border: 1.5px solid #E2E8F0 !important;
          border-radius: 10px !important;
        }
        .clerk-wrap .cl-phoneInputBox input { color: #0F172A !important; }
        .clerk-wrap .cl-phoneInputBox input::placeholder { color: #94A3B8 !important; opacity: 1 !important; }
        .clerk-wrap .cl-selectButton {
          background: #F8FAFC !important;
          border-color: #E2E8F0 !important;
          color: #0F172A !important;
        }
        .clerk-wrap .cl-internal-b3fm6y { background: #FFFFFF !important; }
        .clerk-wrap .cl-alertText { color: #0F172A !important; }
      `}</style>

      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="mouse-glow" />

      <div className="login-root">
        <div className={`login-col ${mounted ? "show" : ""}`}>

          <div className="login-logo">
            <div className="login-logo-icon">
              <BriefcaseBusiness size={24} color="#fff" />
            </div>
            <h1>Place<span>Tracker</span></h1>
            <p>Your placement journey, organised.</p>
          </div>

          <div className="clerk-wrap">
            <SignIn
              appearance={{ variables: {
                colorPrimary: "#06B6D4",
                colorBackground: "#FFFFFF",
                colorInputBackground: "#F8FAFC",
                colorInputText: "#0F172A",
                colorText: "#0F172A",
                colorTextSecondary: "#64748B",
                colorNeutral: "#64748B",
                colorTextOnPrimaryBackground: "#FFFFFF",
                borderRadius: "10px",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "14px",
              }}}
              routing="hash"
              signUpUrl="/register"
              redirectUrl="/dashboard"
            />
          </div>

        </div>
      </div>
    </>
  );
}