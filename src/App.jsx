import { useState, useEffect, useRef } from "react";
import FluidGlass from "./components/FluidGlass";
import BorderGlow from "./components/BorderGlow";
import ProfileCard from "./components/ProfileCard";
import Lanyard from "./components/Lanyard";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rawCursor, setRawCursor] = useState({ x: 0, y: 0 });
  const [isEntered, setIsEntered] = useState(false);
  const htmlContentRef = useRef(null);

  useEffect(() => {
    if (isEntered) return;
    const handleGlobalMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
      setRawCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [isEntered]);

  useEffect(() => {
    if (!isEntered) return;
    const handleCardMouseMove = (e) => {
      setRawCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleCardMouseMove);
    return () => window.removeEventListener("mousemove", handleCardMouseMove);
  }, [isEntered]);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden font-sans cursor-none">
      
      {/* Precision Dynamic Cursor Dot */}
      <div 
        className="fixed w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-50 shadow-[0_0_10px_#22d3ee] -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
        style={{ left: `${rawCursor.x}px`, top: `${rawCursor.y}px` }}
      />
      <div 
        className="fixed w-8 h-8 border border-white/20 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{ left: `${rawCursor.x}px`, top: `${rawCursor.y}px` }}
      />

      {/* Base Background Texture */}
      <div className="absolute inset-0 bg-cover bg-center pointer-events-none z-0 opacity-40 mix-blend-screen" style={{ backgroundImage: "url('/bg.png')" }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />

      {/* 3D Fluid Lens Shader */}
      {!isEntered && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <FluidGlass mode="lens" mousePos={mousePos} htmlRef={htmlContentRef} lensProps={{ scale: 0.24, ior: 1.25, thickness: 5.5, chromaticAberration: 0.14, anisotropy: 0.03 }} />
        </div>
      )}

      {/* HTML Layout Layer */}
      <main ref={htmlContentRef} className="absolute inset-0 z-30 min-h-screen flex items-center justify-center transition-all duration-700">
        
        {!isEntered ? (
          /* ================= GATEWAY ENTRY STAGE ================= */
          <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-20 text-white flex flex-col items-center justify-center animate-fade-in">
            
            {/* Visible Layout Typography Blocks to reserve space */}
            <div className="text-center select-none pointer-events-none">
              <p className="text-cyan-400 uppercase tracking-[0.5em] text-xs font-bold mb-6">
                UI/UX DESIGNER • FRONTEND DEVELOPER
              </p>
              <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase">ATHARVA</h1>
              <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase mb-8">BULBULE</h1>
              <p className="max-w-xl text-zinc-200 text-lg md:text-xl font-medium leading-relaxed mx-auto">
                Crafting cinematic digital experiences through design, code, and visual storytelling.
              </p>
            </div>

            {/* Glowing Enter Trigger Button */}
            <div className="mt-14 pointer-events-auto relative z-50">
              <BorderGlow 
                edgeSensitivity={20} 
                glowColor="190 90% 60%" 
                backgroundColor="#0a0a0c" 
                borderRadius={9999} 
                glowRadius={30} 
                glowIntensity={1.5} 
                coneSpread={45} 
                animated={true} 
                colors={['#22d3ee', '#38bdf8', '#c084fc']} 
                className="hover:scale-105 transition-transform duration-300 cursor-none"
              >
                <button 
                  onClick={() => setIsEntered(true)} 
                  className="px-12 py-5 bg-transparent text-sm font-bold tracking-widest text-white select-none border border-transparent rounded-full focus:outline-none cursor-none uppercase"
                  style={{ minWidth: '160px', minHeight: '52px' }}
                >
                  Enter Portfolio
                </button>
              </BorderGlow>
            </div>
          </div>
        ) : (
          /* ================= MAIN PROFILE STAGE ================= */
          <div className="relative w-full h-full flex items-center justify-center p-6 animate-slide-up pointer-events-auto">
            
            {/* Top Right Mini Interactive Lanyard Module */}
            <div className="absolute top-4 right-4 w-[160px] h-[200px] sm:w-[220px] sm:h-[260px] z-40 bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-cyan-400/40">
              <div className="absolute top-2 left-3 pointer-events-none z-10">
                <p className="text-[8px] font-bold tracking-widest text-cyan-400 uppercase">Interactive ID</p>
                <p className="text-[11px] font-black text-white/95 leading-tight">Atharva B.</p>
              </div>
              <Lanyard 
                position={[0, 0, 13]} 
                gravity={[0, -35, 0]} 
                frontImage="/avatar.png" 
                backImage="/avatar.png" 
                imageFit="cover" 
                lanyardWidth={1.3} 
              />
            </div>

            {/* Centered Profile Card */}
            <ProfileCard
              name="Atharva Bulbule"
              title="UI/UX Designer & Frontend Developer"
              handle="atharvabulbule"
              status="Available for Projects"
              contactText="Get In Touch"
              avatarUrl="/avatar.png" 
              miniAvatarUrl="/avatar.png" 
              enableTilt={true}
              behindGlowEnabled={true}
              behindGlowColor="rgba(34, 211, 238, 0.4)"
              innerGradient="linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(88, 28, 135, 0.2) 100%)"
              onContactClick={() => window.location.href = "mailto:atharvabulbule@example.com"}
            />
          </div>
        )}

      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}