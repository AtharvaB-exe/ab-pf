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
    const friction = 0.8;
    const acceleration = 0.1;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateFluidPhysics = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      velX += dx * acceleration;
      velY += dy * acceleration;
      
      velX *= friction;
      velY *= friction;

      currentX += velX;
      currentY += velY;

      const speed = Math.sqrt(velX * velX + velY * velY);
      const maxStretch = 0.6; 
      const stretch = Math.min(speed * 0.02, maxStretch);
      
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.5;
      
      let angle = 0;
      if (speed > 0.5) {
        angle = Math.atan2(velY, velX) * (180 / Math.PI);
      }

      if (blobRef.current) {
        // Utilizing top/left fallback alongside translation to secure rendering layout visibility
        blobRef.current.style.left = `${currentX}px`;
        blobRef.current.style.top = `${currentY}px`;
        blobRef.current.style.transform = `
          translate3d(-50%, -50%, 0)
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
        <div className="rim-light-accent" />
      </div>
    </div>
  );
}