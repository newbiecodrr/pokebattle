import { Trophy, Skull, RotateCcw, ArrowRight, Flame, Swords } from "lucide-react";
import { Link } from "react-router-dom";
import { SoundEngine } from "@/utils/audio";

/**
 * ============================================================================
 * GAME OVER MODAL (Phase 26 & 27)
 * ============================================================================
 * Concepts:
 * - Mount/Unmount Animation Chaining
 * - LocalStorage Persistent Streak display & match recap metrics
 */

export default function GameOverModal({
  isWinner,
  playerPokemon,
  cpuPokemon,
  turns,
  totalDamageDealt,
  winStreak,
  bestStreak,
  onRematch,
  soundEnabled = true,
}) {
  const handleRematch = () => {
    if (soundEnabled) SoundEngine.playClick();
    onRematch();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden border ${
          isWinner
            ? "bg-gradient-to-b from-amber-950/40 via-zinc-950/90 to-zinc-950 border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.25)]"
            : "bg-gradient-to-b from-red-950/40 via-zinc-950/90 to-zinc-950 border-red-500/40 shadow-[0_0_60px_rgba(239,68,68,0.25)]"
        }`}
      >
        {/* Animated Radial Spotlight */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isWinner ? "bg-amber-500/20" : "bg-red-500/20"
          }`}
        />

        {/* Icon & Banner */}
        <div className="relative mb-6">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-2xl mb-4 ${
              isWinner
                ? "bg-gradient-to-tr from-amber-600 to-yellow-400 text-white shadow-amber-500/30 animate-bounce"
                : "bg-gradient-to-tr from-red-700 to-zinc-800 text-zinc-300 shadow-red-500/30"
            }`}
          >
            {isWinner ? <Trophy className="w-10 h-10" /> : <Skull className="w-10 h-10" />}
          </div>

          <h2 className="font-bebas text-5xl sm:text-6xl tracking-wide text-white drop-shadow-md">
            {isWinner ? (
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                VICTORY ACHIEVED!
              </span>
            ) : (
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-zinc-400 bg-clip-text text-transparent">
                DEFEAT
              </span>
            )}
          </h2>

          <p className="text-zinc-300 text-sm mt-1 max-w-sm mx-auto">
            {isWinner
              ? `${playerPokemon.name} overpowered ${cpuPokemon.name} in an electrifying battle.`
              : `${playerPokemon.name} fainted. Analyze your strategy and strike back.`}
          </p>
        </div>

        {/* Match Breakdown Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 mb-8 text-xs">
          <div>
            <span className="text-zinc-400 uppercase font-semibold block mb-1">Turns</span>
            <span className="font-bebas text-2xl text-white">{turns}</span>
          </div>

          <div>
            <span className="text-zinc-400 uppercase font-semibold block mb-1">Damage Dealt</span>
            <span className="font-bebas text-2xl text-red-400">{totalDamageDealt} DMG</span>
          </div>

          <div>
            <span className="text-zinc-400 uppercase font-semibold block mb-1 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Win Streak
            </span>
            <span className="font-bebas text-2xl text-amber-300">{winStreak}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleRematch}
            className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:scale-[1.02] active:scale-[0.98] text-white font-bebas text-2xl tracking-wider shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-5 h-5" /> REMATCH
          </button>

          <Link
            to="/select"
            onClick={() => soundEnabled && SoundEngine.playClick()}
            className="w-full sm:flex-1 py-3.5 rounded-xl glass-panel hover:bg-white/15 text-white font-bebas text-2xl tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border-white/20"
          >
            <Swords className="w-5 h-5" /> NEW OPPONENT
          </Link>
        </div>

      </div>
    </div>
  );
}
