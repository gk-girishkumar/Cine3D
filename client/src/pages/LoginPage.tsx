import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api, ApiError } from "../services/api";
import { soundEffects } from "../utils/audio";
import { MOCK_DEMO_USERS } from "../services/mockData";
import { Film, Lock, Mail, Sparkles, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    soundEffects.playHover();

    try {
      const data = await api.login({ email, password });
      soundEffects.playSuccess();
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const handleDemoLogin = (type: "user" | "admin") => {
    soundEffects.playSuccess();
    const demo = MOCK_DEMO_USERS[type];
    login(demo.token, demo.user);
    toast.success(`Signed in with 1-Click as ${type === "admin" ? "Admin" : "VIP Guest"}!`);
    navigate(type === "admin" ? "/admin" : "/");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/15 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-neon-cyan flex items-center justify-center text-white mx-auto mb-3 shadow-[0_0_25px_rgba(233,69,96,0.5)]">
            <Film className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Sign In to Cine3D</h1>
          <p className="text-xs text-gray-400 mt-1">Unlock 3D seat picker & holographic passes</p>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="mb-6 p-3 bg-surface-card rounded-2xl border border-white/10 space-y-2">
          <p className="text-[10px] uppercase font-black text-neon-cyan tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Demo 1-Click Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("user")}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Ticket className="w-3.5 h-3.5 text-primary" />
              <span>VIP Guest</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-neon-cyan/20 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Admin Mode</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-400 font-bold uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@cinema3d.io"
                className="w-full bg-surface-card border border-white/10 focus:border-primary pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-bold uppercase mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-card border border-white/10 focus:border-primary pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(233,69,96,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In & Enter 3D Cinema"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-neon-cyan font-bold hover:underline">
            Register for 3D Access
          </Link>
        </p>
      </div>
    </div>
  );
}
