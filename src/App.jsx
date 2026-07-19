import { useEffect, useRef } from "react";

// Self-contained custom liquid glass pointer engine
function FluidBlobCursor() {
  const blobRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    
    let velX = 0;
    let velY = 0;
    
    const friction = 0.92; 
    const acceleration = 0.03; 
    let time = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateFluidPhysics = () => {
      time += 0.015;

      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      velX += dx * acceleration;
      velY += dy * acceleration;
      
      velX *= friction;
      velY *= friction;

      currentX += velX;
      currentY += velY;

      const speed = Math.sqrt(velX * velX + velY * velY);
      const stretch = Math.min(speed * 0.008, 0.35);
      
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.4;
      
      let angle = 0;
      if (speed > 0.1) {
        angle = Math.atan2(velY, velX) * (180 / Math.PI);
      }

      const r1 = 47 + Math.sin(time) * 3;
      const r2 = 53 + Math.cos(time + 1) * 3;
      const r3 = 52 + Math.sin(time + 2) * 3;
      const r4 = 48 + Math.cos(time + 3) * 3;

      if (blobRef.current) {
        blobRef.current.style.borderRadius = `${r1}% ${100-r1}% ${r2}% ${100-r2}% / ${r3}% ${r4}% ${100-r4}% ${100-r3}%`;
        blobRef.current.style.transform = `
          translate3d(${currentX}px, ${currentY}px, 0)
          translate(-50%, -50%)
          rotate(${angle}deg)
          scale(${scaleX}, ${scaleY})
        `;
      }

      requestAnimationFrame(updateFluidPhysics);
    };

    const animFrame = requestAnimationFrame(updateFluidPhysics);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div className="fluid-cursor-system">
      <div ref={blobRef} className="ios-glass-droplet" />
    </div>
  );
}

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white selection:bg-white/25 overflow-x-hidden">
      
      {/* 1. Integrated Fluid Glass Pointer */}
      <FluidBlobCursor />

      {/* 2. Background Asset Layer */}
      <div
        className="fixed inset-0 bg-cover bg-center transform scale-100 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/bg.png')",
        }}
      />

      {/* 3. Dark Atmospheric Environmental Overlay */}
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* 4. Typographic Workspace Interface Layout */}
      <main className="relative z-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-20">
          
          <p className="text-cyan-400 uppercase tracking-[0.5em] text-xs font-bold mb-6 drop-shadow-sm">
            UI/UX DESIGNER • FRONTEND DEVELOPER
          </p>

          <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase select-none opacity-95 text-white">
            ATHARVA
          </h1>
          
          <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase select-none opacity-95 text-white mb-8">
            BULBULE
          </h1>

          <p className="max-w-xl text-zinc-200 text-lg md:text-xl font-medium leading-relaxed drop-shadow-md">
            Crafting cinematic digital experiences through design, code, and visual storytelling.
          </p>

          <button className="mt-10 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:border-white/40 active:scale-95 text-sm font-semibold tracking-wider pointer-events-auto">
            Explore Work
          </button>

        </div>
      </main>

    </div>
  );
}