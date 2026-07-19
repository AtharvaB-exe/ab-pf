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
    const friction = 0.84; 
    const acceleration = 0.09; 
    let time = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateFluidPhysics = () => {
      time += 0.04;

      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      velX += dx * acceleration;
      velY += dy * acceleration;
      
      velX *= friction;
      velY *= friction;

      currentX += velX;
      currentY += velY;

      const speed = Math.sqrt(velX * velX + velY * velY);
      const stretch = Math.min(speed * 0.025, 0.75);
      
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.5;
      
      let angle = 0;
      if (speed > 0.5) {
        angle = Math.atan2(velY, velX) * (180 / Math.PI);
      }

      // Smoothly morphing asymmetric liquid shapes
      const r1 = 45 + Math.sin(time) * 7;
      const r2 = 55 + Math.cos(time + 1) * 7;
      const r3 = 60 + Math.sin(time + 2) * 7;
      const r4 = 40 + Math.cos(time + 3) * 7;

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
    <div className="fluid-cursor-system">
      <div ref={blobRef} className="ios-glass-droplet">
        <div className="specular-lens-reflection" />
      </div>
    </div>
  );
}