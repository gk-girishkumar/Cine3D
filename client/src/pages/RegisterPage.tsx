import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api, ApiError } from "../services/api";
import { soundEffects } from "../utils/audio";
import { Film, User, Lock, Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
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
      const data = await api.register({ name, email, password });
      soundEffects.playSuccess();
      login(data.token, data.user);
      toast.success("Welcome to Cine3D! Account created.");
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/15 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-neon-cyan flex items-center justify-center text-white mx-auto mb-3 shadow-[0_0_25px_rgba(233,69,96,0.5)]">
            <Film className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Create Cine3D Pass</h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign up for 3D seat reservation, loyalty XP & holographic passes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-400 font-bold uppercase mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full bg-surface-card border border-white/10 focus:border-primary pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-bold uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@cinema3d.io"
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
                minLength={6}
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
            {loading ? "Creating 3D Account..." : "Register & Get VIP Pass"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Already a member?{" "}
          <Link to="/login" className="text-neon-cyan font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
