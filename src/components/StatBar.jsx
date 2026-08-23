import { Heart, Zap, Shield } from "lucide-react";

export default function StatBar({
  label = "HP",
  current = 100,
  max = 100,
  type = "hp", // 'hp' | 'energy'
  isDefending = false,
}) {
  const percent = Math.max(0, Math.min(100, Math.round((current / max) * 100)));

  // Dynamic HP bar color (Green > 50%, Amber 25-50%, Red < 25%)
  const getHpColor = () => {
    if (percent > 50) return "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]";
    if (percent > 25) return "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]";
    return "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse";
  };

  const getEnergyColor = () => {
    return "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]";
  };

  return (
    <div className="w-full">
      {/* Stat label and values */}
      <div className="flex items-center justify-between text-xs font-semibold mb-1">
        <div className="flex items-center gap-1.5 text-zinc-300">
          {type === "hp" ? (
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400/20" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
          )}
          <span className="tracking-wider uppercase font-bold text-zinc-200">{label}</span>
          
          {/* Shielded badge if currently guarding */}
          {type === "hp" && isDefending && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] uppercase font-bold animate-pulse">
              <Shield className="w-2.5 h-2.5" /> SHIELDED
            </span>
          )}
        </div>

        <div className="font-mono text-zinc-300">
          <span className="font-bold text-white">{current}</span>
          <span className="text-zinc-500 text-[11px]"> / {max}</span>
        </div>
      </div>

      {/* Progress fill bar */}
      <div className="h-3 w-full rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden relative shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            type === "hp" ? getHpColor() : getEnergyColor()
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
