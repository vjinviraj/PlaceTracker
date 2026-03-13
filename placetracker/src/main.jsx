import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider afterSignOutUrl="/">
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(10,18,42,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(143,160,215,0.18)",
            borderRadius: "12px",
            color: "#E5E9F7",
            fontSize: "13.5px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "500",
            padding: "12px 18px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#02050E" },
            style: {
              background: "rgba(10,18,42,0.95)",
              border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: "12px",
              color: "#E5E9F7",
              fontSize: "13.5px",
              fontFamily: "Montserrat, sans-serif",
              padding: "12px 18px",
            },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#02050E" },
            style: {
              background: "rgba(10,18,42,0.95)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "12px",
              color: "#E5E9F7",
              fontSize: "13.5px",
              fontFamily: "Montserrat, sans-serif",
              padding: "12px 18px",
            },
          },
        }}
      />
    </ClerkProvider>
  </StrictMode>
);