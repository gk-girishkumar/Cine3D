import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import type { Movie, Showtime } from "../types";
import SeatSelection from "../components/SeatSelection";
import Card3DTilt from "../components/Card3DTilt";
import { soundEffects } from "../utils/audio";
import {
  Sparkles,
  Star,
  Clock,
  Calendar,
  Play,
  ArrowLeft,
  Volume2,
  Tv,
  MapPin,
  Flame,
  X,
  VolumeX,
} from "lucide-react";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<(Movie & { showtimes: Showtime[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .getMovie(id)
      .then((data) => {
        const m = data.movie as Movie & { showtimes: Showtime[] };
        setMovie(m);
        if (m.showtimes && m.showtimes.length > 0) {
          setSelectedShowtimeId(m.showtimes[0].id);
        }
      })
      .catch(() => setError("Failed to load movie"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold">Summoning 3D Cinema Experience...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center max-w-md mx-auto my-12 border border-red-500/30">
        <p className="text-red-400 font-bold mb-4">{error || "Movie not found"}</p>
        <Link
          to="/"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm"
        >
          Return to Movies
        </Link>
      </div>
    );
  }

  const selectedShowtime = movie.showtimes?.find((s) => s.id === selectedShowtimeId) || movie.showtimes?.[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Back Button */}
      <Link
        to="/"
        onClick={() => soundEffects.playHover()}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to 3D Showcase
      </Link>

      {/* Hero Movie Presentation in 3D */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-white/15 overflow-hidden shadow-2xl">
        {/* Ambient Projector Aura */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Tilt Poster */}
          <div className="lg:col-span-4 flex justify-center">
            <Card3DTilt
              maxTilt={16}
              scale={1.05}
              className="w-full max-w-sm aspect-[2/3] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(233,69,96,0.3)] border-2 border-white/20"
            >
              <img
                src={
                  movie.posterUrl ||
                  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80"
                }
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-neon-cyan flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" /> IMAX 3D
              </div>
            </Card3DTilt>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 bg-primary/20 text-primary border border-primary/40 rounded-full text-xs font-black uppercase tracking-widest">
                Now Showing in 3D
              </span>
              <span className="px-3 py-1 bg-white/10 text-gray-200 border border-white/10 rounded-full text-xs font-bold">
                {movie.genre}
              </span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> 4.9 Critic Score
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-bold text-gray-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neon-cyan" /> {movie.durationMinutes} Minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neon-gold" /> Released {new Date(movie.releaseDate).getFullYear()}
              </span>
              <span className="flex items-center gap-1.5 text-green-400">
                <Volume2 className="w-4 h-4" /> Dolby Atmos 128-Ch
              </span>
            </div>

            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
              {movie.description}
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundEffects.playHover();
                  setIsTrailerOpen(true);
                }}
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current text-neon-cyan" />
                <span>Watch 3D Trailer</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <Flame className="w-4 h-4 text-primary" />
                <span>High demand: 92% of seats filling up fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Theater Selection */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-2xl font-black text-white">Select Showtime & Theater</h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Choose your auditorium technology to unlock seat selection
            </p>
          </div>
        </div>

        {movie.showtimes?.length === 0 ? (
          <p className="text-gray-400 p-6 bg-white/5 rounded-2xl border border-white/10">
            No showtimes scheduled today.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {movie.showtimes?.map((showtime) => {
              const date = new Date(showtime.startTime);
              const isSelected = selectedShowtimeId === showtime.id;

              return (
                <button
                  key={showtime.id}
                  onClick={() => {
                    soundEffects.playHover();
                    setSelectedShowtimeId(showtime.id);
                  }}
                  className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between group relative overflow-hidden ${
                    isSelected
                      ? "glass-panel-glow border-primary shadow-[0_0_25px_rgba(233,69,96,0.3)] scale-[1.02]"
                      : "bg-surface-card/70 border-white/10 hover:border-white/30 hover:bg-surface-card"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-black text-white font-mono">
                        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-xs font-black text-neon-cyan uppercase tracking-wider bg-neon-cyan/10 border border-neon-cyan/30 px-2.5 py-0.5 rounded-full">
                        ₹{showtime.price}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 font-medium mb-3">
                      {date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-200 font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {showtime.theater?.name || "IMAX Laser 3D Dome"}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? "text-primary" : "text-gray-400"}`}>
                      {isSelected ? "Active Vantage" : "Select"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D Seat Selection Experience */}
      {selectedShowtime && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <SeatSelection
            showtimeId={selectedShowtime.id}
            movieTitle={movie.title}
            theaterName={selectedShowtime.theater?.name || "IMAX Laser 3D Dome"}
            startTime={selectedShowtime.startTime}
            price={selectedShowtime.price}
          />
        </div>
      )}

      {/* Trailer Modal */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="relative w-full max-w-4xl bg-surface-card border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(233,69,96,0.4)]">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-surface-light">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  {movie.title} <span className="text-xs text-neon-cyan font-semibold border border-neon-cyan/30 px-2 py-0.5 rounded-full">Official 3D Trailer</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Toggle Mute"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsTrailerOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
              <img
                src={movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80"}
                alt="Trailer Background"
                className="w-full h-full object-cover opacity-30 filter blur-sm scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

              <div className="relative z-10 text-center p-8 space-y-4 max-w-lg">
                <div className="w-20 h-20 bg-primary/20 text-primary border border-primary/50 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(233,69,96,0.6)] animate-pulse">
                  <Play className="w-10 h-10 fill-current translate-x-1" />
                </div>
                <h4 className="text-2xl font-black text-white drop-shadow-md">
                  Experience {movie.title} in IMAX 3D
                </h4>
                <p className="text-gray-300 text-sm">
                  Ultra-high framerate 4K projection with spatial acoustics calibrated for premium auditorium clarity.
                </p>
                <button
                  onClick={() => setIsTrailerOpen(false)}
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg transition-transform hover:scale-105"
                >
                  Continue Seat Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
