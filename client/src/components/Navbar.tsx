import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { soundEffects } from "../utils/audio";
import { MOCK_DEMO_USERS } from "../services/mockData";
import { Film, Volume2, VolumeX, Shield, LogOut, Ticket, KeyRound, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

function navClass({ isActive }: { isActive: boolean }) {
  return `px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
    isActive
      ? "bg-primary/20 text-white border border-primary/50 shadow-[0_0_15px_rgba(233,69,96,0.3)]"
      : "text-gray-300 hover:text-white hover:bg-white/5"
  }`;
}

export default function Navbar() {
  const { user, login, logout, isAdmin } = useAuth();
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const navigate = useNavigate();

  const handleToggleSound = () => {
    const newState = soundEffects.toggleSound();
    setIsSoundOn(newState);
    if (newState) soundEffects.playHover();
    toast.success(newState ? "Spatial Audio FX Enabled" : "Audio FX Muted", {
      icon: newState ? "🔊" : "🔇",
      duration: 1800,
    });
  };

  const handleQuickLogin = (type: "user" | "admin") => {
    soundEffects.playSuccess();
    const demo = MOCK_DEMO_USERS[type];
    login(demo.token, demo.user);
    setShowDemoMenu(false);
    toast.success(`Logged in as ${type === "admin" ? "Admin" : "VIP Guest"}!`);
    if (type === "admin") navigate("/admin");
  };

  return (
    <header className="sticky top-0 z-50 px-4 py-3">
      <nav className="max-w-7xl mx-auto h-16 rounded-2xl glass-panel-glow px-4 sm:px-6 flex items-center justify-between transition-all">
        {/* Brand Logo with 3D Effect */}
        <Link
          to="/"
          onClick={() => soundEffects.playHover()}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-neon-cyan flex items-center justify-center text-white shadow-[0_0_20px_rgba(233,69,96,0.6)] group-hover:rotate-12 transition-transform duration-300">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
              Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-neon-cyan">3D</span>
            </span>
            <span className="text-[9px] font-black tracking-widest uppercase text-neon-cyan block -mt-1">
              IMAX & ATMOS
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={navClass} onClick={() => soundEffects.playHover()}>
            3D Movies
          </NavLink>

          {user && (
            <NavLink to="/my-bookings" className={navClass} onClick={() => soundEffects.playHover()}>
              My 3D Passes
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={navClass} onClick={() => soundEffects.playHover()}>
              Admin Control
            </NavLink>
          )}
        </div>

        {/* Right Actions & Demo Auth Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 text-sm">
          {/* Audio FX Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95"
            title={isSoundOn ? "Mute Cinema Sound FX" : "Unmute Cinema Sound FX"}
            aria-label="Toggle Sound Effects"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-neon-cyan" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* 1-Click Demo Accounts Quick-Switch */}
          <div className="relative">
            <button
              onClick={() => {
                soundEffects.playHover();
                setShowDemoMenu(!showDemoMenu);
              }}
              className="flex items-center gap-1.5 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,242,254,0.15)]"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">1-Click Demo</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-white/20 rounded-2xl p-2 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 animate-in fade-in zoom-in duration-200">
                <p className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1.5 border-b border-white/10">
                  Instant Test Login
                </p>
                <button
                  onClick={() => handleQuickLogin("user")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-gray-200 hover:bg-primary/20 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Ticket className="w-4 h-4 text-primary" />
                  <span>VIP Guest User</span>
                </button>
                <button
                  onClick={() => handleQuickLogin("admin")}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-gray-200 hover:bg-neon-cyan/20 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Shield className="w-4 h-4 text-neon-cyan" />
                  <span>Cinema Administrator</span>
                </button>
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/profile"
                onClick={() => soundEffects.playHover()}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-neon-cyan flex items-center justify-center text-[10px] font-black">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playHover();
                  logout();
                  toast.success("Logged out successfully");
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                onClick={() => soundEffects.playHover()}
                className="text-xs font-bold text-gray-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => soundEffects.playHover()}
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(233,69,96,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
