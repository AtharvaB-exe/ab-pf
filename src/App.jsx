import FluidGlass from "./components/FluidGlass";

export default function App() {
  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none">
      
      {/* 1. Official React Bits WebGL Engine Component Core Stack */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <FluidGlass 
          mode="lens" 
          lensProps={{
            scale: 0.24,
            ior: 1.22,
            thickness: 5.5,
            chromaticAberration: 0.14,
            anisotropy: 0.03  
          }}
        />
      </div>

      {/* 2. Ambient Atmospheric Overlay Vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />

      {/* 3. High-Priority Interactive HTML Overlay Layer */}
      <main className="absolute inset-0 z-20 w-full h-full flex items-end pointer-events-none">
        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full pb-[12vh] md:pb-[15vh]">
          
          {/* Responsive Layout Anchor Space Block */}
          <div className="w-full text-left">
            <button className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:border-white/40 active:scale-95 text-sm font-semibold tracking-wider pointer-events-auto text-white">
              Explore Work
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}