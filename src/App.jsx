import { useEffect, useState } from "react";
import FluidGlass from "./components/FluidGlass";

export default function App() {
  return (
    <div className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none">
      
      {/* 1. Official React Bits WebGL Engine Background Container */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <FluidGlass 
          mode="lens" 
          lensProps={{
            scale: 0.25,
            ior: 1.15,
            thickness: 5,
            chromaticAberration: 0.1,
            anisotropy: 0.01  
          }}
        />
      </div>

      {/* 2. Dark Premium Vignette Shadow Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

      {/* 3. True Interactive HTML Typography Interface Layer */}
      <main className="absolute inset-0 z-20 w-full h-full flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-20">
          
          <p className="text-cyan-400 uppercase tracking-[0.5em] text-xs font-bold mb-6 drop-shadow-sm">
            UI/UX DESIGNER • FRONTEND DEVELOPER
          </p>

          <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase opacity-95 text-white">
            ATHARVA
          </h1>
          
          <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase opacity-95 text-white mb-8">
            BULBULE
          </h1>

          <p className="max-w-xl text-zinc-200 text-lg md:text-xl font-medium leading-relaxed drop-shadow-md">
            Crafting cinematic digital experiences through design, code, and visual storytelling.
          </p>

          <button className="mt-10 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:border-white/40 active:scale-95 text-sm font-semibold tracking-wider pointer-events-auto text-white">
            Explore Work
          </button>

        </div>
      </main>

    </div>
  );
}