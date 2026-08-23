import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, ChevronLeft, ChevronRight, Star, Sparkles, Volume2, VolumeX, X, Ticket } from "lucide-react";
import type { Movie } from "../types";
import { soundEffects } from "../utils/audio";

interface Hero3DCarouselProps {
  movies: Movie[];
}

export default function Hero3DCarousel({ movies }: Hero3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const displayMovies = movies.slice(0, 5);

  useEffect(() => {
    if (displayMovies.length <= 1 || isTrailerOpen) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayMovies.length, isTrailerOpen]);

  if (displayMovies.length === 0) return null;

  const currentMovie = displayMovies[activeIndex];

  const handlePrev = () => {
    soundEffects.playHover();
    setActiveIndex((prev) => (prev - 1 + displayMovies.length) % displayMovies.length);
  };

  const handleNext = () => {
    soundEffects.playHover();
    setActiveIndex((prev) => (prev + 1) % displayMovies.length);
  };

  const handleSelectCard = (index: number) => {
    soundEffects.playHover();
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden py-12 md:py-16">
      {/* Dynamic 3D Ambient Neon Glow & Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-primary/30 via-neon-cyan/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-xs font-black tracking-widest uppercase text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,242,254,0.2)]">
              <Sparkles className="w-3.5 h-3.5" /> 3D Cinematic Experience
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous Movie"
              className="w-10 h-10 rounded-full bg-surface-card/80 border border-white/10 hover:border-primary/50 hover:bg-primary/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Movie"
              className="w-10 h-10 rounded-full bg-surface-card/80 border border-white/10 hover:border-primary/50 hover:bg-primary/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Carousel Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Movie Info & Action */}
          <div className="lg:col-span-5 z-20 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 backdrop-blur-sm">
                IMAX 3D
              </span>
              <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 backdrop-blur-sm">
                Dolby Atmos
              </span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-lg border border-yellow-500/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> 4.9 Rating
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              {currentMovie.title}
            </h1>

            <div className="flex items-center gap-4 text-sm font-semibold text-gray-300">
              <span className="text-primary font-bold">{currentMovie.genre}</span>
              <span>•</span>
              <span>{currentMovie.durationMinutes} Minutes</span>
              <span>•</span>
              <span>{new Date(currentMovie.releaseDate).getFullYear()}</span>
            </div>

            <p className="text-gray-300 text-base leading-relaxed line-clamp-3 max-w-xl">
              {currentMovie.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={`/movies/${currentMovie.id}`}
                onClick={() => soundEffects.playHover()}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white px-8 py-4 rounded-2xl font-black text-base shadow-[0_0_30px_rgba(233,69,96,0.4)] hover:shadow-[0_0_40px_rgba(233,69,96,0.7)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
              >
                <Ticket className="w-5 h-5 transition-transform group-hover:rotate-12" />
                <span>BOOK 3D TICKETS</span>
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"></div>
              </Link>

              <button
                onClick={() => {
                  soundEffects.playHover();
                  setIsTrailerOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-surface-card/80 hover:bg-white/15 text-white px-6 py-4 rounded-2xl font-bold text-base border border-white/15 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <Play className="w-5 h-5 fill-current text-neon-cyan" />
                <span>Watch 3D Trailer</span>
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-2 pt-4">
              {displayMovies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCard(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === activeIndex
                      ? "w-10 bg-gradient-to-r from-primary to-neon-cyan shadow-[0_0_10px_rgba(233,69,96,0.8)]"
                      : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: 3D Cylindrical Perspective Carousel */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[480px] flex items-center justify-center perspective-1000">
            <div className="relative w-full max-w-[500px] h-full flex items-center justify-center transform-style-3d">
              {displayMovies.map((movie, index) => {
                // Calculate 3D offset relative to active index
                let offset = (index - activeIndex + displayMovies.length) % displayMovies.length;
                if (offset > displayMovies.length / 2) {
                  offset -= displayMovies.length;
                }

                // 3D positioning calculations
                const isActive = offset === 0;
                const rotateY = offset * 32;
                const translateZ = isActive ? 120 : -Math.abs(offset) * 140;
                const translateX = offset * 130;
                const scale = isActive ? 1.05 : 0.82 - Math.abs(offset) * 0.1;
                const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25;
                const zIndex = 20 - Math.abs(offset);

                return (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectCard(index)}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease",
                    }}
                    className={`absolute w-56 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer group select-none ${
                      isActive
                        ? "shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(233,69,96,0.3)] border-2 border-primary/80"
                        : "shadow-2xl border border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80"}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />

                    {/* 3D Holographic Glare Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {isActive && (
                      <div className="absolute top-3 right-3 bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg border border-white/20 animate-pulse">
                        FEATURING
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs text-neon-cyan font-bold uppercase tracking-wider mb-0.5">
                        {movie.genre}
                      </p>
                      <h3 className="text-lg font-black leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                        {movie.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Cinematic Trailer Modal */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="relative w-full max-w-4xl bg-surface-card border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(233,69,96,0.4)]">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-surface-light">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  {currentMovie.title} <span className="text-xs text-neon-cyan font-semibold border border-neon-cyan/30 px-2 py-0.5 rounded-full">Official 3D Trailer</span>
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

            {/* Video / Cinema Player Canvas */}
            <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
              <img
                src={currentMovie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80"}
                alt="Trailer Background"
                className="w-full h-full object-cover opacity-30 filter blur-sm scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

              {/* 3D Simulated Hologram Projection */}
              <div className="relative z-10 text-center p-8 space-y-4 max-w-lg">
                <div className="w-20 h-20 bg-primary/20 text-primary border border-primary/50 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(233,69,96,0.6)] animate-pulse">
                  <Play className="w-10 h-10 fill-current translate-x-1" />
                </div>
                <h4 className="text-2xl font-black text-white drop-shadow-md">
                  Experience {currentMovie.title} in IMAX 3D
                </h4>
                <p className="text-gray-300 text-sm">
                  Ultra-high framerate 4K projection, 128-channel spatial audio, and immersive multi-dimensional visuals.
                </p>
                <Link
                  to={`/movies/${currentMovie.id}`}
                  onClick={() => {
                    setIsTrailerOpen(false);
                    soundEffects.playHover();
                  }}
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg transition-transform hover:scale-105"
                >
                  Reserve Your Seats Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
