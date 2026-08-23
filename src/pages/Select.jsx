import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemonData } from "@/hooks/usePokemonData";
import { useGame } from "@/context/GameContext";
import PokemonCard from "@/components/PokemonCard";
import { SoundEngine } from "@/utils/audio";
import { Swords, Shuffle, ArrowRight, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";

/**
 * ============================================================================
 * ROSTER SELECTION PAGE (Phase 17 & 18)
 * ============================================================================
 * Features:
 * - Fluid skeleton loading animation
 * - Mobile-first responsive card grid
 * - Touch-friendly matchup staging launch bar
 */

export default function Select() {
  const navigate = useNavigate();
  const { roster, isLoading, isError, refetch } = usePokemonData();
  const { playerPokemon, setPlayerPokemon, cpuPokemon, setCpuPokemon, soundEnabled } = useGame();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCpu, setSelectedCpu] = useState(null);

  // Initialize selections once roster resolves
  useEffect(() => {
    if (roster.length > 0 && !selectedPlayer) {
      const defaultPlayer = playerPokemon || roster[0];
      const defaultCpu =
        cpuPokemon ||
        roster.find((p) => p.name !== defaultPlayer.name) ||
        roster[1] ||
        roster[0];

      setSelectedPlayer(defaultPlayer);
      setSelectedCpu(defaultCpu);
      setPlayerPokemon(defaultPlayer.clone());
      setCpuPokemon(defaultCpu.clone());
    }
  }, [roster, playerPokemon, cpuPokemon, selectedPlayer, setPlayerPokemon, setCpuPokemon]);

  // Handle Player Pokemon Selection
  const handlePlayerSelect = (pokemon) => {
    setSelectedPlayer(pokemon);
    setPlayerPokemon(pokemon.clone());

    // Auto-reroll CPU if player chooses identical Pokemon to guarantee matchup variety
    if (selectedCpu && selectedCpu.name === pokemon.name) {
      const alternatives = roster.filter((p) => p.name !== pokemon.name);
      if (alternatives.length > 0) {
        const nextCpu = alternatives[Math.floor(Math.random() * alternatives.length)];
        setSelectedCpu(nextCpu);
        setCpuPokemon(nextCpu.clone());
      }
    }
  };

  // Randomize Matchup Handler
  const handleRandomize = () => {
    if (roster.length < 2) return;
    if (soundEnabled) SoundEngine.playClick();

    const randomPlayerIndex = Math.floor(Math.random() * roster.length);
    const randomPlayer = roster[randomPlayerIndex];

    const remaining = roster.filter((_, idx) => idx !== randomPlayerIndex);
    const randomCpu = remaining[Math.floor(Math.random() * remaining.length)];

    setSelectedPlayer(randomPlayer);
    setSelectedCpu(randomCpu);
    setPlayerPokemon(randomPlayer.clone());
    setCpuPokemon(randomCpu.clone());
  };

  // Launch Battle
  const handleEnterBattle = () => {
    if (!selectedPlayer || !selectedCpu) return;

    if (soundEnabled) SoundEngine.playStrongHit();
    
    // Store clean cloned instances in context
    setPlayerPokemon(selectedPlayer.clone());
    setCpuPokemon(selectedCpu.clone());

    navigate("/battle");
  };

  // ==========================================================================
  // 1. SLEEK LOADING SKELETON ANIMATION (Phase 11)
  // ==========================================================================
  if (isLoading) {
    return (
      <div className="py-4 sm:py-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-3 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
            Connecting to Battle Registry...
          </div>
          <div className="h-8 w-56 bg-white/10 rounded-lg mx-auto mb-2 animate-pulse" />
          <div className="h-4 w-72 bg-white/5 rounded mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl h-72 sm:h-80 animate-pulse flex flex-col justify-between border-white/5">
              <div className="flex justify-between items-center">
                <div className="h-6 w-28 bg-white/10 rounded-lg" />
                <div className="h-4 w-10 bg-white/10 rounded" />
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full mx-auto my-3" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-3/4 bg-white/10 rounded" />
              </div>
              <div className="h-9 w-full bg-white/10 rounded-xl mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 2. ERROR FALLBACK STATE (Phase 11)
  // ==========================================================================
  if (isError && roster.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 glass-panel rounded-2xl max-w-md mx-auto my-12 border-red-500/30">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="font-bebas text-3xl text-white mb-2">NETWORK SYNC FAILURE</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Unable to establish handshake with Pokémon database.
        </p>
        <button
          onClick={refetch}
          className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bebas text-xl tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
        >
          <RefreshCw className="w-4 h-4" /> RETRY SYNC
        </button>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-6 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-7.5rem)] justify-between pb-24 sm:pb-8">
      
      {/* Page Header */}
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="text-center sm:text-left">
            <h1 className="font-bebas text-3xl sm:text-5xl text-white tracking-wide">
              CHOOSE YOUR <span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">CHAMPION</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Select your fighter. The tactical AI will deploy its challenger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomize}
              className="px-3.5 py-1.5 rounded-xl glass-panel text-zinc-300 hover:text-white hover:border-white/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" /> Randomize
            </button>
          </div>
        </div>

        {/* Character Selection Grid (Phase 17) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {roster.map((pokemon) => {
            const isPlayer = selectedPlayer?.name === pokemon.name;
            const isCpu = selectedCpu?.name === pokemon.name;

            return (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                isSelected={isPlayer}
                isCpuSelected={isCpu}
                onSelect={handlePlayerSelect}
                soundEnabled={soundEnabled}
              />
            );
          })}
        </div>
      </div>

      {/* Matchup Staging Bar (Phase 18) — Sticky & Mobile Optimized */}
      {selectedPlayer && selectedCpu && (
        <div className="fixed sm:sticky bottom-2 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-auto z-40 glass-panel-glow p-3 sm:p-4 rounded-2xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 backdrop-blur-2xl shadow-2xl">
          
          {/* Matchup Preview */}
          <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-6">
            
            {/* Player Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={selectedPlayer.sprite}
                alt={selectedPlayer.name}
                className="w-9 h-9 sm:w-12 sm:h-12 object-contain drop-shadow"
              />
              <div className="text-left">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-red-400 tracking-wider block">YOU</span>
                <h4 className="font-bebas text-lg sm:text-2xl text-white leading-tight">{selectedPlayer.name}</h4>
              </div>
            </div>

            {/* VS Badge */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center font-bebas text-sm sm:text-xl text-red-400 shadow-md shrink-0">
              VS
            </div>

            {/* CPU Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-400 tracking-wider block">CPU</span>
                <h4 className="font-bebas text-lg sm:text-2xl text-white leading-tight">{selectedCpu.name}</h4>
              </div>
              <img
                src={selectedCpu.sprite}
                alt={selectedCpu.name}
                className="w-9 h-9 sm:w-12 sm:h-12 object-contain drop-shadow"
              />
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={handleEnterBattle}
            className="w-full md:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white font-bebas text-xl sm:text-2xl tracking-wider shadow-lg shadow-red-500/30 hover:shadow-red-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Swords className="w-5 h-5 fill-white" />
            <span>START COMBAT</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

    </div>
  );
}
