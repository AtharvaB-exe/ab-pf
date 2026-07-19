import FluidGlass from "./components/FluidGlass";

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white selection:bg-white/25 overflow-x-hidden">
      
      {/* 1. Global Background Image Asset */}
      <div
        className="fixed inset-0 bg-cover bg-center transform scale-100 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/bg.png')",
        }}
      />

      {/* 2. 3D WebGL Fluid Glass Engine Overlay Layer */}
      <div className="fixed inset-0 z-10 w-screen h-screen pointer-events-none">
        <FluidGlass 
          mode="lens" 
          lensProps={{
            scale: 0.22,
            ior: 1.25, // Slightly increased for sharper refraction refraction
            thickness: 4,
            chromaticAberration: 0.12,
            anisotropy: 0.02  
          }}
        />
      </div>

      {/* 3. Dark Atmospheric Environmental Vignette Layer */}
      <div className="fixed inset-0 z-20 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* 4. Main HTML Typographic Layout Interface */}
      <main className="relative z-30 min-h-screen flex items-center">
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