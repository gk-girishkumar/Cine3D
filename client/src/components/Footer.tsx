import { Film, Sparkles, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto bg-surface-card/60 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-neon-cyan flex items-center justify-center text-white shadow-[0_0_15px_rgba(233,69,96,0.5)]">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">
                Cine<span className="text-primary">3D</span> Experience
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm">
              Next-generation 3D interactive movie booking and cinematic portal. Real-time 3D hall simulation, spatial audio calibration, and holographic ticketing.
            </p>
          </div>

          {/* Formats */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-neon-cyan mb-3">
              Screen Technologies
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neon-gold" /> IMAX with Laser 3D
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" /> Dolby Atmos 128-Ch
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> 4DX Sensory Motion
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Velvet Recliner VIP
              </li>
            </ul>
          </div>

          {/* Verification */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-neon-gold mb-3">
              Safety & Guarantee
            </h4>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                <Shield className="w-4 h-4" /> 100% Verified Digital Passes
              </div>
              <p className="text-[11px] text-gray-400">
                Encrypted QR check-in & instant wallet pass synchronization.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Cine3D Studios & Ticketing. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Engineered with 3D WebGL & React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
