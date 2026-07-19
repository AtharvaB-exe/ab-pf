import React, { useEffect, useRef, useCallback, useMemo } from 'react';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

function ProfileCardComponent({
  avatarUrl = '/avatar.jpg',
  iconUrl,
  grainUrl,
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Atharva Bulbule',
  title = 'UI/UX Designer & Frontend Dev',
  handle = 'atharvabulbule',
  status = 'Available for work',
  contactText = 'Contact Me',
  showUserInfo = true,
  onContactClick
}) {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);

  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      };

      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = ts => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x, y) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      }
    };
  }, [enableTilt]);

  const getOffsets = (evt, el) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(event => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    const { x, y } = getOffsets(event, shell);
    tiltEngine.setTarget(x, y);
  }, [tiltEngine]);

  const handlePointerEnter = useCallback(event => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    shell.classList.add('active');
    shell.classList.add('entering');
    if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
    enterTimerRef.current = window.setTimeout(() => {
      shell.classList.remove('entering');
    }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

    const { x, y } = getOffsets(event, shell);
    tiltEngine.setTarget(x, y);
  }, [tiltEngine]);

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(event => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    const { beta, gamma } = event;
    if (beta == null || gamma == null) return;

    const centerX = shell.clientWidth / 2;
    const centerY = shell.clientHeight / 2;
    const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
    const y = clamp(centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity, 0, shell.clientHeight);

    tiltEngine.setTarget(x, y);
  }, [tiltEngine, mobileTiltSensitivity]);

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    shell.addEventListener('pointerenter', pointerEnterHandler);
    shell.addEventListener('pointermove', pointerMoveHandler);
    shell.addEventListener('pointerleave', pointerLeaveHandler);

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      const anyMotion = window.DeviceMotionEvent;
      if (anyMotion && typeof anyMotion.requestPermission === 'function') {
        anyMotion.requestPermission().then(state => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', deviceOrientationHandler);
          }
        }).catch(console.error);
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };
    shell.addEventListener('click', handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', pointerEnterHandler);
      shell.removeEventListener('pointermove', pointerMoveHandler);
      shell.removeEventListener('pointerleave', pointerLeaveHandler);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove('entering');
    };
  }, [enableTilt, enableMobileTilt, tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation]);

  const cardStyle = useMemo(() => ({
    '--icon': iconUrl ? `url(${iconUrl})` : 'none',
    '--grain': grainUrl ? `url(${grainUrl})` : 'none',
    '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
    '--behind-glow-color': behindGlowColor ?? 'rgba(34, 211, 238, 0.45)',
    '--behind-glow-size': behindGlowSize ?? '50%'
  }), [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  return (
    <>
      <style>{`
        :root {
          --pointer-x: 50%; --pointer-y: 50%; --pointer-from-center: 0;
          --pointer-from-top: 0.5; --pointer-from-left: 0.5; --card-opacity: 0;
          --rotate-x: 0deg; --rotate-y: 0deg; --background-x: 50%; --background-y: 50%;
          --grain: none; --icon: none; --behind-gradient: none;
          --behind-glow-color: rgba(34, 211, 238, 0.45); --behind-glow-size: 25%;
          --inner-gradient: none;
          --sunpillar-1: hsl(190, 100%, 70%); --sunpillar-2: hsl(210, 100%, 65%);
          --sunpillar-3: hsl(230, 100%, 65%); --sunpillar-4: hsl(270, 100%, 70%);
          --sunpillar-5: hsl(290, 100%, 70%); --sunpillar-6: hsl(180, 100%, 75%);
          --sunpillar-clr-1: var(--sunpillar-1); --sunpillar-clr-2: var(--sunpillar-2);
          --sunpillar-clr-3: var(--sunpillar-3); --sunpillar-clr-4: var(--sunpillar-4);
          --sunpillar-clr-5: var(--sunpillar-5); --sunpillar-clr-6: var(--sunpillar-6);
          --card-radius: 24px;
        }
        .pc-card-wrapper { perspective: 1000px; transform: translate3d(0, 0, 0.1px); position: relative; touch-action: none; width: 360px; }
        .pc-behind { position: absolute; inset: -40px; z-index: 0; pointer-events: none; background: radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color) 0%, transparent var(--behind-glow-size)); filter: blur(40px) saturate(1.2); opacity: calc(0.85 * var(--card-opacity)); transition: opacity 200ms ease; }
        .pc-card-wrapper:hover, .pc-card-wrapper.active { --card-opacity: 1; }
        .pc-card { height: 520px; border-radius: var(--card-radius); position: relative; box-shadow: rgba(0, 0, 0, 0.6) calc((var(--pointer-from-left) * 10px) - 5px) calc((var(--pointer-from-top) * 20px) - 10px) 30px -5px; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); background: rgba(10, 10, 12, 0.85); border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; backdrop-filter: blur(20px); }
        .pc-card:hover, .pc-card.active { transition: none; transform: rotateX(var(--rotate-y)) rotateY(var(--rotate-x)) scale3d(1.02, 1.02, 1.02); }
        .pc-card-shell { position: relative; z-index: 1; height: 100%; }
        
        .pc-inside { 
          inset: 0; 
          position: absolute; 
          background-image: var(--inner-gradient); 
          padding: 32px 24px 24px 24px; 
          display: flex; 
          flex-direction: column; 
          align-items: center;
          height: 100%;
          box-sizing: border-box;
        }
        
        .pc-shine { position: absolute; inset: 0; transform: translate3d(0, 0, 1px); overflow: hidden; z-index: 3; pointer-events: none; mix-blend-mode: color-dodge; opacity: 0.12; transition: opacity 0.4s ease; background-image: repeating-linear-gradient(0deg, var(--sunpillar-clr-1) 0%, var(--sunpillar-clr-2) 10%, var(--sunpillar-clr-3) 20%, var(--sunpillar-clr-1) 30%); background-size: 100% 300%; background-position: 0 var(--background-y); }
        .pc-card:hover .pc-shine { opacity: 0.35; }
        
        /* Fixed text formatting structure headers */
        .pc-details { text-align: center; margin-bottom: 24px; width: 100%; }
        .pc-details h3 { font-size: 26px; font-weight: 800; margin: 0 0 6px 0; background: linear-gradient(to bottom, #fff, #a5f3fc); -webkit-text-fill-color: transparent; -webkit-background-clip: text; tracking: -0.03em; }
        .pc-details p { font-size: 13px; font-weight: 500; color: #a1a1aa; margin: 0; uppercase tracking-wider; }
        
        /* Main Middle Big Image Frame block matching the exact target example */
        .pc-avatar-container {
          width: 200px;
          height: 200px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          margin: auto 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateZ(20px);
          transition: transform 0.3s ease;
        }
        .pc-card:hover .pc-avatar-container {
          transform: translateZ(35px) scale(1.03);
        }
        .pc-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pc-user-info { width: 100%; display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 12px; margin-top: auto; box-sizing: border-box; }
        .pc-user-details { display: flex; align-items: center; gap: 10px; }
        .pc-mini-avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); }
        .pc-mini-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pc-user-text { display: flex; flex-direction: column; }
        .pc-handle { font-size: 13px; font-weight: 600; color: #f4f4f5; }
        .pc-status { font-size: 11px; color: #22d3ee; margin-top: 2px; }
        .pc-contact-btn { border: 1px solid rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 8px 14px; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px); }
        .pc-contact-btn:hover { border-color: #22d3ee; background: rgba(34, 211, 238, 0.1); }
      `}</style>

      <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
        {behindGlowEnabled && <div className="pc-behind" />}
        <div ref={shellRef} className="pc-card-shell">
          <section className="pc-card">
            <div className="pc-inside">
              <div className="pc-shine" />
              
              {/* Top Details Header Info */}
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>

              {/* Exact center profile block location placement */}
              <div className="pc-avatar-container">
                <img className="pc-avatar-img" src={avatarUrl} alt={name} />
              </div>

              {/* Bottom Interactive Dashboard Module Strip */}
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img src={miniAvatarUrl || avatarUrl} alt={name} />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">● {status}</div>
                    </div>
                  </div>
                  <button className="pc-contact-btn" onClick={onContactClick} type="button">
                    {contactText}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;