import FluidBlobCursor from "./components/FluidBlobCursor";

export default function App() {
  return (
    <>
      <FluidBlobCursor />

      <main className="min-h-screen text-white overflow-hidden relative selection:bg-white/20">
        
        <div
          className="fixed inset-0 bg-cover bg-center transform scale-105 pointer-events-none"
          style={{
            backgroundImage: "url('/bg.png')",
          }}
        />

        <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />

        <section className="relative h-screen flex items-center z-10">
          <div className="max-w-7xl mx-auto px-8 md:px-16 w-full">
            
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

            <button className="mt-10 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:border-white/40 active:scale-95 text-sm font-semibold tracking-wider">
              Explore Work
            </button>

          </div>
        </section>

      </main>
    </>
  );
}