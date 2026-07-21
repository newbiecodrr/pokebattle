import { Link } from "react-router-dom"
import { Button } from "@/components/button"

export function Navbar() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand Link */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
            Pokebattle
          </span>
        </Link>
        
        {/* Navigation Items */}
        <nav className="flex items-center gap-4">
          <Link to="/select">
            <Button variant="ghost">Arena</Button>
          </Link>
          <Link to="/select">
            <Button variant="ghost">Pokedex</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
