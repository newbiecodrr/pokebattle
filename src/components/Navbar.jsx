import { Link, useLocation } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { SoundEngine } from "@/utils/audio";
import { Volume2, VolumeX, Flame, Trophy, Swords } from "lucide-react";

/**
 * ============================================================================
 * NAVIGATION HEADER COMPONENT (Phase 06 & 07)
 * ============================================================================
 * Features:
 * - Brand badge with glowing typography (Clean without version tags)
 * - Responsive Win Streak & Best Record stats badge
 * - Audio Effects toggle (Web Audio API)
 * - Mobile-optimized layout and touch targets
 */

export function Navbar() {
  const location = useLocation();
  const { winStreak, bestStreak, soundEnabled, toggleSound } = useGame();

  const handleSoundToggle = () => {
    if (!soundEnabled) SoundEngine.playClick();
    toggleSound();
  };

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        
        {/* Brand Logo / Home Link */}
        <Link
          to="/"
          onClick={() => soundEnabled && SoundEngine.playClick()}
          className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform">
            <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <span className="font-bebas text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              POKÉBATTLE
            </span>
          </div>
        </Link>

        {/* Center / Right Control Panel */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Win Streak Persistent Display (Phase 27) */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] sm:text-xs font-medium">
            <div className="flex items-center gap-1 text-amber-400">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400/20" />
              <span><strong className="text-white font-bold">{winStreak}</strong><span className="hidden xs:inline"> W</span></span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <div className="items-center gap-1 text-zinc-400 hidden sm:flex">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span>Best: <strong className="text-zinc-200">{bestStreak}</strong></span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/select"
              onClick={() => soundEnabled && SoundEngine.playClick()}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all ${
                location.pathname === "/select"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/20"
                  : "text-zinc-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Roster
            </Link>

            <Link
              to="/battle"
              onClick={() => soundEnabled && SoundEngine.playClick()}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all ${
                location.pathname === "/battle"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/20"
                  : "text-zinc-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Arena
            </Link>
          </nav>

          {/* Sound FX Toggle Button */}
          <button
            onClick={handleSoundToggle}
            title={soundEnabled ? "Mute Audio SFX" : "Enable Audio SFX"}
            aria-label={soundEnabled ? "Mute Audio SFX" : "Enable Audio SFX"}
            className="p-1.5 sm:p-2 rounded-lg bg-zinc-900/90 border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 transition-all"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
