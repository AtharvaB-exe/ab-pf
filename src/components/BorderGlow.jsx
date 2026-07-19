import { useRef, useCallback, useEffect } from 'react';

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x) { return x * x * x; }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) {
  const cardRef = useRef(null);

  const getCenterOfElement = useCallback((el) => {
    const rect = el.getBoundingClientRect();
    return [rect.width / 2, rect.height / 2];
  }, []);

  const getEdgeProximity = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edge = getEdgeProximity(card, x, y);
    const angle = getCursorAngle(card, x, y);

    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, [getEdgeProximity, getCursorAngle]);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', v) });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => card.style.setProperty('--edge-proximity', v),
      onEnd: () => card.classList.remove('sweep-active'),
    });
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);

  return (
    <>
      <style>{`
        .border-glow-card {
          --edge-proximity: 0;
          --cursor-angle: 45deg;
          --edge-sensitivity: 30;
          --color-sensitivity: calc(var(--edge-sensitivity) + 20);
          --border-radius: 28px;
          --glow-padding: 40px;
          --cone-spread: 25;
          position: relative;
          border-radius: var(--border-radius);
          isolation: isolate;
          transform: translate3d(0, 0, 0.01px);
          display: grid;
          border: 1px solid rgb(255 255 255 / 10%);
          background: var(--card-bg, transparent);
          overflow: visible;
        }
        .border-glow-card::before,
        .border-glow-card::after,
        .border-glow-card > .edge-light {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          transition: opacity 0.25s ease-out;
          z-index: -1;
        }
        .border-glow-card:not(:hover):not(.sweep-active)::before,
        .border-glow-card:not(:hover):not(.sweep-active)::after,
        .border-glow-card:not(:hover):not(.sweep-active) > .edge-light {
          opacity: 0;
          transition: opacity 0.75s ease-in-out;
        }
        .border-glow-card::before {
          border: 1px solid transparent;
          background:
            linear-gradient(var(--card-bg, transparent) 0 100%) padding-box,
            linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
            var(--gradient-one) border-box, var(--gradient-two) border-box,
            var(--gradient-three) border-box, var(--gradient-four) border-box,
            var(--gradient-five) border-box, var(--gradient-six) border-box,
            var(--gradient-seven) border-box, var(--gradient-base) border-box;
          opacity: calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
          mask-image: conic-gradient(from var(--cursor-angle) at center, black calc(var(--cone-spread) * 1%), transparent calc((var(--cone-spread) + 15) * 1%), transparent calc((100 - var(--cone-spread) - 15) * 1%), black calc((100 - var(--cone-spread)) * 1%));
          -webkit-mask-image: conic-gradient(from var(--cursor-angle) at center, black calc(var(--cone-spread) * 1%), transparent calc((var(--cone-spread) + 15) * 1%), transparent calc((100 - var(--cone-spread) - 15) * 1%), black calc((100 - var(--cone-spread)) * 1%));
        }
        .border-glow-card::after {
          border: 1px solid transparent;
          background:
            var(--gradient-one) padding-box, var(--gradient-two) padding-box,
            var(--gradient-three) padding-box, var(--gradient-four) padding-box,
            var(--gradient-five) padding-box, var(--gradient-six) padding-box,
            var(--gradient-seven) padding-box, var(--gradient-base) padding-box;
          mask-image: linear-gradient(to bottom, black, black), radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%), conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);
          -webkit-mask-image: linear-gradient(to bottom, black, black), radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%), conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);
          opacity: calc(var(--fill-opacity, 0.5) * (var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
          mix-blend-mode: soft-light;
        }
        .border-glow-card > .edge-light {
          inset: calc(var(--glow-padding) * -1);
          pointer-events: none;
          z-index: 1;
          mask-image: conic-gradient(from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
          -webkit-mask-image: conic-gradient(from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
          opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
          mix-blend-mode: plus-lighter;
        }
        .border-glow-card > .edge-light::before {
          content: "";
          position: absolute;
          inset: var(--glow-padding);
          border-radius: inherit;
          box-shadow:
            inset 0 0 0 1px var(--glow-color, hsl(190deg 90% 60% / 100%)),
            0 0 15px 0 var(--glow-color-30, hsl(190deg 90% 60% / 30%)),
            0 0 25px 2px var(--glow-color-20, hsl(190deg 90% 60% / 20%));
        }
        .border-glow-inner {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        className={`border-glow-card ${className}`}
        style={{
          '--card-bg': backgroundColor,
          '--edge-sensitivity': edgeSensitivity,
          '--border-radius': `${borderRadius}px`,
          '--glow-padding': `${glowRadius}px`,
          '--cone-spread': coneSpread,
          '--fill-opacity': fillOpacity,
          ...glowVars,
          ...buildGradientVars(colors),
        }}
      >
        <span className="edge-light" />
        <div className="border-glow-inner">
          {children}
        </div>
      </div>
    </>
  );
}