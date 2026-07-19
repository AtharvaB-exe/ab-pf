import { useState, useEffect, useRef } from "react";
import FluidGlass from "./components/FluidGlass";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [buttonTopY, setButtonTopY] = useState(0);
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

  // Compute absolute left layout pad positioning to stay tracked cleanly
  const leftPadding = typeof window !== "undefined" && window.innerWidth > 1024 
    ? "12vw" 
    : "6vw";

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none">
      
      {/* 1. 3D WebGL Fluid Lens Canvas Layer */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <FluidGlass 
          mode="lens" 
          mousePos={mousePos}
          htmlRef={htmlContentRef}
          onParagraphBottom={setButtonTopY}
          lensProps={{
            scale: 0.24,
            ior: 1.25,
            thickness: 5.5,
            chromaticAberration: 0.14,
            anisotropy: 0.03  
          }}
        />
      </div>

      {/* 2. Dark Premium Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />

      {/* 3. HTML Content Layout Sheet Container */}
      <main ref={htmlContentRef} className="absolute inset-0 z-20 min-h-screen">
        
        {/* Absolute coordinate targeting locks the button safely below the text regardless of display scale */}
        {buttonTopY > 0 && (
          <button 
            style={{ 
              position: 'absolute',
              top: `${buttonTopY}px`,
              left: leftPadding
            }}
            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:border-white/40 active:scale-95 text-sm font-semibold tracking-wider text-white pointer-events-auto"
          >
            Explore Work
          </button>
        )}
      </main>

    </div>
  );
}