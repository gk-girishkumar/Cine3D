import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api, ApiError } from "../services/api";
import { soundEffects } from "../utils/audio";
import Snacks3DModal, { CINEMA_SNACKS } from "../components/Snacks3DModal";
import confetti from "canvas-confetti";
import {
  CreditCard,
  QrCode,
  Sparkles,
  ShieldCheck,
  Tag,
  Clock,
  Ticket,
  CheckCircle2,
  Lock,
  ArrowRight,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

type PaymentMethod = "UPI" | "CARD" | "WALLET";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const state = location.state as {
    showtimeId?: string;
    seatIds?: string[];
    movieTitle?: string;
    theaterName?: string;
    startTime?: string;
    price?: number;
  };

  const {
    showtimeId = "showtime-default-1",
    seatIds = ["seat-C-3", "seat-C-4"],
    movieTitle = "Dune: Part Two (IMAX 3D Experience)",
    theaterName = "IMAX Laser 3D Dome",
    startTime = new Date().toISOString(),
    price = 350,
  } = state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");

  // Concessions & Promo
  const [selectedSnacks, setSelectedSnacks] = useState<Record<string, number>>({});
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Card details state for 3D card preview
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const cardHolder = "ALEX RIVERA";
  const [cardExpiry, setCardExpiry] = useState("08/29");

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setError("Seat reservation timeout. Please re-select your seats.");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleQuantityChange = (snackId: string, delta: number) => {
    setSelectedSnacks((prev) => {
      const current = prev[snackId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: next };
    });
  };

  const handleApplyPromo = () => {
    soundEffects.playHover();
    if (promoCode.trim().toUpperCase() === "CINEMA3D" || promoCode.trim().toUpperCase() === "VIP3D") {
      setDiscountPercent(20);
      setAppliedPromo(promoCode.trim().toUpperCase());
      soundEffects.playSuccess();
      toast.success("Promo 'CINEMA3D' applied: 20% DISCOUNT!", { icon: "🎉" });
    } else {
      toast.error("Invalid code. Try using code 'CINEMA3D'");
    }
  };

  // Calculations
  const seatsCost = (price || 350) * seatIds.length;
  const snacksCost = Object.entries(selectedSnacks).reduce((sum, [id, qty]) => {
    const item = CINEMA_SNACKS.find((s) => s.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const subtotal = seatsCost + snacksCost;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxes = 38; // convenience fee
  const totalAmount = Math.max(0, subtotal - discountAmount + taxes);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePayment = async () => {
    if (!token) {
      toast.error("Please login to complete booking");
      return;
    }

    soundEffects.playHover();
    setLoading(true);
    setError(null);

    // Realistic payment processing pause
    await new Promise((resolve) => setTimeout(resolve, 2200));

    try {
      const response = await api.createBooking({ showtimeId, seatIds }, token);

      soundEffects.playSuccess();
      setSuccess(true);

      // Trigger Confetti Explosion
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#e94560", "#00f2fe", "#ffd166", "#9d4edd"],
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        navigate(`/ticket/${response.booking.id}`);
      }, 1600);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Payment processing failed");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Celebration Modal Overlay */}
      {success && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-xl animate-in zoom-in duration-300">
          <div className="glass-panel-glow border-2 border-primary/50 p-10 rounded-3xl text-center shadow-[0_0_80px_rgba(233,69,96,0.5)] max-w-md mx-4">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">3D Booking Confirmed!</h2>
            <p className="text-gray-300 text-sm mb-4">
              Minting your holographic digital pass & spatial audio ticket...
            </p>
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="text-xs font-black uppercase tracking-widest text-green-400">
              256-Bit Encrypted 3D Checkout
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Complete Your Reservation
          </h1>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-surface-card border border-white/10 px-4 py-2 rounded-2xl">
          <Clock className="w-4 h-4 text-neon-cyan animate-pulse" />
          <span className="text-xs text-gray-400 font-bold uppercase">Seats Locked:</span>
          <span className={`font-mono text-sm font-black ${timeLeft < 120 ? "text-primary animate-pulse" : "text-neon-cyan"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Concessions + Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          {/* Concessions / Confectionery Bar */}
          <Snacks3DModal
            selectedSnacks={selectedSnacks}
            onChangeQuantity={handleQuantityChange}
          />

          {/* Payment Selection Box */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-neon-cyan" /> Select Payment Method
            </h3>

            {/* Payment Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-surface-card rounded-2xl border border-white/10 mb-6">
              {[
                { id: "UPI", label: "Instant UPI / QR", icon: QrCode },
                { id: "CARD", label: "3D Credit Card", icon: CreditCard },
                { id: "WALLET", label: "VIP Wallet / Apple", icon: Wallet },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEffects.playHover();
                    setPaymentMethod(tab.id as PaymentMethod);
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    paymentMethod === tab.id
                      ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_0_15px_rgba(233,69,96,0.4)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* UPI Tab */}
            {paymentMethod === "UPI" && (
              <div className="text-center p-6 bg-surface-card/60 rounded-2xl border border-white/5 space-y-4">
                <div className="p-3 bg-white rounded-2xl inline-block shadow-[0_0_30px_rgba(0,242,254,0.2)] border-4 border-neon-cyan/40">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=UPI://pay?pa=cine3d@upi&am=${totalAmount.toFixed(2)}`}
                    alt="UPI QR Code"
                    className="w-36 h-36 mx-auto"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-300 font-bold">
                    Scan with Google Pay, PhonePe, Paytm, or BHIM
                  </p>
                  <p className="font-mono text-neon-cyan text-xs mt-1">cine3d.cinema@upi</p>
                </div>
              </div>
            )}

            {/* CARD Tab: 3D Holographic Credit Card */}
            {paymentMethod === "CARD" && (
              <div className="space-y-6">
                {/* 3D Visual Card */}
                <div className="w-full max-w-sm mx-auto aspect-[1.586/1] rounded-2xl p-6 bg-gradient-to-tr from-surface-card via-primary/30 to-neon-cyan/30 border border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(233,69,96,0.25)] flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase">
                      CINE3D PLATINUM PASS
                    </span>
                    <Sparkles className="w-4 h-4 text-neon-gold" />
                  </div>

                  <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-white">
                    {cardNumber}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                    <div>
                      <p className="text-[9px] uppercase text-gray-400">Cardholder</p>
                      <p className="font-bold text-white uppercase">{cardHolder}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-gray-400">Expires</p>
                      <p className="font-bold text-white">{cardExpiry}</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Card Inputs */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2">
                    <label className="block text-gray-400 uppercase font-bold mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">Expires</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      defaultValue="884"
                      maxLength={4}
                      className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WALLET Tab */}
            {paymentMethod === "WALLET" && (
              <div className="p-6 bg-surface-card/60 rounded-2xl border border-white/5 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
                  <Wallet className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Instant 1-Tap Wallet Pass</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Your CineBook VIP wallet balance is automatically applied. One-tap payment enabled for fast cinema entry.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-bold text-red-400">
                {error}
              </div>
            )}

            {/* Pay Action Button */}
            <button
              onClick={handlePayment}
              disabled={loading || timeLeft <= 0 || success}
              className="mt-6 w-full relative overflow-hidden group bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-500 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-[0_0_30px_rgba(233,69,96,0.4)] hover:shadow-[0_0_40px_rgba(233,69,96,0.7)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying 3D Payment Stream...</span>
                </span>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>PAY ₹{totalAmount.toFixed(2)} & GET 3D PASS</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 5 Columns: 3D Booking Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" /> Booking Summary
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/40 px-2.5 py-0.5 rounded-full">
                IMAX 3D
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Movie Title</p>
                <p className="text-xl font-black text-white leading-snug">{movieTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Auditorium</p>
                  <p className="font-bold text-gray-200">{theaterName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Showtime</p>
                  <p className="font-bold text-neon-cyan">
                    {new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                  Reserved 3D Seats ({seatIds.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {seatIds.map((sid, i) => (
                    <span
                      key={i}
                      className="bg-primary/20 text-white border border-primary/40 px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
                    >
                      {sid.replace("seat-", "")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-neon-gold" /> Promo Code (Use 'CINEMA3D')
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter CINEMA3D"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-surface-card border border-white/10 focus:border-primary px-3 py-2 rounded-xl text-xs uppercase font-mono text-white placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-neon-gold/20 hover:bg-neon-gold/30 text-neon-gold border border-neon-gold/40 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-green-400 font-bold mt-1.5">
                    ✓ Promo '{appliedPromo}' applied (20% off)
                  </p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>3D Seats ({seatIds.length}x ₹{price})</span>
                  <span className="font-mono font-bold text-white">₹{seatsCost.toFixed(2)}</span>
                </div>

                {snacksCost > 0 && (
                  <div className="flex justify-between text-neon-gold">
                    <span>Gourmet Concessions & Combos</span>
                    <span className="font-mono font-bold">₹{snacksCost.toFixed(2)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400 font-bold">
                    <span>3D Promo Discount</span>
                    <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Spatial Audio & 3D Glass Fee</span>
                  <span className="font-mono">₹{taxes.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                  <span className="text-sm font-black text-white uppercase tracking-wider">
                    Total Payable
                  </span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-primary to-neon-cyan font-mono">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
