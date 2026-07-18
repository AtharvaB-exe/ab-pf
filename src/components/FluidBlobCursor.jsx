import { useEffect, useRef } from "react";

export default function FluidBlobCursor() {
  const blobRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let currentX = mouseX;
    let currentY = mouseY;

    let velocityX = 0;
    let velocityY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", move);

    const animate = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      velocityX = mouseX - currentX;
      velocityY = mouseY - currentY;

      const speed = Math.min(
        Math.sqrt(
          velocityX * velocityX +
          velocityY * velocityY
        ) * 0.4,
        35
      );

      const stretch = 1 + speed / 35;

      const angle =
        Math.atan2(
          velocityY,
          velocityX
        ) * (180 / Math.PI);

      if (blobRef.current) {
        blobRef.current.style.transform = `
          translate(
            ${currentX - 35}px,
            ${currentY - 35}px
          )
          rotate(${angle}deg)
          scale(${stretch}, ${1 / stretch})
        `;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener(
        "mousemove",
        move
      );
    };
  }, []);

  return (
    <div
      ref={blobRef}
      className="fluid-blob"
    />
  );
}