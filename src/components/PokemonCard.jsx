import { SoundEngine } from "@/utils/audio";
import { Heart, Zap, Shield, Swords, Sparkles } from "lucide-react";

/**
 * ============================================================================
 * POKEMON CARD COMPONENT (Phase 17)
 * ============================================================================
 * Concepts:
 * - Component Reusability & Props Contract
 * - Glassmorphic styling with dynamic type-based glow accents
 * - Accessibility: aria-pressed, keyboard focus rings, semantic buttons
 */

// Type badge color mappings
const TYPE_STYLES = {
  Electric: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  Fire: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  Water: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Grass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  Poison: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  Flying: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  Ghost: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  Psychic: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  Normal: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
};

export default function PokemonCard({
  pokemon,
  isSelected,
  onSelect,
  isCpuSelected,
  soundEnabled = true,
}) {
  const handleClick = () => {
    if (soundEnabled) SoundEngine.playClick();
    onSelect(pokemon);
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${pokemon.name} - ${pokemon.types.join(", ")} type`}
      className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 outline-none flex flex-col justify-between select-none ${
        isSelected
          ? "bg-red-950/40 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-[1.03]"
          : isCpuSelected
          ? "bg-blue-950/30 border-2 border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          : "glass-panel border-white/10 hover:border-white/30 hover:scale-[1.02] hover:shadow-xl"
      } focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
    >
      {/* Selection Badges */}
      {isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 z-20">
          <Sparkles className="w-3 h-3" /> Player Pick
        </div>
      )}
      {isCpuSelected && !isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg z-20">
          CPU Opponent
        </div>
      )}

      {/* Header Info: Name & Types */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bebas text-3xl tracking-wide text-white">
            {pokemon.name}
          </h3>
          <span className="text-xs font-mono text-zinc-500 font-bold">
            #{String(pokemon.pokedexId || 1).padStart(3, "0")}
          </span>
        </div>

        {/* Type Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                TYPE_STYLES[type] || TYPE_STYLES.Normal
              }`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Center Sprite Stage */}
      <div className="relative h-32 flex items-center justify-center my-2 group">
        {/* Ambient Radial Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-25 group-hover:opacity-40 transition-opacity"
          style={{ backgroundColor: pokemon.accentColor || "#ef4444" }}
        />
        
        {/* Animated Sprite */}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="relative max-h-28 max-w-28 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] animate-idle"
          loading="lazy"
        />
      </div>

      {/* Description Snippet */}
      <p className="text-zinc-400 text-xs line-clamp-2 my-2 min-h-[2rem]">
        {pokemon.description || "A battle-tested combatant ready for the arena."}
      </p>

      {/* Stat Meters */}
      <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs">
        {/* HP */}
        <div className="flex items-center justify-between text-zinc-300">
          <span className="flex items-center gap-1 text-emerald-400">
            <Heart className="w-3.5 h-3.5" /> HP
          </span>
          <span className="font-mono font-bold text-white">{pokemon.maxHp}</span>
        </div>

        {/* Base Attack */}
        <div className="flex items-center justify-between text-zinc-300">
          <span className="flex items-center gap-1 text-red-400">
            <Swords className="w-3.5 h-3.5" /> Attack
          </span>
          <span className="font-mono font-bold text-white">{pokemon.baseDamage}</span>
        </div>

        {/* Defense */}
        <div className="flex items-center justify-between text-zinc-300">
          <span className="flex items-center gap-1 text-blue-400">
            <Shield className="w-3.5 h-3.5" /> Defense
          </span>
          <span className="font-mono font-bold text-white">{pokemon.defense}</span>
        </div>

        {/* Strong Move Cost */}
        <div className="flex items-center justify-between text-zinc-300">
          <span className="flex items-center gap-1 text-amber-400">
            <Zap className="w-3.5 h-3.5" /> {pokemon.moves.strong}
          </span>
          <span className="font-mono font-bold text-amber-300">{pokemon.strongCost} EN</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className={`w-full mt-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all cursor-pointer ${
          isSelected
            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
            : "bg-white/10 hover:bg-white/20 text-zinc-200"
        }`}
      >
        {isSelected ? "CHOSEN CHAMPION" : "SELECT POKÉMON"}
      </button>
    </div>
  );
}
