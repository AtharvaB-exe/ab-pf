import React from 'react';

export default function FluidGlass({ mousePos = { x: 0, y: 0 } }) {
  // Convert mouse position coordinates seamlessly into screen percentages
  const leftPos = `${(mousePos.x + 1) * 50}%`;
  const topPos = `${(-mousePos.y + 1) * 50}%`;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 20,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }}>
      {/* High-End Hardware Accelerated Glass Distortion Sphere */}
      <div 
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          left: leftPos,
          top: topPos,
          transform: 'translate(-50%, -50%)',
          
          // Refraction glass effect filters
          backdropFilter: 'blur(8px) contrast(1.15) saturate(1.2) scale(1.05)',
          WebkitBackdropFilter: 'blur(8px) contrast(1.15) saturate(1.2) scale(1.05)',
          
          // Realistic glass shading reflections
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.2) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.2), 0 20px 50px rgba(0,0,0,0.5)',
          
          // Smooth glide easing tracking
          transition: 'left 0.12s cubic-bezier(0.25, 1, 0.5, 1), top 0.12s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Internal lens reflection flare glare */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '50px',
          height: '25px',
          background: 'ellipse',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
          transform: 'rotate(-30deg)',
          borderRadius: '50%'
        }} />
      </div>
    </div>
  );
}