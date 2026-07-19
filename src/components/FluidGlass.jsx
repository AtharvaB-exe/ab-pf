/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  Preload,
  MeshTransmissionMaterial,
  Image
} from '@react-three/drei';
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

  // Dynamic texture generated directly from your live HTML elements
  const [htmlTexture, setHtmlTexture] = useState(null);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    if (geo) {
      geo.computeBoundingBox();
      geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, [nodes, geometryKey]);

  // Real-Time Canvas Mirror Map: Captures text pixels to stream directly to WebGL
  useEffect(() => {
    if (!htmlRef?.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');

    const updateTextureFromHTML = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Render custom vector copies of our text cleanly into the shader grid
      ctx.font = '900 11vw Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.textBaseline = 'top';
      
      const paddingLeft = window.innerWidth * 0.1;
      const paddingTop = window.innerHeight * 0.28;

      ctx.fillText('ATHARVA', paddingLeft, paddingTop);
      ctx.fillText('BULBULE', paddingLeft, paddingTop + (window.innerHeight * 0.11));

      ctx.font = '700 0.75rem Inter, sans-serif';
      ctx.fillStyle = '#22d3ee';
      ctx.fillText('UI/UX DESIGNER • FRONTEND DEVELOPER', paddingLeft, paddingTop - 40);

      ctx.font = '500 1.25rem Inter, sans-serif';
      ctx.fillStyle = '#e4e4e7';
      
      const pText = 'Crafting cinematic digital experiences through design, code, and visual storytelling.';
      const maxWidth = window.innerWidth * 0.4;
      let words = pText.split(' ');
      let line = '';
      let y = paddingTop + (window.innerHeight * 0.24);

      for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, paddingLeft, y);
          line = words[n] + ' ';
          y += 28;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, paddingLeft, y);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      setHtmlTexture(texture);
    };

    updateTextureFromHTML();
    window.addEventListener('resize', updateTextureFromHTML);
    return () => window.removeEventListener('resize', updateTextureFromHTML);
  }, [htmlRef]);

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

    // Capture the environment background pass + mirrored vector texts completely inside the buffer map
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

      {/* Renders the combined background + text image texture behind the lens */}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      
      {/* The 3D physical crystal lens refracts EVERYTHING on the plane maps */}
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