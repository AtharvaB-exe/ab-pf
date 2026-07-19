import FluidGlass from "./components/FluidGlass";

export default function App() {
  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      
      <FluidGlass 
        mode="lens" 
        lensProps={{
          scale: 0.25,
          ior: 1.18,
          thickness: 6,
          chromaticAberration: 0.15,
          anisotropy: 0.02  
        }}
      >
        {/* Everything inside here is now piped into the 3D pipeline for true glass refraction */}
        <div className="relative w-full h-full min-h-screen">
          
          {/* Background Image inside the buffer */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-100 pointer-events-none"
            style={{
              backgroundImage: "url('/bg.png')",
            }}
          />

          {/* Dark atmospheric gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

          {/* Premium UI Content */}
          <main className="relative w-full h-full min-h-screen flex items-center z-10">
            <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-20 text-white">
              
              <p className="text-cyan-400 uppercase tracking-[0.5em] text-xs font-bold mb-6 drop-shadow-sm">
                UI/UX DESIGNER • FRONTEND DEVELOPER
              </p>

              <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase select-none opacity-95">
                ATHARVA
              </h1>
              
              <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase select-none opacity-95 mb-8">
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
      </FluidGlass>

    </div>
  );
}