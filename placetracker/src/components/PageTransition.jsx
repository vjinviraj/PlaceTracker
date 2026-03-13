// src/components/PageTransition.jsx
// Wrap your route outlet in this component for smooth page transitions
//
// In your ProtectedRoute or Layout component:
//   import PageTransition from "../components/PageTransition"
//   <PageTransition><Outlet /></PageTransition>
//
// OR wrap each page element in App.jsx:
//   element={<PageTransition><Dashboard /></PageTransition>}

import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children, mode = "fade-slide" }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState("in"); // "in" | "out"
  const prevPathRef = useRef(location.pathname);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) {
      setDisplayChildren(children);
      return;
    }

    // Start exit
    setPhase("out");
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      prevPathRef.current = location.pathname;
      setDisplayChildren(children);
      setPhase("in");
    }, 160);

    return () => clearTimeout(timeoutRef.current);
  }, [location.pathname, children]);

  const styles = {
    "fade-slide": {
      in:  { opacity: 1,   transform: "translateY(0px)"   },
      out: { opacity: 0,   transform: "translateY(10px)"  },
    },
    "fade": {
      in:  { opacity: 1 },
      out: { opacity: 0 },
    },
  };

  const style = styles[mode] || styles["fade-slide"];

  return (
    <div
      style={{
        ...style[phase],
        transition: phase === "in"
          ? "opacity 0.3s ease, transform 0.3s cubic-bezier(0.25,1,0.5,1)"
          : "opacity 0.16s ease, transform 0.16s ease",
        willChange: "opacity, transform",
        minHeight: "100vh",
      }}
    >
      {displayChildren}
    </div>
  );
}