import { useEffect, useRef } from "react";

export default function BackgroundFX() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Full screen canvas size set karna
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Particle object ka array banayenge
    const particles = [];
    const particleCount = 100; // Screen par kitne dots dikhenge

    // 1. Initial Setup: Random positions aur speed ke sath particles banana
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 0.5, // Size
        vx: (Math.random() - 0.5) * 0.5, // X speed
        vy: (Math.random() - 0.5) * 0.5, // Y speed
      });
    }

    // 2. The Render Loop: Yeh function 60 baar per second run hota hai
    const render = () => {
      // Har frame se pehle purani drawing ko clear karna zaroori hai (nahi toh lambi line ban jayegi)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Particle ki nayi position update karo
        p.x += p.vx;
        p.y += p.vy;

        // Agar particle screen ke bahar chala jaye, toh usko wapas screen ke andar bhej do (Wrap around)
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Particle ko draw karo (White glowing circle)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      });

      // Agle frame ke liye browser ko wapas is function ko call karne bolo
      animationFrameId = requestAnimationFrame(render);
    };

    // Loop start karo
    render();

    // Cleanup: Agar hum page change karein, toh background loop band ho jana chahiye
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  // pointer-events-none isliye taaki hum canvas ke piche buttons ko click kar sakein
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
