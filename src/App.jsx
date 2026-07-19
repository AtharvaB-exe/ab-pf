import { useState, useEffect, useRef } from "react";
import FluidGlass from "./components/FluidGlass";
import BorderGlow from "./components/BorderGlow";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
      
      {/* 3D WebGL Canvas Layer */}
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

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />

      {/* HTML Interface Capture Sheet Overlay */}
      <main ref={htmlContentRef} className="absolute inset-0 z-20 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-20 text-white flex flex-col items-center justify-center">
          
          {/* Spacer maintaining center vertical position scaling constraints */}
          <div className="opacity-0 pointer-events-none text-center">
            <p className="text-cyan-400 uppercase tracking-[0.5em] text-xs font-bold mb-6">
              UI/UX DESIGNER • FRONTEND DEVELOPER
            </p>
            <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase">
              ATHARVA
            </h1>
            <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase mb-8">
              BULBULE
            </h1>
            <p className="max-w-xl text-zinc-200 text-lg md:text-xl font-medium leading-relaxed mx-auto">
              Crafting cinematic digital experiences through design, code, and visual storytelling.
            </p>
          </div>

          {/* Centered Glowing Border Component Wrapper */}
          <div className="mt-14 pointer-events-auto">
            <BorderGlow
              edgeSensitivity={40}
              glowColor="190 90% 60%"
              backgroundColor="#09090b" /* Solid dark background stops the lens double view completely */
              borderRadius={9999}
              glowRadius={25}
              glowIntensity={1.2}
              coneSpread={30}
              animated={true}
              colors={['#22d3ee', '#38bdf8', '#c084fc']}
              className="hover:scale-105 transition-transform duration-300"
            >
              <button 
                onClick={() => console.log("Enter portal action executed.")}
                className="px-8 py-4 bg-transparent text-sm font-semibold tracking-wider text-white cursor-pointer select-none border border-transparent rounded-full focus:outline-none transition-transform active:scale-95"
                style={{ minWidth: '150px', minHeight: '48px' }}
              >
                Enter
              </button>
            </BorderGlow>
          </div>

        </div>
      </main>

    </div>
  );
}