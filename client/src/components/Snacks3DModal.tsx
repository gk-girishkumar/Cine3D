import { useState } from "react";
import { Plus, Minus, Popcorn } from "lucide-react";
import { soundEffects } from "../utils/audio";

export interface SnackItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  badge?: string;
  description: string;
}

export const CINEMA_SNACKS: SnackItem[] = [
  {
    id: "snack-1",
    name: "Gourmet Gold Popcorn Tub",
    category: "Popcorn",
    price: 240,
    icon: "🍿",
    badge: "Bestseller",
    description: "Crispy jumbo kernels glazed with slow-churned butter & sea salt.",
  },
  {
    id: "snack-2",
    name: "Loaded Queso Nachos Grande",
    category: "Nachos",
    price: 290,
    icon: "🧀",
    badge: "Cheesy",
    description: "Artisan tortilla crisps with jalapeños and molten cheddar sauce.",
  },
  {
    id: "snack-3",
    name: "Cyber Neon Refresher (1L)",
    category: "Beverage",
    price: 180,
    icon: "🥤",
    badge: "Chilled",
    description: "Berry burst fizzy iced cooler with holographic edible glitter.",
  },
  {
    id: "snack-4",
    name: "Ultimate VIP 3D Combo Box",
    category: "Combo",
    price: 499,
    icon: "🎉",
    badge: "Save 30%",
    description: "Jumbo Popcorn + Large Nachos + 2 Neon Sodas + Choco Lava Cake.",
  },
];

interface Snacks3DModalProps {
  selectedSnacks: Record<string, number>;
  onChangeQuantity: (snackId: string, delta: number) => void;
}

export default function Snacks3DModal({
  selectedSnacks,
  onChangeQuantity,
}: Snacks3DModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Popcorn", "Nachos", "Beverage", "Combo"];

  const filteredSnacks = activeCategory === "All"
    ? CINEMA_SNACKS
    : CINEMA_SNACKS.filter((s) => s.category === activeCategory);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Popcorn className="w-4 h-4 text-neon-gold" />
            <span className="text-xs font-black uppercase tracking-widest text-neon-gold">
              Cinema Concession Bar
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Gourmet Snacks & 3D Combos
          </h3>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1 bg-surface-card/80 p-1 rounded-xl border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEffects.playHover();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Snack Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredSnacks.map((snack) => {
          const qty = selectedSnacks[snack.id] || 0;

          return (
            <div
              key={snack.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                qty > 0
                  ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(233,69,96,0.2)]"
                  : "bg-surface-card/60 border-white/5 hover:border-white/20 hover:bg-surface-card"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl p-2 bg-white/5 rounded-xl border border-white/10 shrink-0">
                  {snack.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-black text-white line-clamp-1">{snack.name}</h4>
                    {snack.badge && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-neon-gold/20 text-neon-gold border border-neon-gold/40 px-2 py-0.5 rounded-full shrink-0">
                        {snack.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{snack.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="font-black text-neon-cyan text-base">₹{snack.price}</span>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-surface-light border border-white/10 rounded-xl p-1">
                  {qty > 0 && (
                    <>
                      <button
                        onClick={() => {
                          soundEffects.playHover();
                          onChangeQuantity(snack.id, -1);
                        }}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-sm text-white">{qty}</span>
                    </>
                  )}
                  <button
                    onClick={() => {
                      soundEffects.playSeatSelect();
                      onChangeQuantity(snack.id, 1);
                    }}
                    className="w-7 h-7 rounded-lg bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
