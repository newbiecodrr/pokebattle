import { Link } from "react-router-dom";
import BackgroundFX from "@/components/BackgroundFX";

export default function Landing() {
  // Yeh wahi Gen-V wala Pikachu GIF hai jo tumne dhoondha tha
  const pikachuGif =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif";

  return (
    // 1. Main wrapper: Dark theme, flexbox column, full screen height
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 overflow-hidden gap-8">
      {/* 2. Top Tagline */}
      <div
        style={{ letterSpacing: "0.4em" }}
        className="text-sm font-medium text-yellow-500 font-sans uppercase z-10"
      >
        Welcome to the Arena
      </div>

      {/* 3. Central Content Block */}
      <div className="flex flex-col items-center gap-6 z-10">
        {/* Glowing Retro Sprite */}
        <img
          src={pikachuGif}
          alt="Pikachu"
          className="h-40 w-40 object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Massive Arcade Heading */}
        <h1
          className="text-white text-center leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(64px, 10vw, 96px)", // Responsive size
            letterSpacing: "0.05em",
            textShadow: "0 0 40px rgba(234,179,8,0.2)",
          }}
        >
          POKÉBATTLE
        </h1>

        <p className="text-zinc-400 text-center max-w-md text-lg">
          A turn-based battle game. Four fighters. One champion.
        </p>

        {/* 4. The Call-To-Action (CTA) Button */}
        <Link
          to="/select"
          className="mt-4 px-10 py-4 bg-zinc-100 text-zinc-900 font-bold rounded-full hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-300 uppercase tracking-widest text-sm"
        >
          Enter the Roster →
        </Link>
      </div>

      {/* 5. Bottom Tags */}
      <div className="flex flex-wrap gap-3 justify-center z-10 mt-8">
        {["4 POKÉMON", "TURN BASED", "NO MERCY"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-500 tracking-widest"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
