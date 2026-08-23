import { useEffect, useState } from "react";
import { api, ApiError } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import type { Booking, Movie } from "../types";
import { soundEffects } from "../utils/audio";
import {
  ShieldCheck,
  Film,
  Ticket,
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  Trash2,
  Sparkles,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"analytics" | "movies" | "bookings">("analytics");

  const [movies, setMovies] = useState<Movie[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalBookings: 0, topMovie: "" });
  const [loading, setLoading] = useState(true);

  // New Movie Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newGenre, setNewGenre] = useState("Sci-Fi / Adventure");
  const [newDuration, setNewDuration] = useState(150);
  const [newPosterUrl, setNewPosterUrl] = useState("");

  useEffect(() => {
    if (!token) return;

    Promise.all([
      api.getMovies().then((d) => setMovies(d.movies)),
      api.getAllBookings(token).then((d) => setBookings(d.bookings)),
      api.getAnalytics(token).then((d) => setAnalytics(d.analytics)),
    ])
      .catch((err) =>
        toast.error(err instanceof ApiError ? err.message : "Failed to load admin data")
      )
      .finally(() => setLoading(false));
  }, [token]);

  const handleDeleteMovie = async (id: string) => {
    if (!token || !confirm("Are you sure you want to remove this 3D title?")) return;
    soundEffects.playHover();
    try {
      await api.deleteMovie(id, token);
      setMovies(movies.filter((m) => m.id !== id));
      toast.success("Movie removed from 3D catalog");
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newTitle) return;

    soundEffects.playSuccess();
    try {
      const res = await api.createMovie(
        {
          title: newTitle,
          description: newDescription,
          genre: newGenre,
          durationMinutes: Number(newDuration),
          posterUrl: newPosterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
          releaseDate: new Date().toISOString(),
        },
        token
      );

      setMovies([res.movie, ...movies]);
      setIsAddModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewPosterUrl("");
      toast.success("3D Movie added to catalog!", { icon: "🎬" });
    } catch {
      toast.error("Failed to add movie");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-neon-cyan to-blue-600 text-gray-950 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(0,242,254,0.4)]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping"></span>
              <span className="text-xs font-black text-neon-cyan uppercase tracking-widest">
                Cinema Management Suite
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">Admin Operations Console</h1>
          </div>
        </div>

        {activeTab === "movies" && (
          <button
            onClick={() => {
              soundEffects.playHover();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(233,69,96,0.4)] transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add 3D Movie</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        {[
          { id: "analytics", label: "3D Analytics", icon: Activity },
          { id: "movies", label: "Catalog Management", icon: Film },
          { id: "bookings", label: "Live Pass Stream", icon: Ticket },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundEffects.playHover();
              setActiveTab(tab.id as any);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shrink-0 ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-[0_0_20px_rgba(233,69,96,0.4)]"
                : "glass-panel text-gray-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-panel p-16 rounded-3xl text-center animate-pulse">
          <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold">Synchronizing Cinema Telemetry...</p>
        </div>
      ) : (
        <>
          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-28 h-28 bg-green-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Total 3D Box Office Revenue
                    </span>
                    <div className="p-2.5 bg-green-500/20 text-green-400 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-4xl font-black text-white font-mono">
                    ₹{analytics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-400 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +24.8% from last cycle
                  </p>
                </div>

                <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-28 h-28 bg-neon-cyan/15 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Verified 3D Hologram Passes
                    </span>
                    <div className="p-2.5 bg-neon-cyan/20 text-neon-cyan rounded-xl">
                      <Ticket className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-4xl font-black text-white font-mono">
                    {analytics.totalBookings}
                  </p>
                  <p className="text-xs text-neon-cyan font-bold mt-2">
                    Active reservations locked
                  </p>
                </div>

                <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-28 h-28 bg-neon-gold/15 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Top Box Office Title
                    </span>
                    <div className="p-2.5 bg-neon-gold/20 text-neon-gold rounded-xl">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xl font-black text-white line-clamp-1">
                    {analytics.topMovie || "Dune: Part Two (IMAX 3D)"}
                  </p>
                  <p className="text-xs text-neon-gold font-bold mt-2">
                    98.4% Seat Fill Factor
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Movies Management Tab */}
          {activeTab === "movies" && (
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-card text-gray-400 text-xs font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-5">3D Title</th>
                      <th className="p-5">Genre</th>
                      <th className="p-5">Runtime</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movies.map((m) => (
                      <tr key={m.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-5 font-bold text-white flex items-center gap-3">
                          <div className="w-12 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                            <img
                              src={m.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200"}
                              alt={m.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-base font-black text-white line-clamp-1">{m.title}</p>
                            <span className="text-[10px] font-black uppercase text-neon-cyan">IMAX 3D</span>
                          </div>
                        </td>
                        <td className="p-5 text-xs text-gray-300 font-semibold">{m.genre}</td>
                        <td className="p-5 text-xs text-gray-300 font-mono">{m.durationMinutes} mins</td>
                        <td className="p-5 text-right">
                          <button
                            onClick={() => handleDeleteMovie(m.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all"
                            title="Delete Movie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-card text-gray-400 text-xs font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-5">Pass ID</th>
                      <th className="p-5">3D Title</th>
                      <th className="p-5">Seats</th>
                      <th className="p-5">Revenue</th>
                      <th className="p-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors text-xs">
                        <td className="p-5 font-mono text-neon-cyan font-bold">{b.id.slice(0, 12)}</td>
                        <td className="p-5 font-bold text-white">{b.showtime.movie.title}</td>
                        <td className="p-5 font-mono text-gray-300">
                          {b.seats.map((s) => `${s.row}${s.seatNumber}`).join(", ")}
                        </td>
                        <td className="p-5 font-mono font-bold text-neon-gold">₹{b.totalAmount}</td>
                        <td className="p-5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-green-500/20 text-green-400 border border-green-500/30">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Movie Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in zoom-in duration-300">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Add New 3D Blockbuster</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMovie} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Matrix Resurrections (3D IMAX)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Genre</label>
                <input
                  type="text"
                  required
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Poster Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newPosterUrl}
                  onChange={(e) => setNewPosterUrl(e.target.value)}
                  className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Synopsis / 3D Highlights</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-black uppercase tracking-wider shadow-lg"
                >
                  Add to 3D Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
