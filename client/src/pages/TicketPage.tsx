import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api, ApiError } from "../services/api";
import type { Booking } from "../types";
import HoloTicket3D from "../components/HoloTicket3D";
import { soundEffects } from "../utils/audio";
import confetti from "canvas-confetti";
import { Download, CheckCircle2, Ticket, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const ticketExportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !token) return;

    // Trigger celebratory confetti on ticket view
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#e94560", "#00f2fe", "#ffd166", "#9d4edd"],
      });
    } catch {
      // ignore
    }

    api
      .getBooking(id, token)
      .then((data) => {
        setBooking(data.booking);
      })
      .catch((err) =>
        toast.error(err instanceof ApiError ? err.message : "Failed to load ticket")
      )
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleDownloadPDF = async () => {
    if (!ticketExportRef.current) return;
    soundEffects.playHover();
    const toastId = toast.loading("Rendering High-Resolution 3D Ticket PDF...");

    try {
      const canvas = await html2canvas(ticketExportRef.current, {
        scale: 2,
        backgroundColor: "#0a0c16",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a5");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Cine3D_Ticket_${id?.slice(0, 8)}.pdf`);

      soundEffects.playSuccess();
      toast.success("3D Holographic Pass Downloaded!", { id: toastId });
    } catch {
      toast.error("Failed to export PDF", { id: toastId });
    }
  };

  const handleShare = () => {
    soundEffects.playHover();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Ticket link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold">Generating 3D Holographic Pass...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center max-w-md mx-auto my-12 border border-red-500/30">
        <p className="text-red-400 font-bold mb-4">Ticket pass not found</p>
        <Link
          to="/"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm"
        >
          Return to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-2 animate-in slide-in-from-top-4 duration-500">
        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4" /> Booking Confirmed & Verified
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Your 3D Cinema Pass
        </h1>
        <p className="text-gray-400 text-sm">
          Interactive holographic digital ticket ready for auditorium entry.
        </p>
      </div>

      {/* 3D Holographic Ticket Component */}
      <div className="w-full flex justify-center">
        <HoloTicket3D booking={booking} ticketRef={ticketExportRef} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-blue-600 hover:from-neon-cyan hover:to-blue-500 text-gray-900 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-[0_0_25px_rgba(0,242,254,0.3)] hover:scale-105 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Pass</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Pass Link</span>
        </button>

        <Link
          to="/my-bookings"
          onClick={() => soundEffects.playHover()}
          className="flex items-center gap-2 bg-surface-card hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
        >
          <Ticket className="w-4 h-4 text-primary" />
          <span>All My Bookings</span>
        </Link>
      </div>
    </div>
  );
}
