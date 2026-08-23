import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { SoundEngine } from "@/utils/audio";
import { Swords, Zap, Shield, Cpu, Flame, Trophy, Play, ArrowRight, Sparkles } from "lucide-react";

/**
 * ============================================================================
 * LANDING PAGE — HERO, STATS & COMBAT LAUNCHPAD (Phase 13)
 * ============================================================================
 * Mobile-optimized layout with fluid typography and smooth micro-animations.
 */

export default function Landing() {
  const navigate = useNavigate();
  const { winStreak, bestStreak, totalBattles, soundEnabled } = useGame();

  // Keyboard shortcut: Pressing 'Enter' or 'Space' from landing page initiates combat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.code === "Space") {
        if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
          e.preventDefault();
          if (soundEnabled) SoundEngine.playClick();
          navigate("/select");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, soundEnabled]);

  const handleStart = () => {
    if (soundEnabled) SoundEngine.playClick();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] py-4 sm:py-8">
      
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-4 sm:mb-6 animate-pulse">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
        Tactical Turn-Based Combat Engine
      </div>

      {/* Main Title */}
      <h1 className="font-bebas text-5xl sm:text-7xl md:text-9xl text-center tracking-tight leading-none text-white drop-shadow-[0_10px_35px_rgba(239,68,68,0.35)]">
        POKÉ<span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">BATTLE</span>
      </h1>

      <p className="max-w-xl text-center text-zinc-300 text-sm sm:text-base md:text-lg font-normal mt-3 sm:mt-4 mb-6 sm:mb-8 leading-relaxed px-2">
        Command iconic Pokémon in high-stakes tactical combat powered by a pure ES6 OOP battle engine, real-time energy economy, and intelligent CPU heuristics.
      </p>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto px-4 sm:px-0">
        <Link
          to="/select"
          onClick={handleStart}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white font-bebas text-xl sm:text-2xl tracking-wider shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 sm:gap-3 border border-red-400/40 cursor-pointer"
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          <span>ENTER ARENA SELECTION</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
        </Link>
      </div>

      {/* Persistent Stats Ribbon */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-6 w-full max-w-2xl mb-8 sm:mb-12 px-2 sm:px-0">
        <div className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-amber-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
            <Flame className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400/20" />
            Streak
          </div>
          <span className="font-bebas text-2xl sm:text-4xl text-white">{winStreak}</span>
        </div>

        <div className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-yellow-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            Best
          </div>
          <span className="font-bebas text-2xl sm:text-4xl text-white">{bestStreak}</span>
        </div>

        <div className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-blue-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
            <Swords className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            Battles
          </div>
          <span className="font-bebas text-2xl sm:text-4xl text-white">{totalBattles}</span>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 w-full max-w-4xl px-2 sm:px-0">
        <div className="glass-panel p-4 sm:p-6 rounded-xl sm:rounded-2xl border-white/10 hover:border-red-500/30 transition-all group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white tracking-wide mb-1">Pure OOP Engine</h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Headless battle math with energy deductions, critical hit variance, and defense mitigation.
          </p>
        </div>

        <div className="glass-panel p-4 sm:p-6 rounded-xl sm:rounded-2xl border-white/10 hover:border-amber-500/30 transition-all group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white tracking-wide mb-1">Canvas & VFX</h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            60fps particle kinematics, recursive procedural lightning, and CRT scanline overlays.
          </p>
        </div>

        <div className="glass-panel p-4 sm:p-6 rounded-xl sm:rounded-2xl border-white/10 hover:border-blue-500/30 transition-all group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="font-bebas text-xl sm:text-2xl text-white tracking-wide mb-1">Tactical CPU AI</h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Intelligent decision tree evaluating lethal execution thresholds and defensive timing.
          </p>
        </div>
      </div>

    </div>
  );
}