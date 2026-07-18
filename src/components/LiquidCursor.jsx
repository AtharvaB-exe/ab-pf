import { useEffect, useRef } from "react";

export default function LiquidCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    let trailX = 0;
    let trailY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", move);

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;

      trailX += (mouseX - trailX) * 0.07;
      trailY += (mouseY - trailY) * 0.07;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${cursorX}px, ${cursorY}px)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform =
          `translate(${trailX}px, ${trailY}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      <div className="liquid-trail" ref={trailRef} />
      <div className="liquid-cursor" ref={cursorRef} />
    </>
  );
}