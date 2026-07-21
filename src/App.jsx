import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Select from "@/pages/Select";
import Battle from "@/pages/Battle";

// 1. Import the Provider you just built
import { GameProvider } from "@/context/GameContext";

const RootLayout = () => {
  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
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

function App() {
  return (
    // 2. Wrap the RouterProvider inside the GameProvider
    <GameProvider>
      <RouterProvider router={router} />
    </GameProvider>
  );
}

export default App;
