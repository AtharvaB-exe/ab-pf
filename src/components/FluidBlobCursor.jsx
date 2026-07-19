import { useEffect, useRef } from "react";

export default function FluidBlobCursor() {
  const blobRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    
    let velX = 0;
    let velY = 0;
    
    // Smooth cinematic inertia physics constants
    const friction = 0.90; 
    const acceleration = 0.04; 
    let time = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateFluidPhysics = () => {
      time += 0.02;

      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      velX += dx * acceleration;
      velY += dy * acceleration;
      
      velX *= friction;
      velY *= friction;

      currentX += velX;
      currentY += velY;

      const speed = Math.sqrt(velX * velX + velY * velY);
      // Delicate fluid stretching limits
      const stretch = Math.min(speed * 0.007, 0.3);
      
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.4;
      
      let angle = 0;
      if (speed > 0.1) {
        angle = Math.atan2(velY, velX) * (180 / Math.PI);
      }

      // Organic shape shifting coordinates
      const r1 = 46 + Math.sin(time) * 4;
      const r2 = 54 + Math.cos(time + 1) * 4;
      const r3 = 53 + Math.sin(time + 2) * 4;
      const r4 = 47 + Math.cos(time + 3) * 4;

      if (blobRef.current) {
        blobRef.current.style.borderRadius = `${r1}% ${100-r1}% ${r2}% ${100-r2}% / ${r3}% ${r4}% ${100-r4}% ${100-r3}%`;
        blobRef.current.style.transform = `
          translate3d(${currentX}px, ${currentY}px, 0)
          translate(-50%, -50%)
          rotate(${angle}deg)
          scale(${scaleX}, ${scaleY})
        `;
      }

      requestAnimationFrame(updateFluidPhysics);
    };

    const animFrame = requestAnimationFrame(updateFluidPhysics);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      {/* Dynamic SVG Distortion Engine: This literally warps the text and pixels under the cursor */}
      <svg className="absolute w-0 h-0 pointer-events-none hidden-engine-filters">
        <defs>
          <filter id="physical-glass-warp" x="-20%" y="-20%" width="140%" height="140%">
            {/* Step 1: Generate custom refraction vector maps */}
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            
            {/* Step 2: Physically bend underlying graphic coordinates based on noise map */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            
            {/* Step 3: Layer the blurred frosted glass profile directly back over the distortion */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="displaced" />
              <feMergeNode in="blur" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="fluid-cursor-system">
        <div ref={blobRef} className="ios-glass-droplet">
          {/* Extremely faint highlight layers mimicking light catching curved water */}
          <div className="glass-edge-sheen" />
        </div>
      </div>
    </>
  );
}