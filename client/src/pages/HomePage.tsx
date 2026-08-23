import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Movie } from "../types";
import Hero3DCarousel from "../components/Hero3DCarousel";
import Card3DTilt from "../components/Card3DTilt";
import { soundEffects } from "../utils/audio";
import {
  Film,
  Search,
  Star,
  Sparkles,
  Ticket,
  Clock,
  Calendar,
  Flame,
  Clapperboard,
  ShieldCheck,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

function MovieSkeleton() {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-pulse border border-white/5 flex flex-col">
      <div className="aspect-[2/3] bg-white/5 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-white/10 rounded-lg w-3/4"></div>
        <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
        <div className="h-10 bg-white/10 rounded-xl w-full mt-2"></div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    api
      .getMovies()
      .then((data) => setMovies(data.movies))
      .catch(() => toast.error("Failed to load movies"))
      .finally(() => setLoading(false));
  }, []);

  const genres = ["All", "Sci-Fi / Adventure", "Cyberpunk / Action", "Animation / Action", "Biography / Drama", "Fantasy / Adventure"];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-12 pb-12">
      {/* 3D Hero Carousel Component */}
      {loading ? (
        <div className="w-full h-[450px] glass-panel rounded-3xl animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Hero3DCarousel movies={movies} />
      )}

      {/* 3D Cinema Feature Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Sparkles, title: "IMAX Laser 3D", desc: "Dual 4K Laser Projection", color: "text-neon-cyan" },
          { icon: Zap, title: "Dolby Atmos", desc: "128-Channel Spatial Sound", color: "text-neon-gold" },
          { icon: Flame, title: "4DX Dynamic Seats", desc: "Sensory Motion FX", color: "text-primary" },
          { icon: ShieldCheck, title: "Instant Holo-Pass", desc: "Encrypted QR Check-In", color: "text-green-400" },
        ].map((feature, i) => (
          <div
            key={i}
            className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center gap-3.5 group"
          >
            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${feature.color} group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">{feature.title}</h4>
              <p className="text-[11px] text-gray-400">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-black text-white">Now Showing in 3D</h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Select a movie to pick your 3D seat vantage</p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 3D titles, genres, IMAX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-card/90 border border-white/10 focus:border-primary pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                soundEffects.playHover();
                setSelectedGenre(genre);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all ${
                selectedGenre === genre
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_0_15px_rgba(233,69,96,0.4)]"
                  : "bg-surface-card/70 text-gray-400 hover:text-white hover:bg-surface-card border border-white/5"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Movies Grid */}
      <div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <MovieSkeleton key={i} />
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl text-center border border-white/10 max-w-lg mx-auto">
            <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">No 3D Movies Found</h3>
            <p className="text-gray-400 text-sm">Try tweaking your search query or genre filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {filteredMovies.map((movie) => (
              <Card3DTilt
                key={movie.id}
                maxTilt={12}
                scale={1.03}
                className="rounded-3xl glass-panel-glow border border-white/10 hover:border-primary/60 transition-all flex flex-col group h-full"
              >
                <Link
                  to={`/movies/${movie.id}`}
                  onClick={() => soundEffects.playHover()}
                  className="flex flex-col h-full"
                >
                  {/* Poster Image Container */}
                  <div className="aspect-[16/11] relative overflow-hidden rounded-t-3xl bg-black/40">
                    <img
                      src={
                        movie.posterUrl ||
                        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/20 to-transparent opacity-90" />

                    {/* 3D Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-neon-cyan flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3 text-neon-cyan" /> 3D IMAX
                    </div>

                    <div className="absolute top-3 right-3 bg-yellow-500/20 border border-yellow-500/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                    </div>

                    {/* Bottom overlay in image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-black uppercase tracking-wider text-primary">
                        {movie.genre}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors leading-tight line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {movie.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-300 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" /> {movie.durationMinutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" /> {new Date(movie.releaseDate).getFullYear()}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(233,69,96,0.3)] group-hover:shadow-[0_0_20px_rgba(233,69,96,0.6)] group-hover:scale-105 transition-all">
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book 3D</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card3DTilt>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
