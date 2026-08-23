import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import BackgroundFX from "@/components/BackgroundFX";
import Landing from "@/pages/Landing";
import Select from "@/pages/Select";
import Battle from "@/pages/Battle";
import { GameProvider } from "@/context/GameContext";

/**
 * ============================================================================
 * ROOT APP & ROUTING ARCHITECTURE (Phase 06 & 07)
 * ============================================================================
 * Concepts:
 * - Client-Side Routing via React Router v6 createBrowserRouter
 * - Global Context Provider wrapper (<GameProvider>)
 * - Persistent Canvas Background Layer (<BackgroundFX>)
 */

const RootLayout = () => {
  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-red-500/30 flex flex-col relative">
      {/* 60fps Kinetic Particle & Lightning Canvas Background */}
      <BackgroundFX />

      {/* Sticky Global Glassmorphic Header */}
      <Navbar />

      {/* Main Page Outlet with Responsive Container Padding */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 z-10 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/select", element: <Select /> },
      { path: "/battle", element: <Battle /> },
    ],
  },
]);

export default function App() {
  return (
    <GameProvider>
      <RouterProvider router={router} />
    </GameProvider>
  );
}
