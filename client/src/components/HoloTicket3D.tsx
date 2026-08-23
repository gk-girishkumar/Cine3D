import { useState, useRef, type MouseEvent } from "react";
import { RotateCw, Sparkles, CheckCircle2, QrCode, Shield, Volume2 } from "lucide-react";
import type { Booking } from "../types";
import { soundEffects } from "../utils/audio";

interface HoloTicket3DProps {
  booking: Booking;
  ticketRef?: React.RefObject<HTMLDivElement | null>;
}

export default function HoloTicket3D({ booking, ticketRef }: HoloTicket3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;

    setTilt({
      rotateX: rotX,
      rotateY: rotY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt((prev) => ({ ...prev, rotateX: 0, rotateY: 0, isHovered: false }));
  };

  const handleFlip = () => {
    soundEffects.playHover();
    setIsFlipped(!isFlipped);
  };

  const date = new Date(booking.showtime.startTime);

  return (
    <div className="w-full flex flex-col items-center select-none perspective-1000 py-6">
      {/* 3D Flip Toggle Control */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={handleFlip}
          className="flex items-center gap-2 bg-white/10 hover:bg-primary/30 border border-white/20 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? "rotate-180 text-neon-cyan" : "text-primary"}`} />
          {isFlipped ? "View Ticket Front" : "Flip 3D Ticket (View Back)"}
        </button>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Move cursor for 3D holographic sheen
        </span>
      </div>

      {/* 3D Ticket Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY + (isFlipped ? 180 : 0)}deg) scale3d(${tilt.isHovered ? 1.02 : 1}, ${tilt.isHovered ? 1.02 : 1}, 1)`,
          transition: tilt.isHovered ? "transform 0.08s ease-out" : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-2xl min-h-[340px] cursor-pointer"
      >
        {/* Export Target Container */}
        <div ref={ticketRef} className="w-full h-full transform-style-3d">
          {/* ================= FRONT SIDE ================= */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="w-full h-full rounded-3xl overflow-hidden glass-panel-glow border-2 border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(233,69,96,0.25)] flex flex-col md:flex-row relative"
          >
            {/* Holographic Iridescent Sheen Layer */}
            <div
              className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 holo-shimmer"
              style={{
                opacity: tilt.isHovered ? 0.65 : 0.35,
                backgroundPosition: `${tilt.glareX}% ${tilt.glareY}%`,
              }}
            />

            {/* Left Main Ticket Body */}
            <div className="p-8 flex-1 flex flex-col justify-between relative bg-gradient-to-br from-surface-card/95 via-surface-light/90 to-surface-card/95">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
                    <span className="text-xs font-black tracking-widest uppercase text-neon-cyan">
                      IMAX 3D CINEMA PASS
                    </span>
                  </div>
                  <span className="bg-primary/20 text-primary border border-primary/40 px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase">
                    {booking.status}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2 tracking-tight">
                  {booking.showtime.movie.title}
                </h2>
                <p className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-6">
                  <span>{booking.showtime.theater.name}</span>
                  <span>•</span>
                  <span className="text-gray-400">{booking.showtime.theater.location}</span>
                </p>
              </div>

              {/* Show Details Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Date</p>
                  <p className="font-black text-white text-sm">
                    {date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Time</p>
                  <p className="font-black text-neon-cyan text-sm">
                    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Seats</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.seats.map((s, i) => (
                      <span key={i} className="bg-primary/30 text-white font-mono font-bold text-xs px-2 py-0.5 rounded border border-primary/50">
                        {s.row}{s.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Stub Divider */}
            <div className="relative flex md:flex-col items-center justify-between bg-surface-card px-2 py-4 md:py-2 md:px-0">
              <div className="w-6 h-6 rounded-full bg-[#080911] -translate-x-3 md:translate-x-0 md:-translate-y-3 shadow-inner"></div>
              <div className="flex-1 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-white/20 my-1 mx-2"></div>
              <div className="w-6 h-6 rounded-full bg-[#080911] translate-x-3 md:translate-x-0 md:translate-y-3 shadow-inner"></div>
            </div>

            {/* Right Ticket Stub (QR + Verification) */}
            <div className="p-6 md:w-56 shrink-0 bg-surface-light flex flex-col items-center justify-center text-center relative z-20">
              <div className="p-2.5 bg-white rounded-2xl shadow-xl mb-3 border-2 border-primary/40 relative group">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${booking.id}`}
                  alt="Ticket QR Code"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <p className="font-mono text-[10px] font-bold text-gray-400 tracking-widest break-all">
                {booking.id.slice(0, 16).toUpperCase()}
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-green-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>VERIFIED PASS</span>
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE ================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden glass-panel-cyan border-2 border-neon-cyan/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,242,254,0.2)] p-8 flex flex-col justify-between bg-gradient-to-br from-surface-card/98 via-surface-light/95 to-surface-card/98 text-white"
          >
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-neon-cyan">
                  <Shield className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase tracking-widest">Cinema Security & Specs</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <Volume2 className="w-4 h-4 text-neon-gold" />
                  <span>Dolby Atmos 128-Ch Spatial Audio</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-300 mb-4">
                <div className="space-y-2">
                  <p className="font-bold text-white uppercase text-[11px] text-primary">Auditorium Guidelines</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    <li>Entry opens 15 mins prior to showtime.</li>
                    <li>Active 3D glasses provided at seat entrance.</li>
                    <li>Gourmet concessions available at Kiosk #4.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-white uppercase text-[11px] text-neon-cyan">Digital Verification</p>
                  <p className="font-mono text-[10px] text-gray-400">
                    PASS_ID: {booking.id}<br />
                    SHOW_REF: {booking.showtimeId}<br />
                    CRYPT_SIG: SHA256-{booking.id.slice(0, 8)}99A
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-neon-cyan" />
                <span>Show this QR at the scanner turnstile</span>
              </div>
              <button
                onClick={handleFlip}
                className="text-primary hover:text-white font-bold transition-colors"
              >
                ← Flip Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
