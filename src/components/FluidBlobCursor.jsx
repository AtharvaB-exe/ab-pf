import { useEffect, useRef } from "react";

export default function FluidBlobCursor() {
  const blobRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    
    // Physics variables for heavy fluid dynamics
    let velX = 0;
    let velY = 0;
    const friction = 0.82; // Viscous liquid resistance
    const acceleration = 0.08; // Heavy organic pull

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateFluidPhysics = () => {
      // Spring-mass fluid simulation mechanics
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      velX += dx * acceleration;
      velY += dy * acceleration;
      
      velX *= friction;
      velY *= friction;

      currentX += velX;
      currentY += velY;

      // Calculate dramatic scale distortion based on acceleration speed
      const speed = Math.sqrt(velX * velX + velY * velY);
      const maxStretch = 0.8; // Allows extreme liquid deformation
      const stretch = Math.min(speed * 0.025, maxStretch);
      
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.6;
      
      // Calculate rotation angle to follow cursor trajectory perfectly
      let angle = 0;
      if (speed > 0.5) {
        angle = Math.atan2(velY, velX) * (180 / Math.PI);
      }

      if (blobRef.current) {
        blobRef.current.style.transform = `
          translate3d(${currentX}px, ${currentY}px, 0)
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
      {/* Advanced Liquid Filter to blur edges softly into the background while merging blobs */}
      <svg className="absolute w-0 h-0 pointer-events-none hidden-goo" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ios-liquid-glass" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -14" 
              result="gooey-edge" 
            />
            <feComposite in="SourceGraphic" in2="gooey-edge" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="fluid-cursor-system">
        <div ref={blobRef} className="ios-glass-droplet">
          {/* Internal specular highlight maps simulating curved top-down lighting */}
          <div className="specular-lens-reflection" />
          <div className="rim-light-accent" />
        </div>
      </div>
    </>
  );
}