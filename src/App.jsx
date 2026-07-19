import { useState, useEffect, useRef } from "react";
import FluidGlass from "./components/FluidGlass";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Creates an architectural handle anchor linking the HTML layout straight into the WebGL scene
  const htmlContentRef = useRef(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none">
      
      {/* 3D WebGL Fluid Lens Background Container Pass */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <FluidGlass 
          mode="lens" 
          mousePos={mousePos}
          htmlRef={htmlContentRef}
          lensProps={{
            scale: 0.24,
            ior: 1.25,
            thickness: 5.5,
            chromaticAberration: 0.14,
            anisotropy: 0.03  
          }}
        />
      </div>

      {/* Atmospheric Dark Overlay Vignette Layer */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />

      {/* Interactive Crisp Frontend HTML Typography Layout */}
      <main ref={htmlContentRef} className="absolute inset-0 z-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-20 text-white">
          
          <p className="text-cyan-400 uppercase tracking-[0.5em] text-xs font-bold mb-6 drop-shadow-sm">
            UI/UX DESIGNER • FRONTEND DEVELOPER
          </p>

          <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase opacity-95">
            ATHARVA
          </h1>
          
          <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase opacity-95 mb-8">
            BULBULE
          </h1>

          <p className="max-w-xl text-zinc-200 text-lg md:text-xl font-medium leading-relaxed drop-shadow-md">
            Crafting cinematic digital experiences through design, code, and visual storytelling.
          </p>

          <button className="mt-10 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:border-white/40 active:scale-95 text-sm font-semibold tracking-wider text-white pointer-events-auto">
            Explore Work
          </button>

        </div>
      </main>

    </div>
  );
}