import React from 'react';

export default function FluidGlass({ mousePos = { x: 0, y: 0 } }) {
  // Translate tracking coordinates smoothly to screen alignment values
  const screenX = `${(mousePos.x + 1) * 50}%`;
  const screenY = `${(-mousePos.y + 1) * 50}%`;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 20,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }}>
      {/* Dynamic 3D Physical Glass Distortion Shield */}
      <div 
        style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          left: screenX,
          top: screenY,
          transform: 'translate(-50%, -50%)',
          
          // Magnification and refraction filters
          backdropFilter: 'blur(4px) contrast(1.2) saturate(1.25) scale(1.06)',
          WebkitBackdropFilter: 'blur(4px) contrast(1.2) saturate(1.25) scale(1.06)',
          
          // Chromatic lighting highlights and shadow bounds
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 45%, rgba(0,0,0,0.3) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: 'inset 0 0 25px rgba(255,255,255,0.15), 0 25px 50px rgba(0,0,0,0.6)',
          
          // Easing math to match custom tracking rings
          transition: 'left 0.1s cubic-bezier(0.25, 1, 0.5, 1), top 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Synthetic specular reflection glare flare */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '12%',
          width: '45px',
          height: '20px',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 75%)',
          transform: 'rotate(-28deg)',
          borderRadius: '50%'
        }} />
      </div>
    </div>
  );
}