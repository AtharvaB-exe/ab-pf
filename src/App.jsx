import { useState, useEffect } from "react";
import Prism from "./components/Prism";
import BorderGlow from "./components/BorderGlow";
import ProfileCard from "./components/ProfileCard";

export default function App() {
  const [rawCursor, setRawCursor] = useState({ x: 0, y: 0 });
  const [showProfile, setShowProfile] = useState(false);

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

      {/* 1. WebGL Prism Shader Background Matrix */}
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

      {/* VIEW STATE 1: Clean Typography Main Screen */}
      {!showProfile && (
        <>
          {/* Glass Refraction Cursor Tracker Effect (Works across full website canvas without going black) */}
          <div 
            style={{
              position: 'fixed',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 15,
              top: 0,
              left: 0,
              transform: `translate3d(${rawCursor.x - 90}px, ${rawCursor.y - 90}px, 0)`,
              backdropFilter: 'blur(4px) brightness(1.2) contrast(1.1)',
              boxShadow: '0 0 40px rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.25)'
            }}
          />

          <main style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100%'
          }}>
            <div style={{ width: '100%', textAlign: 'center', color: '#ffffff', padding: '0 16px' }}>
              <p style={{
                color: '#22d3ee',
                textTransform: 'uppercase',
                letterSpacing: '0.5em',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                UI/UX DESIGNER • FRONTEND DEVELOPER
              </p>
              <h1 style={{
                fontSize: '11vw',
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                margin: '0'
              }}>
                ATHARVA
              </h1>
              <h1 style={{
                fontSize: '11vw',
                fontWeight: 900,
                lineHeight: 0.85,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                margin: '0'
              }}>
                BULBULE
              </h1>
            </div>
          </main>

          {/* Centered Enter Profile Button */}
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30
          }}>
            <button
              onClick={() => setShowProfile(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(34, 211, 238, 0.05) 100%)',
                border: '1px solid rgba(34, 211, 238, 0.4)',
                borderRadius: '50px',
                padding: '14px 36px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto'
              }}
            >
              Enter Profile
            </button>
          </div>
        </>
      )}

      {/* VIEW STATE 2: Clean Profile Card State */}
      {showProfile && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          padding: '20px'
        }}>
          <BorderGlow
            edgeSensitivity={40}
            glowColor="190 90% 60%"
            backgroundColor="#0b0813"
            borderRadius={24}
            glowRadius={50}
            glowIntensity={1.2}
            colors={['#22d3ee', '#c084fc', '#f472b6']}
          >
            <div style={{ padding: '8px' }}>
              <ProfileCard
                name="Atharva Bulbule"
                title="UI/UX Designer • Frontend Developer"
                handle="atharvabulbule"
                status="Online"
                contactText="Go Back"
                avatarUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80"
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => setShowProfile(false)}
                behindGlowEnabled={true}
                behindGlowColor="rgba(34, 211, 238, 0.5)"
              />
            </div>
          </BorderGlow>
        </div>
      )}

      {/* Ambient Shading Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent, rgba(0,0,0,0.4))',
        pointerEvents: 'none'
      }} />

    </div>
  );
}