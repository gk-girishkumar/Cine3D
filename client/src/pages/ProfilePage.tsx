import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api, ApiError } from "../services/api";
import type { Booking } from "../types";
import {
  Ticket,
  Sparkles,
  Award,
  Zap,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .getMyBookings(token)
      .then((data) => setBookings(data.bookings))
      .catch((err) =>
        toast.error(err instanceof ApiError ? err.message : "Failed to load profile stats")
      )
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) return null;

  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const loyaltyPoints = confirmedCount * 250 + 750;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-black uppercase tracking-widest text-neon-cyan">
            VIP Membership Center
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Cinephile 3D Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: 3D Holographic Profile Badge */}
        <div className="md:col-span-1 glass-panel rounded-3xl p-6 border border-white/15 shadow-2xl space-y-6 text-center">
          <div className="relative inline-block mx-auto">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-primary via-neon-purple to-neon-cyan p-1 shadow-[0_0_35px_rgba(233,69,96,0.5)]">
              <div className="w-full h-full rounded-[22px] bg-surface-card flex items-center justify-center text-4xl font-black text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-neon-gold text-gray-950 p-1.5 rounded-xl shadow-lg border border-white">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white">{user.name}</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{user.email}</p>
            <div className="mt-2.5 inline-block px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full text-[10px] font-black uppercase tracking-widest text-neon-cyan">
              {user.role === "ADMIN" ? "Cinema Administrator" : "Diamond 3D VIP"}
            </div>
          </div>

          {/* Tier Progress */}
          <div className="pt-4 border-t border-white/10 text-left space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400">VIP Tier Progress</span>
              <span className="text-neon-gold">{loyaltyPoints} / 3000 Pts</span>
            </div>
            <div className="w-full h-2.5 bg-surface-card rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-primary to-neon-cyan rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,242,254,0.5)]"
                style={{ width: `${Math.min(100, (loyaltyPoints / 3000) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Unlock free popcorn refill & priority 3D recliner booking at 3,000 pts.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Stats & Recent 3D Screenings */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-primary/20 text-primary rounded-xl">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Total 3D Passes</p>
                <p className="text-2xl font-black text-white font-mono">
                  {loading ? "-" : bookings.length}
                </p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-neon-cyan/20 text-neon-cyan rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Loyalty Rewards</p>
                <p className="text-2xl font-black text-neon-gold font-mono">
                  {loyaltyPoints} XP
                </p>
              </div>
            </div>
          </div>

          {/* Screening Activity */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" /> Recent 3D Screenings
            </h3>

            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-12 bg-white/5 rounded-xl"></div>
                <div className="h-12 bg-white/5 rounded-xl"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3.5 bg-surface-card/60 hover:bg-surface-card rounded-2xl border border-white/5 transition-all text-xs"
                  >
                    <div>
                      <p className="font-black text-white text-sm">{b.showtime.movie.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(b.showtime.startTime).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {b.showtime.theater.name}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-green-500/20 text-green-400 border border-green-500/30">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xs italic py-4">No recent screening activity recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
