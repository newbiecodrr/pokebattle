import { useEffect, useRef } from "react";

// Canvas background: 60fps ambient embers + procedural lightning flashes
export default function BackgroundFX() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Window resize handle karna
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Particle system (floating embers)
    const particleCount = Math.min(70, Math.floor(window.innerWidth / 20));
    const particles = [];

    const particleColors = [
      "rgba(239, 68, 68, 0.75)",
      "rgba(249, 115, 22, 0.75)",
      "rgba(59, 130, 246, 0.75)",
      "rgba(168, 85, 247, 0.75)",
      "rgba(250, 204, 21, 0.75)",
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.2, // halka upward drift
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Procedural lightning parameters
    let lightningTimer = 0;
    let nextLightningTarget = 180 + Math.random() * 240;
    let activeLightningBolts = [];
    let flashIntensity = 0;

    // Recursive lightning bolt generator
    const createLightningBolt = (startX, startY, endX, endY, branches = 3, depth = 0) => {
      const segments = [];
      let currentX = startX;
      let currentY = startY;
      const totalSteps = 12 + Math.floor(Math.random() * 8);

      for (let i = 0; i < totalSteps; i++) {
        const progress = (i + 1) / totalSteps;
        const targetX = startX + (endX - startX) * progress;
        const targetY = startY + (endY - startY) * progress;
        const displacement = (Math.random() - 0.5) * 45;
        const nextX = targetX + displacement;
        const nextY = targetY + (Math.random() - 0.5) * 20;

        segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });

        // random branches split
        if (branches > 0 && depth < 2 && Math.random() < 0.25 && i > 3 && i < totalSteps - 2) {
          const branchAngle = (Math.random() - 0.5) * 1.2;
          const branchLen = 80 + Math.random() * 100;
          const branchEndX = nextX + Math.cos(branchAngle) * branchLen;
          const branchEndY = nextY + Math.sin(branchAngle) * branchLen;
          
          createLightningBolt(nextX, nextY, branchEndX, branchEndY, branches - 1, depth + 1);
        }

        currentX = nextX;
        currentY = nextY;
      }

      activeLightningBolts.push({
        segments,
        alpha: 1.0,
        decay: 0.04 + Math.random() * 0.03,
        color: Math.random() < 0.5 ? "#60a5fa" : "#fef08a",
      });
    };

    // 60fps render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (flashIntensity > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity * 0.15})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashIntensity -= 0.05;
      }

      // Draw embers
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // screen boundary wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const currentRadius = p.radius + Math.sin(p.pulse) * 0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Lightning timer check
      lightningTimer++;
      if (lightningTimer >= nextLightningTarget) {
        lightningTimer = 0;
        nextLightningTarget = 200 + Math.random() * 300;
        const startX = Math.random() * canvas.width;
        const endX = startX + (Math.random() - 0.5) * 400;
        const endY = canvas.height * (0.6 + Math.random() * 0.35);

        createLightningBolt(startX, 0, endX, endY);
        flashIntensity = 1.0;
      }

      // Draw active lightning bolts
      for (let b = activeLightningBolts.length - 1; b >= 0; b--) {
        const bolt = activeLightningBolts[b];
        ctx.save();
        ctx.strokeStyle = bolt.color;
        ctx.globalAlpha = bolt.alpha;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 18;
        ctx.shadowColor = bolt.color;

        ctx.beginPath();
        bolt.segments.forEach((seg) => {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();
        ctx.restore();

        bolt.alpha -= bolt.decay;
        if (bolt.alpha <= 0) {
          activeLightningBolts.splice(b, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 crt-scanlines opacity-40 mix-blend-overlay" />
      <div className="absolute inset-0 crt-vignette opacity-70" />
      <div className="absolute inset-0 bg-radial from-transparent via-background/40 to-background/90" />
    </div>
  );
}
