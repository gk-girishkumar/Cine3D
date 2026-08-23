import { useEffect, useState } from "react";
import { api, ApiError } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import type { Booking } from "../types";
import { Link } from "react-router-dom";
import { soundEffects } from "../utils/audio";
import Card3DTilt from "../components/Card3DTilt";
import {
  Ticket,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchBookings();
  }, [token]);

  const fetchBookings = () => {
    setLoading(true);
    api
      .getMyBookings(token!)
      .then((data) => setBookings(data.bookings))
      .catch((err) =>
        toast.error(err instanceof ApiError ? err.message : "Failed to load bookings")
      )
      .finally(() => setLoading(false));
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this 3D reservation?")) return;

    soundEffects.playHover();
    setCancellingId(bookingId);
    try {
      await api.cancelBooking(bookingId, token!);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold">Retrieving 3D Digital Passes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-black uppercase tracking-widest text-neon-cyan">
            Wallet & Passes
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          My 3D Cinema Passes
        </h1>
        <p className="text-gray-400 text-sm">
          Access your digital holographic tickets, auditorium entry barcodes, and booking history.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center border border-white/10 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto border border-primary/40">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">No 3D Passes Found</h3>
          <p className="text-gray-400 text-xs">
            You haven't booked any 3D movies yet. Browse what's showing now!
          </p>
          <Link
            to="/"
            onClick={() => soundEffects.playHover()}
            className="inline-block bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            Explore 3D Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const date = new Date(booking.showtime.startTime);
            const isPast = date < new Date();
            const canCancel = !isPast && booking.status !== "CANCELLED";

            return (
              <Card3DTilt
                key={booking.id}
                maxTilt={8}
                scale={1.01}
                className="glass-panel rounded-3xl border border-white/10 hover:border-primary/40 transition-all p-6 sm:p-8 flex flex-col md:flex-row gap-6 shadow-2xl relative overflow-hidden"
              >
                {/* Poster Side */}
                <div className="w-full md:w-48 aspect-[16/10] md:aspect-[2/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0 relative">
                  <img
                    src={
                      booking.showtime.movie.posterUrl ||
                      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400"
                    }
                    alt={booking.showtime.movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-neon-cyan">
                    IMAX 3D
                  </div>
                </div>

                {/* Info Side */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h2 className="text-2xl font-black text-white leading-tight">
                        {booking.showtime.movie.title}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : booking.status === "CANCELLED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3 border-t border-white/10">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                          Date & Time
                        </p>
                        <p className="font-bold text-white">
                          {date.toLocaleDateString([], { month: "short", day: "numeric" })}
                        </p>
                        <p className="font-bold text-neon-cyan">
                          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                          Auditorium
                        </p>
                        <p className="font-bold text-gray-200">
                          {booking.showtime.theater.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                          Seats ({booking.seats.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {booking.seats.map((s, i) => (
                            <span
                              key={i}
                              className="bg-primary/20 text-white font-mono font-bold px-2 py-0.5 rounded border border-primary/40 text-[11px]"
                            >
                              {s.row}{s.seatNumber}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                          Pass Amount
                        </p>
                        <p className="font-black text-neon-gold font-mono text-base">
                          ₹{booking.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-[10px] font-mono text-gray-500">
                          ID: {booking.id.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to={`/ticket/${booking.id}`}
                      onClick={() => soundEffects.playHover()}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-blue-600 hover:from-neon-cyan hover:to-blue-500 text-gray-950 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all hover:scale-105"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>View 3D Holographic Pass</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? "Cancelling..." : "Cancel Reservation"}
                      </button>
                    )}
                  </div>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      )}
    </div>
  );
}
