import React from 'react';

export default function FluidGlass({ mousePos = { x: 0, y: 0 } }) {
  // Translate coordinate matrix safely into absolute pixels
  const leftPos = `calc(50% + ${mousePos.x * 25}%)`;
  const topPos = `calc(50% - ${mousePos.y * 25}%)`;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none w-full h-full">
      {/* Safe Pure CSS Glass Sphere Mockup Layer */}
      <div 
        className="absolute w-64 h-64 rounded-full border border-white/20 backdrop-blur-md shadow-[inset_0_0_40px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: leftPos,
          top: topPos,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)'
        }}
      />
    </div>
  );
}