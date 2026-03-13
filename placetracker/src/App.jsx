import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Calendar from "./pages/Calendar";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Shows a full-screen spinner while Clerk initialises
function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", background:"#02050E", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:36, height:36, border:"3px solid rgba(34,211,238,0.15)", borderTop:"3px solid #22D3EE", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Redirects signed-in users away from login/register/landing
// Waits for Clerk to fully load before deciding — prevents flash of wrong page
function PublicRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (isSignedIn) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — redirect to dashboard if already signed in */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />

        {/* Auth pages — redirect to dashboard if already signed in */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected — requires Clerk session */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/calendar"     element={<Calendar />} />
          <Route path="/roadmap"      element={<Roadmap />} />
          <Route path="/profile"      element={<Profile />} />
          <Route path="/help"         element={<Help />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}