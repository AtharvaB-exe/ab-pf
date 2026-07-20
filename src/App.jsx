import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
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
      
      {/* Outer Tracing Circle */}
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

      {/* Primary WebGL Interactive Stack Frame */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, width: '100%', height: '100%' }}>
        <FluidGlass 
          mode="lens"
          lensProps={{
            scale: 0.22,
            ior: 1.25,
            thickness: 6,
            chromaticAberration: 0.2,
            anisotropy: 0.05
          }}
        >
          {/* 1. Render the Prism Shader inside the portal so the glass material sees it */}
          <Html fullscreen style={{ pointerEvents: 'none', zIndex: 0 }}>
            <div style={{ width: '100vw', height: '100vh', position: 'absolute', inset: 0 }}>
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
          </Html>

          {/* 2. Render typography inside the scene portal layer */}
          <Html fullscreen style={{ pointerEvents: 'none', zIndex: 5 }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              width: '100vw',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '100%',
                textAlign: 'center',
                color: '#ffffff',
                padding: '0 16px',
                boxSizing: 'border-box'
              }}>
                <p style={{
                  color: '#22d3ee',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5em',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '24px'
                }}>
                  UI/UX DESIGNER • FRONTEND DEVELOPER
                </p>
                <h1 style={{
                  fontSize: '11vw',
                  fontWeight: 900,
                  lineHeight: 0.85,
                  letterSpacing: '-0.05em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  margin: '0'
                }}>
                  ATHARVA
                </h1>
                <h1 style={{
                  fontSize: '11vw',
                  fontWeight: 900,
                  lineHeight: 0.85,
                  letterSpacing: '-0.05em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  margin: '0 0 32px 0'
                }}>
                  BULBULE
                </h1>
                <p style={{
                  maxWidth: '560px',
                  color: '#d4d4d8',
                  fontSize: '20px',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  margin: '0 auto'
                }}>
                  Crafting cinematic digital experiences through design, code, and visual storytelling.
                </p>
              </div>
            </div>
          </Html>
        </FluidGlass>
      </div>

      {/* Ambient Vignette Overlay */}
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