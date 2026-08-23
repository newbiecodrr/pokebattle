import { useEffect, useRef } from "react";
import { ScrollText, Flame, Shield, Zap } from "lucide-react";

export default function BattleLog({ logs = [] }) {
  const scrollBottomRef = useRef(null);

  // new event log aane par auto-scroll to bottom
  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Action type badge tags
  const getLogBadge = (log) => {
    if (log.isCrit) {
      return (
        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
          <Flame className="w-2.5 h-2.5" /> CRIT
        </span>
      );
    }
    if (log.action === "defend") {
      return (
        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
          <Shield className="w-2.5 h-2.5" /> GUARD
        </span>
      );
    }
    if (log.action === "charge") {
      return (
        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
          <Zap className="w-2.5 h-2.5" /> CHARGE
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono shrink-0">
        TURN {log.turn}
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col h-56 sm:h-64 border border-white/10">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-zinc-300">
          <ScrollText className="w-4 h-4 text-red-400" />
          <h4 className="font-bebas text-lg tracking-wider text-white">COMBAT FEED</h4>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          {logs.length} Events Logged
        </span>
      </div>

      {/* Feed list container */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 battle-log-scroll text-xs">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 italic text-center">
            Battle initiated. Awaiting first combat action...
          </div>
        ) : (
          logs.map((item, index) => (
            <div
              key={index}
              className={`p-2 rounded-xl flex items-start gap-2.5 transition-all ${
                item.isCrit
                  ? "bg-red-950/30 border border-red-500/30 text-red-200"
                  : item.isPlayer
                  ? "bg-zinc-900/60 border border-white/5 text-zinc-200"
                  : "bg-zinc-900/40 border border-white/5 text-zinc-300"
              }`}
            >
              {getLogBadge(item)}
              <p className="leading-relaxed flex-1">{item.message}</p>
            </div>
          ))
        )}
        <div ref={scrollBottomRef} />
      </div>
    </div>
  );
}
