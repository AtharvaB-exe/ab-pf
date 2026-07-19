import FluidGlass from "./components/FluidGlass";

export default function App() {
  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      
      {/* 3D WebGL Fluid Glass Engine base layer */}
      <div className="absolute inset-0 z-0 w-full h-full">
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

      {/* Atmospheric Dark Overlay Vignette Layer */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Interactive HTML UI Layout Overlay Layer */}
      <main className="absolute inset-0 z-20 min-h-screen flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-20">
          
          {/* Invisible spacer keeps layout tracking straight with our 3D text placement */}
          <div className="h-[48vh] mobile:h-[40vh]" />

          <button className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:border-white/40 active:scale-95 text-sm font-semibold tracking-wider pointer-events-auto text-white">
            Explore Work
          </button>

        </div>
      </main>

    </div>
  );
}