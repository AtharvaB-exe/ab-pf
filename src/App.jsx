import { useState, useEffect } from "react";
import Prism from "./components/Prism";
import FluidGlass from "./components/FluidGlass";

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
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#050505',
      overflow: 'hidden',
      fontFamily: 'sans-serif',
      cursor: 'none',
      userSelect: 'none'
    }}>
      
      {/* Precision Dynamic Cursor Dot */}
      <div 
        style={{
          position: 'fixed',
          width: '8px',
          height: '8px',
          backgroundColor: '#22d3ee',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 10px #22d3ee',
          top: 0,
          left: 0,
          transform: `translate3d(${rawCursor.x - 4}px, ${rawCursor.y - 4}px, 0)`
        }}
      />
      
      {/* Outer Pointer Tracing Circle */}
      <div 
        style={{
          position: 'fixed',
          width: '32px',
          height: '32px',
          border: '1px solid rgba(34, 211, 238, 0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          top: 0,
          left: 0,
          transform: `translate3d(${rawCursor.x - 16}px, ${rawCursor.y - 16}px, 0)`,
          transition: 'transform 0.08s ease-out'
        }}
      />

      {/* 1. WebGL Prism Shader Background Layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%' }}>
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

      {/* 2. Fluid Glass Canvas Integration Layer (Where your text now lives safely inside) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, width: '100%', height: '100%' }}>
        <FluidGlass 
          mode="lens"
          lensProps={{
            scale: 0.24,
            ior: 1.35,
            thickness: 8,
            chromaticAberration: 0.25,
            anisotropy: 0.05
          }}
        />
      </div>

      {/* Ambient Lighting Vignette Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent, rgba(0,0,0,0.4))',
        pointerEvents: 'none'
      }} />

    </div>
  );
}