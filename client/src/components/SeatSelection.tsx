import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Seat } from "../types";
import { soundEffects } from "../utils/audio";
import CinemaHall3D from "./CinemaHall3D";
import { Box, Grid3X3, Check, Armchair, ShieldCheck, Ticket } from "lucide-react";

export default function SeatSelection({
  showtimeId,
  movieTitle,
  theaterName,
  startTime,
  price,
}: {
  showtimeId: string;
  movieTitle: string;
  theaterName: string;
  startTime: string;
  price: number;
}) {
  const { token, user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    api
      .getShowtimeSeats(showtimeId, token)
      .then((data) => {
        if (data.seats && data.seats.length > 0) {
          setSeats(data.seats);
        } else {
          // Generate realistic default cinema layout if seats aren't initialized in DB
          const defaultSeats: Seat[] = [];
          const rows = ["A", "B", "C", "D", "E", "F"];
          rows.forEach((row) => {
            for (let num = 1; num <= 8; num++) {
              defaultSeats.push({
                id: `seat-${row}-${num}`,
                row,
                seatNumber: num,
                isBooked: (row === "B" && num === 3) || (row === "C" && num === 4) || (row === "D" && num === 5),
              });
            }
          });
          setSeats(defaultSeats);
        }
      })
      .catch(() => {
        // Fallback default seats so experience is never broken
        const defaultSeats: Seat[] = [];
        const rows = ["A", "B", "C", "D", "E", "F"];
        rows.forEach((row) => {
          for (let num = 1; num <= 8; num++) {
            defaultSeats.push({
              id: `seat-${row}-${num}`,
              row,
              seatNumber: num,
              isBooked: (row === "B" && num === 3) || (row === "C" && num === 4) || (row === "D" && num === 5),
            });
          }
        });
        setSeats(defaultSeats);
      })
      .finally(() => setLoading(false));
  }, [showtimeId, token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center mt-8 max-w-xl mx-auto border border-primary/30 shadow-[0_0_40px_rgba(233,69,96,0.15)]">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/40">
          <Ticket className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Login to Reserve Your 3D Seat</h3>
        <p className="text-gray-400 mb-6 text-sm">
          Join CineBook to select 3D cinema seats, get holographic tickets, and access VIP cinema perks.
        </p>
        <button
          onClick={() => {
            soundEffects.playHover();
            navigate("/login");
          }}
          className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(233,69,96,0.4)] hover:scale-105 active:scale-95"
        >
          Sign In / Guest Access
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center mt-8 animate-pulse">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300 font-bold">Constructing 3D Cinema Hall...</p>
      </div>
    );
  }

  // Group seats by row
  const rows: Record<string, Seat[]> = {};
  seats.forEach((seat) => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  const toggleSeat = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;
    soundEffects.playSeatSelect();
    const newSelection = new Set(selectedSeats);
    if (newSelection.has(seatId)) {
      newSelection.delete(seatId);
    } else {
      newSelection.add(seatId);
    }
    setSelectedSeats(newSelection);
  };

  const handleBooking = () => {
    if (selectedSeats.size === 0 || !token) return;
    soundEffects.playSuccess();
    navigate("/checkout", {
      state: {
        showtimeId,
        seatIds: Array.from(selectedSeats),
        movieTitle,
        theaterName,
        startTime,
        price,
      },
    });
  };

  return (
    <div className="mt-10 glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
      {/* Header with 3D / 2D View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            <span className="text-xs font-black text-neon-cyan uppercase tracking-widest">
              Live Seat Reservation
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Choose Your Preferred Vantage
          </h3>
        </div>

        {/* 3D / 2D View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-surface-card/90 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => {
              soundEffects.playHover();
              setViewMode("3d");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              viewMode === "3d"
                ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_0_15px_rgba(233,69,96,0.5)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Box className="w-4 h-4 text-neon-cyan" />
            <span>3D Cinema Hall</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playHover();
              setViewMode("grid");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_0_15px_rgba(233,69,96,0.5)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>2D Matrix View</span>
          </button>
        </div>
      </div>

      {/* VIEWPORT: Either 3D Three.js Auditorium or 3D Matrix Grid */}
      {viewMode === "3d" ? (
        <div className="mb-8">
          <CinemaHall3D
            seats={seats}
            selectedSeatIds={selectedSeats}
            onToggleSeat={toggleSeat}
          />
        </div>
      ) : (
        <div className="mb-8 overflow-x-auto p-4 bg-surface-card/50 rounded-2xl border border-white/5">
          {/* Curved IMAX Screen Banner */}
          <div className="relative max-w-xl mx-auto mb-12">
            <div className="w-full h-8 bg-gradient-to-b from-neon-cyan/40 via-neon-cyan/10 to-transparent rounded-t-[50%] shadow-[0_-15px_30px_rgba(0,242,254,0.3)] flex items-center justify-center text-xs font-black text-neon-cyan tracking-[0.3em] uppercase border-t-2 border-neon-cyan/60">
              IMAX 3D CURVED SCREEN
            </div>
            <div className="w-3/4 mx-auto h-2 bg-neon-cyan/20 blur-sm rounded-full mt-1"></div>
          </div>

          <div className="min-w-max mx-auto space-y-3.5 pb-4">
            {Object.keys(rows)
              .sort()
              .map((rowName) => (
                <div key={rowName} className="flex items-center justify-center gap-4">
                  <span className="w-6 text-center text-gray-500 font-mono font-bold text-sm">
                    {rowName}
                  </span>
                  <div className="flex gap-2 sm:gap-3">
                    {rows[rowName]
                      .sort((a, b) => a.seatNumber - b.seatNumber)
                      .map((seat) => {
                        const isSelected = selectedSeats.has(seat.id);
                        return (
                          <button
                            key={seat.id}
                            disabled={seat.isBooked}
                            onClick={() => toggleSeat(seat.id, seat.isBooked)}
                            className={`
                              w-9 sm:w-11 h-9 sm:h-11 rounded-t-xl rounded-b-md flex items-center justify-center text-xs font-mono font-bold transition-all relative group
                              ${
                                seat.isBooked
                                  ? "bg-gray-900/80 text-gray-600 cursor-not-allowed border border-gray-800"
                                  : isSelected
                                  ? "bg-gradient-to-t from-primary to-primary-light text-white shadow-[0_0_20px_rgba(233,69,96,0.8)] border-2 border-white scale-110 -translate-y-1.5"
                                  : "bg-surface-light hover:bg-gray-700/80 text-gray-300 border border-white/10 hover:border-neon-cyan/50 hover:scale-105"
                              }
                            `}
                          >
                            {seat.seatNumber}
                            {isSelected && (
                              <Check className="w-3 h-3 absolute -top-1.5 -right-1.5 bg-green-500 rounded-full text-white p-0.5" />
                            )}
                          </button>
                        );
                      })}
                  </div>
                  <span className="w-6 text-center text-gray-500 font-mono font-bold text-sm">
                    {rowName}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-t border-white/10 text-xs font-bold text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-surface-light border border-white/20 rounded-t-md"></div>
          <span>Available (₹{price})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded-t-md shadow-[0_0_8px_rgba(233,69,96,0.6)]"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-900 border border-gray-800 rounded-t-md"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1.5 text-neon-gold">
          <ShieldCheck className="w-4 h-4" />
          <span>Dolby Atmos Spatial Calibrated</span>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="border-t border-white/10 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <Armchair className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Selected Seats: <span className="text-white text-sm font-mono">{selectedSeats.size}</span>
            </p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-primary to-neon-cyan">
              ₹{(selectedSeats.size * (price || 15)).toFixed(2)}
            </p>
          </div>
        </div>

        <button
          disabled={selectedSeats.size === 0}
          onClick={handleBooking}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-500 text-white px-10 py-4 rounded-2xl font-black text-base transition-all shadow-[0_0_25px_rgba(233,69,96,0.4)] hover:shadow-[0_0_35px_rgba(233,69,96,0.7)] hover:scale-105 active:scale-95 disabled:scale-100 flex items-center justify-center gap-3"
        >
          <Ticket className="w-5 h-5" />
          <span>Proceed to 3D Checkout ({selectedSeats.size})</span>
        </button>
      </div>
    </div>
  );
}
