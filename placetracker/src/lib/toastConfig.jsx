// src/lib/toastConfig.jsx
// Custom toast styles matching PlaceTracker glass design system
// Usage in main.jsx or App.jsx:
//   import { Toaster } from "react-hot-toast"
//   import { toastOptions } from "./lib/toastConfig"
//   <Toaster toastOptions={toastOptions} position="bottom-right" />

export const toastOptions = {
  duration: 3000,
  style: {
    background: "rgba(10, 18, 42, 0.95)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(143, 160, 215, 0.18)",
    borderRadius: "12px",
    color: "#E5E9F7",
    fontSize: "13.5px",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "500",
    padding: "12px 18px",
    boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
    maxWidth: "380px",
    lineHeight: "1.5",
  },
  success: {
    iconTheme: { primary: "#10b981", secondary: "#02050E" },
    style: {
      background: "rgba(10, 18, 42, 0.95)",
      border: "1px solid rgba(16, 185, 129, 0.25)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: "12px",
      color: "#E5E9F7",
      fontSize: "13.5px",
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "500",
      padding: "12px 18px",
      boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
    },
  },
  error: {
    iconTheme: { primary: "#ef4444", secondary: "#02050E" },
    style: {
      background: "rgba(10, 18, 42, 0.95)",
      border: "1px solid rgba(239, 68, 68, 0.25)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: "12px",
      color: "#E5E9F7",
      fontSize: "13.5px",
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "500",
      padding: "12px 18px",
      boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
    },
  },
};