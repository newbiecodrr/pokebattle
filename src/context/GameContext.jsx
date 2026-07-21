import { createContext, useContext, useState } from "react";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Ye app ka global memory cloud hai.
  // Jo Pokemon player aur CPU ne select kiya, usko yahan store karenge
  // taaki route change hone ke baad bhi data safe rahe.
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [cpuPokemon, setCpuPokemon] = useState(null);

  return (
    <GameContext.Provider
      value={{
        playerPokemon,
        setPlayerPokemon,
        cpuPokemon,
        setCpuPokemon,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside a GameProvider");
  }

  return context;
}
