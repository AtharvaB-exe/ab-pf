/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, Preload, MeshTransmissionMaterial, Image } from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {}, mousePos = { x: 0, y: 0 }, htmlRef }) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'lens' ? lensProps : {};

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <Wrapper modeProps={rawOverrides} mousePos={mousePos} htmlRef={htmlRef}>
        <Preload />
      </Wrapper>
    </Canvas>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  mousePos,
  htmlRef,
  ...props
}) {
  const ref = useRef();
  const backgroundMeshRef = useRef();
  const textOverlayMeshRef = useRef();
  
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);
  const [htmlTexture, setHtmlTexture] = useState(null);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    if (geo) {
      geo.computeBoundingBox();
      geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, [nodes, geometryKey]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const updateTextureFromHTML = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const isDesktop = window.innerWidth > 1024;
      const paddingLeft = window.innerWidth / 2;
      const paddingTop = window.innerHeight * 0.20;
      
      ctx.textAlign = 'center';

      // 1. Tagline
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillStyle = '#22d3ee';
      ctx.textBaseline = 'top';
      ctx.fillText('UI/UX DESIGNER • FRONTEND DEVELOPER', paddingLeft, paddingTop);

      // 2. Headline
      const fontSizePX = window.innerWidth * 0.11; 
      ctx.font = `900 ${fontSizePX}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      
      const verticalLineHeight = fontSizePX * 0.90; 
      const titleRow1Y = paddingTop + 45; 
      const titleRow2Y = titleRow1Y + verticalLineHeight;

      ctx.fillText('ATHARVA', paddingLeft, titleRow1Y);
      ctx.fillText('BULBULE', paddingLeft, titleRow2Y);

      // 3. Paragraph
      const paragraphFontSize = isDesktop ? 20 : 16;
      ctx.font = `500 ${paragraphFontSize}px Inter, sans-serif`;
      ctx.fillStyle = '#d4d4d8';
      
      const bodyCopyText = 'Crafting cinematic digital experiences through design, code, and visual storytelling.';
      const maxTextWidth = isDesktop ? window.innerWidth * 0.50 : window.innerWidth * 0.85;
      let wordsArray = bodyCopyText.split(' ');
      let structuredLine = '';
      let currentParagraphY = titleRow2Y + fontSizePX + 25; 

      for(let i = 0; i < wordsArray.length; i++) {
        let testTextLine = structuredLine + wordsArray[i] + ' ';
        let measurementMetrics = ctx.measureText(testTextLine);
        if (measurementMetrics.width > maxTextWidth && i > 0) {
          ctx.fillText(structuredLine, paddingLeft, currentParagraphY);
          structuredLine = wordsArray[i] + ' ';
          currentParagraphY += paragraphFontSize * 1.5; 
        } else {
          structuredLine = testTextLine;
        }
      }
      ctx.fillText(structuredLine, paddingLeft, currentParagraphY);

      // 4. Integrated Border Glow Button Render Pass
      const buttonY = currentParagraphY + paragraphFontSize * 2 + 10;
      const btnWidth = 150;
      const btnHeight = 48;
      const radius = 24;
      const btnX = paddingLeft - btnWidth / 2;

      // Track cursor proximity to the button center point
      const mouseXReal = ((mousePos.x + 1) / 2) * window.innerWidth;
      const mouseYReal = ((-mousePos.y + 1) / 2) * window.innerHeight;
      const btnCenterX = btnX + btnWidth / 2;
      const btnCenterY = buttonY + btnHeight / 2;
      const dist = Math.hypot(mouseXReal - btnCenterX, mouseYReal - btnCenterY);

      // Render the card background layer
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(btnX, buttonY, btnWidth, btnHeight, radius);
      ctx.fillStyle = '#09090b';
      ctx.fill();
      
      // Compute responsive reactive border light color distribution strings
      if (dist < 180) {
        const borderGlowGrad = ctx.createRadialGradient(mouseXReal, mouseYReal, 10, btnCenterX, btnCenterY, 80);
        borderGlowGrad.addColorStop(0, '#22d3ee');
        borderGlowGrad.addColorStop(0.5, '#38bdf8');
        borderGlowGrad.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = borderGlowGrad;
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
      ctx.restore();

      // Draw active interior text metrics
      ctx.font = '600 14px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Enter', paddingLeft, buttonY + btnHeight / 2);
      ctx.textAlign = 'left';

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      setHtmlTexture(texture);
    };

    updateTextureFromHTML();
    window.addEventListener('resize', updateTextureFromHTML);
    return () => window.removeEventListener('resize', updateTextureFromHTML);
  }, [htmlRef, mousePos]);

  useFrame((state, delta) => {
    const { gl, camera } = state;
    const v = state.viewport.getCurrentViewport(camera, [0, 0, 15]);
    const destX = followPointer ? (mousePos.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (mousePos.y * v.height) / 2 : 0;
    
    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.12, delta);
      if (modeProps.scale == null) {
        const maxWorld = v.width * 0.9;
        const desired = maxWorld / geoWidthRef.current;
        ref.current.scale.setScalar(Math.min(0.24, desired));
      }
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(
        <group>
          <Image ref={backgroundMeshRef} position={[0, 0, 0]} scale={[vp.width, vp.height, 1]} url="/bg.png" />
          {htmlTexture && (
            <mesh ref={textOverlayMeshRef} position={[0, 0, 1]}>
              <planeGeometry args={[vp.width, vp.height]} />
              <meshBasicMaterial map={htmlTexture} transparent />
            </mesh>
          )}
        </group>,
        scene
      )}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      {nodes[geometryKey] && (
        <mesh ref={ref} scale={scale ?? 0.24} rotation-x={Math.PI / 2} geometry={nodes[geometryKey].geometry} {...props}>
          <MeshTransmissionMaterial
            buffer={buffer.texture}
            ior={ior ?? 1.25}
            thickness={thickness ?? 5.5}
            anisotropy={anisotropy ?? 0.03}
            chromaticAberration={chromaticAberration ?? 0.14}
            transmission={1}
            roughness={0.0}
            transparent
            {...extraMat}
          />
        </mesh>
      )}
    </>
  );
});

function Lens({ modeProps, ...p }) {
  return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }) {
  return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }) {
  const defaultMat = { transmission: 1, roughness: 0, thickness: 10, ior: 1.15, color: '#ffffff' };
  return <ModeWrapper glb="/assets/3d/bar.glb" geometryKey="Cube" lockToBottom followPointer={false} modeProps={{ ...defaultMat, ...modeProps }} {...p} />;
}