import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard, BriefcaseBusiness, Map,
  UserCircle, HelpCircle, LogOut, Menu, Calendar,
} from "lucide-react";
import { ReminderBell } from "./Reminders";

const navItems = [
  { to:"/dashboard",    label:"Dashboard",    icon:LayoutDashboard   },
  { to:"/applications", label:"Applications", icon:BriefcaseBusiness },
  { to:"/calendar",     label:"Calendar",     icon:Calendar          },
  { to:"/roadmap",      label:"Roadmap",      icon:Map               },
  { to:"/profile",      label:"Profile",      icon:UserCircle        },
  { to:"/help",         label:"Help",         icon:HelpCircle        },
];

function NavItems({ onClose }) {
  return (
    <>
      {navItems.map(({ to, label, icon:Icon }) => (
        <NavLink key={to} to={to} onClick={onClose}
          className={({ isActive }) => `nav-item${isActive?" nav-item-active":""}`}>
          <Icon size={15}/><span>{label}</span>
        </NavLink>
      ))}
    </>
  );
}

export default function Navbar() {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Normalise Clerk user to the shape the navbar expects
  const user = clerkUser ? {
    name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
    email: clerkUser.emailAddresses[0]?.emailAddress || "",
    imageUrl: clerkUser.imageUrl,
  } : null;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        .pt-navbar { position:fixed; top:16px; left:50%; transform:translateX(-50%); z-index:1000; width:calc(100% - 48px); max-width:1080px; height:56px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; border-radius:999px; background:rgba(8,14,36,0.4); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(143,160,215,0.12); box-shadow:0 4px 24px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.04); transition:all 0.4s cubic-bezier(0.25,1,0.5,1); font-family:'Montserrat',sans-serif; }
        .pt-navbar.scrolled { top:12px; background:rgba(5,9,24,0.88); border-color:rgba(34,211,238,0.22); box-shadow:0 10px 40px rgba(0,0,0,0.6),0 0 0 1px rgba(34,211,238,0.08),inset 0 1px 0 rgba(255,255,255,0.06); width:calc(100% - 24px); }
        .pt-logo { display:flex; align-items:center; gap:10px; text-decoration:none; flex-shrink:0; cursor:pointer; }
        .pt-logo-icon { width:32px; height:32px; border-radius:9px; background:linear-gradient(135deg,#22D3EE,#06B6D4); display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(34,211,238,0.4); flex-shrink:0; transition:box-shadow 0.3s; }
        .pt-logo:hover .pt-logo-icon { box-shadow:0 0 24px rgba(34,211,238,0.65); }
        .pt-logo-text { font-family:'EB Garamond',serif; font-size:20px; font-weight:600; color:#E5E9F7; letter-spacing:-0.2px; }
        .pt-logo-accent { background:linear-gradient(90deg,#22D3EE,#5E77C0,#06B6D4,#22D3EE); background-size:300% 100%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:logoShimmer 6s linear infinite; }
        @keyframes logoShimmer { 0%{background-position:0%} 100%{background-position:300%} }
        .pt-nav-links { display:flex; align-items:center; gap:2px; }
        .nav-item { display:flex; align-items:center; gap:6px; padding:7px 12px; border-radius:999px; font-size:12.5px; font-weight:500; color:#8FA0D7; text-decoration:none; transition:all 0.2s ease; border:1px solid transparent; font-family:'Montserrat',sans-serif; white-space:nowrap; }
        .nav-item:hover { color:#E5E9F7; background:rgba(255,255,255,0.04); }
        .nav-item-active { color:#22D3EE!important; background:rgba(34,211,238,0.08)!important; border-color:rgba(34,211,238,0.2)!important; text-shadow:0 0 10px rgba(34,211,238,0.25); }
        .nav-item-active svg { filter:drop-shadow(0 0 4px rgba(34,211,238,0.5)); }
        .pt-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .pt-divider { width:1px; height:18px; background:rgba(143,160,215,0.2); }
        .pt-user-greeting { font-size:12.5px; color:#8FA0D7; font-family:'Montserrat',sans-serif; }
        .btn-logout { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:999px; font-size:12.5px; font-weight:500; color:#8FA0D7; background:transparent; border:1px solid rgba(143,160,215,0.15); cursor:pointer; transition:all 0.2s ease; font-family:'Montserrat',sans-serif; }
        .btn-logout:hover { color:#ef4444; border-color:rgba(239,68,68,0.35); background:rgba(239,68,68,0.06); }
        .btn-menu { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:999px; background:rgba(143,160,215,0.06); border:1px solid rgba(143,160,215,0.15); color:#8FA0D7; cursor:pointer; transition:all 0.2s ease; }
        .btn-menu:hover { color:#22D3EE; border-color:rgba(34,211,238,0.3); background:rgba(34,211,238,0.05); }
        .pt-sheet-inner { background:#02050E; height:100%; display:flex; flex-direction:column; font-family:'Montserrat',sans-serif; }
        .pt-sheet-logo { display:flex; align-items:center; gap:12px; padding:20px 20px 18px; border-bottom:1px solid rgba(143,160,215,0.1); }
        .pt-sheet-nav { flex:1; display:flex; flex-direction:column; gap:4px; padding:16px 12px; overflow-y:auto; }
        .pt-sheet-nav .nav-item { border-radius:12px; padding:10px 14px; font-size:14px; }
        .pt-sheet-footer { padding:16px 12px 24px; border-top:1px solid rgba(143,160,215,0.1); }
        .pt-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#1E2F66,#22D3EE); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#E5E9F7; flex-shrink:0; box-shadow:0 0 12px rgba(34,211,238,0.2); overflow:hidden; }
        .pt-avatar img { width:100%; height:100%; object-fit:cover; }
        .btn-logout-full { display:flex; align-items:center; gap:8px; width:100%; padding:10px 14px; border-radius:12px; font-size:14px; font-weight:500; color:#8FA0D7; background:rgba(239,68,68,0.04); border:1px solid rgba(239,68,68,0.12); cursor:pointer; transition:all 0.2s ease; font-family:'Montserrat',sans-serif; }
        .btn-logout-full:hover { color:#ef4444; background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.35); }
        @media(max-width:900px){ .pt-nav-links,.pt-right{ display:none!important; } .pt-mobile-menu{ display:flex!important; } }
        @media(min-width:901px){ .pt-mobile-menu{ display:none!important; } }
      `}</style>

      <nav className={`pt-navbar${scrolled?" scrolled":""}`}>
        <NavLink to="/dashboard" className="pt-logo">
          <div className="pt-logo-icon"><BriefcaseBusiness size={17} color="#02050E"/></div>
          <span className="pt-logo-text">Place<span className="pt-logo-accent">Tracker</span></span>
        </NavLink>

        <div className="pt-nav-links"><NavItems/></div>

        <div className="pt-right">
          <ReminderBell userEmail={user?.email}/>
          {user?.name && (
            <>
              <div className="pt-divider"/>
              <span className="pt-user-greeting">Hi, <strong style={{color:"#E5E9F7"}}>{user.name.split(" ")[0]}</strong></span>
            </>
          )}
          <div className="pt-divider"/>
          <button className="btn-logout" onClick={handleLogout}><LogOut size={14}/> Logout</button>
        </div>

        <div className="pt-mobile-menu">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="btn-menu"><Menu size={20}/></button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-0 w-72" style={{ background:"transparent" }}>
              <div className="pt-sheet-inner">
                <div className="pt-sheet-logo">
                  <div className="pt-logo-icon" style={{ width:38, height:38, borderRadius:11 }}>
                    <BriefcaseBusiness size={19} color="#02050E"/>
                  </div>
                  <span className="pt-logo-text" style={{ fontSize:22 }}>Place<span className="pt-logo-accent">Tracker</span></span>
                </div>
                <div className="pt-sheet-nav"><NavItems onClose={()=>setOpen(false)}/></div>
                <div className="pt-sheet-footer">
                  {user?.name && (
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px 14px" }}>
                      <div className="pt-avatar">
                        {user.imageUrl
                          ? <img src={user.imageUrl} alt={user.name}/>
                          : user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)
                        }
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:"#E5E9F7" }}>{user.name}</div>
                        <div style={{ fontSize:12, color:"#8FA0D7" }}>{user.email}</div>
                      </div>
                      <div style={{ marginLeft:"auto" }}>
                        <ReminderBell userEmail={user?.email}/>
                      </div>
                    </div>
                  )}
                  <button className="btn-logout-full" onClick={handleLogout}><LogOut size={15}/> Sign Out</button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}