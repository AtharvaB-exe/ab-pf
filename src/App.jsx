import { useState, useEffect } from "react";
import Prism from "./components/Prism";

export default function App() {
  const [rawCursor, setRawCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setRawCursor({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden font-sans cursor-none select-none">
      
      {/* Precision Dynamic Cursor Dot */}
      <div 
        className="fixed w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-50 shadow-[0_0_10px_#22d3ee] -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
        style={{ left: `${rawCursor.x}px`, top: `${rawCursor.y}px` }}
      />
      <div 
        className="fixed w-8 h-8 border border-white/20 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{ left: `${rawCursor.x}px`, top: `${rawCursor.y}px` }}
      />

      {/* New WebGL Generative Prism Shader Canvas Background */}
      <div className="absolute inset-0 z-0 w-full h-full position-relative">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
        />
      </div>

      {/* Ambient Lighting Vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />

      {/* Permanent Centered Layout Canvas Frame */}
      <main className="absolute inset-0 z-30 min-h-screen flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center text-center text-white px-4 md:px-16 animate-fade-in">
          
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-cyan-400 uppercase tracking-[0.5em] text-xs md:text-sm font-bold mb-6">
              UI/UX DESIGNER • FRONTEND DEVELOPER
            </p>
            <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase text-white select-none">
              ATHARVA
            </h1>
            <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase text-white mb-8 select-none">
              BULBULE
            </h1>
            <p className="max-w-xl text-zinc-200 text-lg md:text-xl font-medium leading-relaxed mx-auto select-none">
              Crafting cinematic digital experiences through design, code, and visual storytelling.
            </p>
          </div>

        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>

    </div>
  );
}