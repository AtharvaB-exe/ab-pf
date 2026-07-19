import { useState, useEffect, useRef } from "react";
import FluidGlass from "./components/FluidGlass";
import BorderGlow from "./components/BorderGlow";
import ProfileCard from "./components/ProfileCard";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isEntered, setIsEntered] = useState(false);
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
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none font-sans">
      
      {/* 1. Underlying Base Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none z-0 opacity-40 mix-blend-screen"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* 2. Ambient Lighting Vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />

      {/* 3. 3D WebGL Fluid Lens Canvas Layer (Moved underneath the interactive content) */}
      {!isEntered && (
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">
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
      )}

      {/* 4. HTML Layer (Brought to z-30 so it captures clicks perfectly) */}
      <main ref={htmlContentRef} className="absolute inset-0 z-30 min-h-screen flex items-center justify-center transition-all duration-700">
        
        {!isEntered ? (
          /* ================= GATEWAY GATE ENTRY STAGE ================= */
          <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-20 text-white flex flex-col items-center justify-center animate-fade-in">
            
            {/* Mirror spacers mapping matching bounds exactly - explicitly ignoring pointers */}
            <div className="opacity-0 pointer-events-none text-center select-none">
              <p className="text-cyan-400 uppercase tracking-[0.5em] text-xs font-bold mb-6">
                UI/UX DESIGNER • FRONTEND DEVELOPER
              </p>
              <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase">ATHARVA</h1>
              <h1 className="text-[11vw] font-black leading-[0.85] tracking-tighter uppercase mb-8">BULBULE</h1>
              <p className="max-w-xl text-zinc-200 text-lg md:text-xl font-medium leading-relaxed mx-auto">
                Crafting cinematic digital experiences through design, code, and visual storytelling.
              </p>
            </div>

            {/* Glowing Custom Enter Trigger Box - Forces pointer events on to override parent blocking */}
            <div className="mt-14 pointer-events-auto relative z-50">
              <BorderGlow
                edgeSensitivity={40}
                glowColor="190 90% 60%"
                backgroundColor="#09090b"
                borderRadius={9999}
                glowRadius={25}
                glowIntensity={1.2}
                coneSpread={30}
                animated={true}
                colors={['#22d3ee', '#38bdf8', '#c084fc']}
                className="hover:scale-105 transition-transform duration-300"
              >
                <button 
                  onClick={() => setIsEntered(true)}
                  className="px-10 py-4 bg-transparent text-sm font-semibold tracking-wider text-white cursor-pointer select-none border border-transparent rounded-full focus:outline-none"
                  style={{ minWidth: '150px', minHeight: '48px' }}
                >
                  Enter
                </button>
              </BorderGlow>
            </div>
          </div>
        ) : (
          /* ================= MAIN PROFILE CARD STAGE ================= */
          <div className="w-full h-full flex items-center justify-center p-6 animate-slide-up pointer-events-auto select-text">
            <ProfileCard
              name="Atharva Bulbule"
              title="UI/UX Designer & Frontend Developer"
              handle="atharvabulbule"
              status="Available for Projects"
              contactText="Get In Touch"
              avatarUrl="/bg.png" 
              miniAvatarUrl="/bg.png"
              enableTilt={true}
              behindGlowEnabled={true}
              behindGlowColor="rgba(34, 211, 238, 0.4)"
              innerGradient="linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(88, 28, 135, 0.2) 100%)"
              onContactClick={() => window.location.href = "mailto:your-email@example.com"}
            />
          </div>
        )}

      </main>

      {/* Basic Keyframe Transitions Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

    </div>
  );
}