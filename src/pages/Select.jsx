import { usePokemonData } from "@/hooks/usePokemonData";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";

export default function Select() {
  const { roster, isLoading, isError } = usePokemonData();
  const navigate = useNavigate();
  const { setPlayerPokemon, setCpuPokemon } = useGame();

  const handleSelect = (pokemon) => {
    setPlayerPokemon(pokemon);

    const enemies = roster.filter((entry) => entry.name !== pokemon.name);
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];

    setCpuPokemon(randomEnemy);
    navigate("/battle");
  };

  if (isError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full border border-destructive/20 bg-destructive/10 p-4 text-3xl font-bold text-destructive">
          Error
        </div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-100">
          API Connection Severed
        </h2>
        <p className="max-w-sm text-muted-foreground">
          Failed to retrieve live resources from the PokeAPI endpoint. Check
          your internet connection.
        </p>
        <button
          className="rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 text-white transition-colors hover:bg-zinc-700"
          onClick={() => window.location.reload()}
        >
          Retry Handshake
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 py-4">
      <div className="space-y-2 text-center">
        <h1 className="bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-4xl font-black tracking-tighter text-transparent md:text-5xl">
          Choose Your Fighter
        </h1>
        <p className="text-lg text-muted-foreground">
          Select a Pokemon to enter the combat arena.
        </p>
      </div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? [1, 2, 3, 4].map((slot) => (
              <div
                key={slot}
                className="flex h-[380px] flex-col items-center justify-between rounded-2xl border border-border/50 bg-card/20 p-6 backdrop-blur-md animate-pulse"
              >
                <div className="mt-4 h-40 w-40 rounded-full bg-zinc-800"></div>
                <div className="mt-4 h-6 w-28 rounded bg-zinc-800"></div>
                <div className="mt-4 h-10 w-full rounded bg-zinc-800/50"></div>
                <div className="mt-4 h-9 w-full rounded bg-zinc-800"></div>
              </div>
            ))
          : roster.map((pokemon) => (
              <div
                key={pokemon.name}
                className="flex h-full flex-col rounded-2xl border border-border/50 bg-card/40 p-6 text-center shadow-lg shadow-black/20 backdrop-blur-md"
              >
                <div className="mb-6 flex flex-1 flex-col items-center">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="h-40 w-40 object-contain drop-shadow-[0_0_24px_rgba(255,255,255,0.15)]"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <h2 className="mt-4 text-2xl font-black text-zinc-100">
                    {pokemon.name}
                  </h2>
                </div>

                <div className="mb-6 space-y-2 rounded-xl border border-border/40 bg-zinc-950/40 p-4 text-sm text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span>HP</span>
                    <span>{pokemon.maxHp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Energy</span>
                    <span>{pokemon.maxEnergy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Strong Attack</span>
                    <span>{pokemon.sAttack}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weak Attack</span>
                    <span>{pokemon.wAttack}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Defense</span>
                    <span>{pokemon.defense}</span>
                  </div>
                </div>

                <button
                  className="relative z-10 w-full rounded-md bg-zinc-100 px-4 py-2 font-bold tracking-wide text-zinc-900 transition-colors hover:bg-zinc-300"
                  onClick={() => handleSelect(pokemon)}
                >
                  Select {pokemon.name}
                </button>
              </div>
            ))}
      </div>
    </div>
  );
}
