import { Link, useLocation } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { SoundEngine } from "@/utils/audio";
import { Volume2, VolumeX, Flame, Trophy } from "lucide-react";

function PokeBallLogo({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-red-500 group-hover:text-red-400 transition-colors"
      />
      <path
        d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-zinc-400 group-hover:text-zinc-200 transition-colors"
      />
      <path
        d="M3 12H8.5M15.5 12H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
      />
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        className="text-white group-hover:text-red-400 transition-colors"
      />
      <circle
        cx="12"
        cy="12"
        r="1.25"
        className="fill-red-500 group-hover:fill-red-400 transition-colors animate-pulse"
      />
    </svg>
  );
}

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
        <Link
          to="/"
          onClick={() => soundEnabled && SoundEngine.playClick()}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900/90 border border-white/10 group-hover:border-red-500/40 group-hover:bg-red-950/20 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] flex items-center justify-center transition-all duration-300">
            <PokeBallLogo className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bebas text-xl sm:text-2xl tracking-[0.1em] text-white">
              POKÉ<span className="text-red-500 group-hover:text-red-400 transition-colors">BATTLE</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.8)] hidden xs:block" />
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
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
