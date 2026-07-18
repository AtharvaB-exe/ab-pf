import { useEffect, useRef } from "react";

export default function FluidBlobCursor() {
  const blobRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let currentX = mouseX;
    let currentY = mouseY;

    const animate = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      const speed = Math.min(
        Math.sqrt(dx * dx + dy * dy),
        60
      );

      const stretch = 1 + speed * 0.015;

      const angle =
        Math.atan2(dy, dx) *
        (180 / Math.PI);

      if (blobRef.current) {
        blobRef.current.style.transform = `
          translate(
            ${currentX - 45}px,
            ${currentY - 45}px
          )
          rotate(${angle}deg)
          scale(${stretch}, ${1 / stretch})
        `;
      }

      requestAnimationFrame(animate);
    };

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", move);

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div
      ref={blobRef}
      className="fluid-blob"
    />
  );
}