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
    
    // Hard dampening physics for hyper-smooth cinematic inertia
    const friction = 0.92; 
    const acceleration = 0.03; 
    let time = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateFluidPhysics = () => {
      time += 0.015; // Slowed down shape morphing speed

      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      velX += dx * acceleration;
      velY += dy * acceleration;
      
      velX *= friction;
      velY *= friction;

      currentX += velX;
      currentY += velY;

      const speed = Math.sqrt(velX * velX + velY * velY);
      // Minimized stretch mapping to prevent the cursor from distorting too much
      const stretch = Math.min(speed * 0.008, 0.35);
      
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.4;
      
      let angle = 0;
      if (speed > 0.1) {
        angle = Math.atan2(velY, velX) * (180 / Math.PI);
      }

      // Smooth, closely controlled organic radius limits
      const r1 = 47 + Math.sin(time) * 3;
      const r2 = 53 + Math.cos(time + 1) * 3;
      const r3 = 52 + Math.sin(time + 2) * 3;
      const r4 = 48 + Math.cos(time + 3) * 3;

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
      <div ref={blobRef} className="ios-glass-droplet" />
    </div>
  );
}