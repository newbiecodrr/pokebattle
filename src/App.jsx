import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="dark">
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-6 p-8 border border-border rounded-xl shadow-2xl bg-card backdrop-blur-md">
          <h1 className="text-3xl font-bold tracking-tight">Pokebattle System Online</h1>
          <p className="text-muted-foreground">Tailwind v4 and Shadcn UI are fully operational.</p>
          <Button variant="default">Initialize Sequence</Button>
        </div>
      </div>
    </div>
  )
}

export default App
