import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { usePokemonData } from "@/hooks/usePokemonData";
import StatBar from "@/components/StatBar";
import BattleLog from "@/components/BattleLog";
import DamageNumber from "@/components/DamageNumber";
import GameOverModal from "@/components/GameOverModal";
import { SoundEngine } from "@/utils/audio";
import { Swords, Zap, Shield, BatteryCharging, ArrowLeft, Bot, User, Loader2 } from "lucide-react";

export default function Battle() {
  const navigate = useNavigate();
  const { roster } = usePokemonData();
  const {
    playerPokemon,
    cpuPokemon,
    setPlayerPokemon,
    setCpuPokemon,
    winStreak,
    bestStreak,
    recordWin,
    recordLoss,
    soundEnabled,
  } = useGame();

  // Pokemon battle instance pointers (keeps object references stable during turns)
  const playerRef = useRef(null);
  const cpuRef = useRef(null);

  // HP and stamina bars state
  const [playerHp, setPlayerHp] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(50);
  const [playerDefending, setPlayerDefending] = useState(false);

  const [cpuHp, setCpuHp] = useState(100);
  const [cpuEnergy, setCpuEnergy] = useState(50);
  const [cpuDefending, setCpuDefending] = useState(false);

  const [turn, setTurn] = useState("player");
  const [turnCount, setTurnCount] = useState(1);
  const [totalPlayerDamage, setTotalPlayerDamage] = useState(0);

  const [battleLogs, setBattleLogs] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  // Combat animation flags
  const [playerLunge, setPlayerLunge] = useState(false);
  const [cpuLunge, setCpuLunge] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [cpuHit, setCpuHit] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [playerFaint, setPlayerFaint] = useState(false);
  const [cpuFaint, setCpuFaint] = useState(false);

  // Floating damage number popup data
  const [playerDamageEvent, setPlayerDamageEvent] = useState(null);
  const [cpuDamageEvent, setCpuDamageEvent] = useState(null);

  // Battle reset and setup logic (match start & rematch)
  const initializeBattle = useCallback(() => {
    let p = playerPokemon;
    let c = cpuPokemon;

    // agar user ne direct URL khol li bina roster select kiye toh fallback default load karo
    if (!p && roster.length > 0) {
      p = roster[0].clone();
      setPlayerPokemon(p);
    }
    if (!c && roster.length > 1) {
      c = roster[1].clone();
      setCpuPokemon(c);
    }

    if (p && c) {
      // fresh clones taaki original roster ke stats modify na ho
      const pClone = p.clone();
      const cClone = c.clone();
      pClone.reset();
      cClone.reset();

      playerRef.current = pClone;
      cpuRef.current = cClone;

      setPlayerHp(pClone.currentHp);
      setPlayerEnergy(pClone.energy);
      setPlayerDefending(false);

      setCpuHp(cClone.currentHp);
      setCpuEnergy(cClone.energy);
      setCpuDefending(false);

      setTurn("player");
      setTurnCount(1);
      setTotalPlayerDamage(0);
      setIsGameOver(false);
      setIsWinner(false);
      setPlayerFaint(false);
      setCpuFaint(false);

      setBattleLogs([
        {
          turn: 1,
          isPlayer: true,
          message: `⚔️ Battle started: ${pClone.name} vs ${cClone.name}! Choose your move.`,
        },
      ]);
    }
  }, [playerPokemon, cpuPokemon, roster, setPlayerPokemon, setCpuPokemon]);

  useEffect(() => {
    initializeBattle();
  }, [initializeBattle]);

  // Ref objects se updated HP/Energy React UI states me sync karna
  const syncGameState = () => {
    if (playerRef.current && cpuRef.current) {
      setPlayerHp(playerRef.current.currentHp);
      setPlayerEnergy(playerRef.current.energy);
      setPlayerDefending(playerRef.current.isDefending);

      setCpuHp(cpuRef.current.currentHp);
      setCpuEnergy(cpuRef.current.energy);
      setCpuDefending(cpuRef.current.isDefending);
    }
  };

  // Heavy attack or critical hit pe screen shake trigger
  const triggerScreenShake = (isHeavy = false) => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), isHeavy ? 400 : 250);
  };

  // User action handler (Weak attack, Heavy attack, Guard, Charge)
  const handlePlayerAction = (actionType) => {
    if (turn !== "player" || isGameOver || !playerRef.current || !cpuRef.current) return;

    const player = playerRef.current;
    const cpu = cpuRef.current;
    let result = null;

    if (actionType === "weak") {
      setPlayerLunge(true);
      setTimeout(() => setPlayerLunge(false), 400);

      result = player.weakAttack(cpu);

      if (soundEnabled) SoundEngine.playWeakHit();

      // CPU hit reaction and damage popup
      setCpuHit(true);
      setTimeout(() => setCpuHit(false), 350);

      setCpuDamageEvent({
        value: result.damage,
        isCrit: result.isCrit,
        isBlocked: cpuDefending,
      });
      setTimeout(() => setCpuDamageEvent(null), 1000);

      setTotalPlayerDamage((prev) => prev + result.damage);

      if (result.isCrit) triggerScreenShake(false);
    } else if (actionType === "strong") {
      if (player.energy < player.strongCost) return; // energy nahi hai toh attack cancel

      setPlayerLunge(true);
      setTimeout(() => setPlayerLunge(false), 450);

      result = player.strongAttack(cpu);

      if (soundEnabled) SoundEngine.playStrongHit();

      setCpuHit(true);
      setTimeout(() => setCpuHit(false), 400);

      setCpuDamageEvent({
        value: result.damage,
        isCrit: result.isCrit,
        isBlocked: cpuDefending,
      });
      setTimeout(() => setCpuDamageEvent(null), 1000);

      setTotalPlayerDamage((prev) => prev + result.damage);
      triggerScreenShake(true);
    } else if (actionType === "defend") {
      result = player.defend();
      if (soundEnabled) SoundEngine.playDefend();

      setPlayerDamageEvent({
        isEnergy: true,
        value: result.energyGained,
      });
      setTimeout(() => setPlayerDamageEvent(null), 1000);
    } else if (actionType === "charge") {
      result = player.chargeEnergy();
      if (soundEnabled) SoundEngine.playCharge();

      setPlayerDamageEvent({
        isEnergy: true,
        value: result.energyGained,
      });
      setTimeout(() => setPlayerDamageEvent(null), 1000);
    }

    if (result) {
      syncGameState();

      // Combat feed log me message append karo
      setBattleLogs((prev) => [
        ...prev,
        {
          turn: turnCount,
          isPlayer: true,
          action: result.action,
          isCrit: result.isCrit,
          message: result.message,
        },
      ]);

      // Check karo agar CPU faint ho gaya toh match finish
      if (cpu.isFainted()) {
        setCpuFaint(true);
        setTimeout(() => {
          setIsWinner(true);
          setIsGameOver(true);
          recordWin();
          if (soundEnabled) SoundEngine.playVictory();
        }, 800);
      } else {
        setTurn("cpu"); // pass turn to AI
      }
    }
  };

  // CPU AI turn loop with a natural thinking delay
  useEffect(() => {
    if (turn === "cpu" && !isGameOver && playerRef.current && cpuRef.current) {
      const cpu = cpuRef.current;
      const player = playerRef.current;

      // 1.1s natural pause taaki turn automatic na lage
      const cpuTimer = setTimeout(() => {
        const chosenAction = cpu.getComputerMove(player);
        let result = null;

        if (chosenAction === "weak") {
          setCpuLunge(true);
          setTimeout(() => setCpuLunge(false), 400);

          result = cpu.weakAttack(player);
          if (soundEnabled) SoundEngine.playWeakHit();

          setPlayerHit(true);
          setTimeout(() => setPlayerHit(false), 350);

          setPlayerDamageEvent({
            value: result.damage,
            isCrit: result.isCrit,
            isBlocked: playerDefending,
          });
          setTimeout(() => setPlayerDamageEvent(null), 1000);

          if (result.isCrit) triggerScreenShake(false);
        } else if (chosenAction === "strong") {
          setCpuLunge(true);
          setTimeout(() => setCpuLunge(false), 450);

          result = cpu.strongAttack(player);
          if (soundEnabled) SoundEngine.playStrongHit();

          setPlayerHit(true);
          setTimeout(() => setPlayerHit(false), 400);

          setPlayerDamageEvent({
            value: result.damage,
            isCrit: result.isCrit,
            isBlocked: playerDefending,
          });
          setTimeout(() => setPlayerDamageEvent(null), 1000);

          triggerScreenShake(true);
        } else if (chosenAction === "defend") {
          result = cpu.defend();
          if (soundEnabled) SoundEngine.playDefend();

          setCpuDamageEvent({
            isEnergy: true,
            value: result.energyGained,
          });
          setTimeout(() => setCpuDamageEvent(null), 1000);
        } else if (chosenAction === "charge") {
          result = cpu.chargeEnergy();
          if (soundEnabled) SoundEngine.playCharge();

          setCpuDamageEvent({
            isEnergy: true,
            value: result.energyGained,
          });
          setTimeout(() => setCpuDamageEvent(null), 1000);
        }

        if (result) {
          syncGameState();

          setBattleLogs((prev) => [
            ...prev,
            {
              turn: turnCount,
              isPlayer: false,
              action: result.action,
              isCrit: result.isCrit,
              message: result.message,
            },
          ]);

          // Agar player ki health 0 ho gayi toh defeat modal khol do
          if (player.isFainted()) {
            setPlayerFaint(true);
            setTimeout(() => {
              setIsWinner(false);
              setIsGameOver(true);
              recordLoss();
              if (soundEnabled) SoundEngine.playDefeat();
            }, 800);
          } else {
            setTurn("player");
            setTurnCount((prev) => prev + 1);
          }
        }
      }, 1100);

      return () => clearTimeout(cpuTimer);
    }
  }, [turn, isGameOver, turnCount, soundEnabled, playerDefending, recordLoss, recordWin]);

  // Keyboard number shortcuts (1-4 keys for quick actions)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (turn !== "player" || isGameOver) return;
      if (e.key === "1") handlePlayerAction("weak");
      if (e.key === "2") handlePlayerAction("strong");
      if (e.key === "3") handlePlayerAction("defend");
      if (e.key === "4") handlePlayerAction("charge");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [turn, isGameOver, playerEnergy]);

  if (!playerRef.current || !cpuRef.current) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-3" />
        <p className="font-bebas text-xl text-zinc-300">STAGING ARENA...</p>
      </div>
    );
  }

  const playerObj = playerRef.current;
  const cpuObj = cpuRef.current;
  const canUseStrong = playerEnergy >= playerObj.strongCost && turn === "player" && !isGameOver;

  return (
    <div className={`py-1 sm:py-4 max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-6.5rem)] justify-between ${screenShake ? "animate-shake" : ""}`}>
      
      {/* Arena header: return button + turn status indicator */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 mb-3">
        <button
          onClick={() => navigate("/select")}
          className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl glass-panel text-zinc-300 hover:text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Change </span>Roster
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {turn === "player" ? (
            <div className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 animate-pulse">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span>Your Turn</span>
            </div>
          ) : (
            <div className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 animate-pulse">
              <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" /> CPU Thinking...
            </div>
          )}
        </div>

        <div className="text-[11px] sm:text-xs font-mono text-zinc-400 shrink-0">
          TURN <strong className="text-white text-xs sm:text-sm">{turnCount}</strong>
        </div>
      </div>

      {/* Main combat pods layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 lg:gap-8 my-auto items-center">
        
        {/* Player Side (Left Pod) */}
        <div className="glass-panel p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl relative overflow-hidden border border-white/15 flex flex-col justify-between">
          <div
            className="absolute -top-10 -left-10 w-36 sm:w-48 h-36 sm:h-48 rounded-full blur-3xl opacity-25"
            style={{ backgroundColor: playerObj.accentColor || "#ef4444" }}
          />

          <div className="space-y-2 z-10 mb-2 sm:mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-red-400 tracking-wider">YOU</span>
                <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-tight">
                  {playerObj.name}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {playerObj.types.map((t) => (
                  <span key={t} className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <StatBar
              label="HP"
              current={playerHp}
              max={playerObj.maxHp}
              type="hp"
              isDefending={playerDefending}
            />

            <StatBar
              label="Energy"
              current={playerEnergy}
              max={playerObj.maxEnergy}
              type="energy"
            />
          </div>

          <div className="relative h-28 sm:h-44 flex items-center justify-center">
            <DamageNumber event={playerDamageEvent} />
            <div className="absolute bottom-1 w-28 sm:w-36 h-6 bg-black/50 rounded-full blur-md" />
            <img
              src={playerObj.sprite}
              alt={playerObj.name}
              className={`relative max-h-24 sm:max-h-36 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)] transition-transform ${
                playerLunge ? "animate-lunge-player" : ""
              } ${playerHit ? "animate-hit-player" : ""} ${
                playerFaint ? "animate-faint-player" : "animate-idle-player"
              }`}
            />
          </div>
        </div>

        {/* CPU Side (Right Pod) */}
        <div className="glass-panel p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl relative overflow-hidden border border-white/15 flex flex-col justify-between">
          <div
            className="absolute -top-10 -right-10 w-36 sm:w-48 h-36 sm:h-48 rounded-full blur-3xl opacity-25"
            style={{ backgroundColor: cpuObj.accentColor || "#3b82f6" }}
          />

          <div className="space-y-2 z-10 mb-2 sm:mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-400 tracking-wider">CPU</span>
                <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-tight">
                  {cpuObj.name}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {cpuObj.types.map((t) => (
                  <span key={t} className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <StatBar
              label="HP"
              current={cpuHp}
              max={cpuObj.maxHp}
              type="hp"
              isDefending={cpuDefending}
            />

            <StatBar
              label="Energy"
              current={cpuEnergy}
              max={cpuObj.maxEnergy}
              type="energy"
            />
          </div>

          <div className="relative h-28 sm:h-44 flex items-center justify-center">
            <DamageNumber event={cpuDamageEvent} />
            <div className="absolute bottom-1 w-28 sm:w-36 h-6 bg-black/50 rounded-full blur-md" />
            <img
              src={cpuObj.sprite}
              alt={cpuObj.name}
              className={`relative max-h-24 sm:max-h-36 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)] transition-transform ${
                cpuLunge ? "animate-lunge-cpu" : ""
              } ${cpuHit ? "animate-hit-flash" : ""} ${
                cpuFaint ? "animate-faint" : "animate-idle"
              }`}
            />
          </div>
        </div>

      </div>

      {/* 4 Action Command Buttons + Live Event Battle Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 mt-3 sm:mt-5">
        
        <div className="lg:col-span-7 grid grid-cols-2 gap-2 sm:gap-3">
          
          {/* Move 1: Weak Strike */}
          <button
            type="button"
            disabled={turn !== "player" || isGameOver}
            onClick={() => handlePlayerAction("weak")}
            aria-label={`Execute Weak Attack: ${playerObj.moves.weak}`}
            className="glass-card-interactive p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border-white/10 hover:border-red-500/50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-red-500/20 text-red-400 flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold">
                1
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-semibold">+5 EN</span>
            </div>
            <div>
              <h4 className="font-bebas text-lg sm:text-2xl text-white tracking-wide group-hover:text-red-400 transition-colors leading-tight">
                {playerObj.moves.weak}
              </h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 line-clamp-1">Quick strike.</p>
            </div>
          </button>

          {/* Move 2: Heavy Blast */}
          <button
            type="button"
            disabled={!canUseStrong}
            onClick={() => handlePlayerAction("strong")}
            aria-label={`Execute Strong Attack: ${playerObj.moves.strong} - Costs ${playerObj.strongCost} Energy`}
            className={`glass-card-interactive p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border-white/10 disabled:opacity-35 disabled:pointer-events-none cursor-pointer group flex flex-col justify-between ${
              canUseStrong
                ? "hover:border-amber-500/50 hover:bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold">
                2
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-amber-400 font-semibold">
                -{playerObj.strongCost} EN
              </span>
            </div>
            <div>
              <h4 className="font-bebas text-lg sm:text-2xl text-white tracking-wide group-hover:text-amber-300 transition-colors leading-tight">
                {playerObj.moves.strong}
              </h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 line-clamp-1">Heavy special blast.</p>
            </div>
          </button>

          {/* Move 3: Defensive Guard */}
          <button
            type="button"
            disabled={turn !== "player" || isGameOver}
            onClick={() => handlePlayerAction("defend")}
            aria-label="Enter Defensive Stance"
            className="glass-card-interactive p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border-white/10 hover:border-blue-500/50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold">
                3
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400 font-semibold">+12 EN</span>
            </div>
            <div>
              <h4 className="font-bebas text-lg sm:text-2xl text-white tracking-wide group-hover:text-blue-400 transition-colors flex items-center gap-1 leading-tight">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> GUARD
              </h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 line-clamp-1">50% DMG cut.</p>
            </div>
          </button>

          {/* Move 4: Energy Charge */}
          <button
            type="button"
            disabled={turn !== "player" || isGameOver}
            onClick={() => handlePlayerAction("charge")}
            aria-label="Charge Stamina Energy"
            className="glass-card-interactive p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border-white/10 hover:border-cyan-500/50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold">
                4
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400 font-semibold">+25 EN</span>
            </div>
            <div>
              <h4 className="font-bebas text-lg sm:text-2xl text-white tracking-wide group-hover:text-cyan-400 transition-colors flex items-center gap-1 leading-tight">
                <BatteryCharging className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> CHARGE
              </h4>
              <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 line-clamp-1">Restore stamina.</p>
            </div>
          </button>

        </div>

        <div className="lg:col-span-5">
          <BattleLog logs={battleLogs} />
        </div>

      </div>

      {isGameOver && (
        <GameOverModal
          isWinner={isWinner}
          playerPokemon={playerObj}
          cpuPokemon={cpuObj}
          turns={turnCount}
          totalDamageDealt={totalPlayerDamage}
          winStreak={winStreak}
          bestStreak={bestStreak}
          onRematch={initializeBattle}
          soundEnabled={soundEnabled}
        />
      )}

    </div>
  );
}
