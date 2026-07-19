/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  Preload,
  MeshTransmissionMaterial,
  Image,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {} }) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'lens' ? lensProps : {};

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <Wrapper modeProps={rawOverrides}>
        <SceneContent />
        <Preload />
      </Wrapper>
    </Canvas>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}) {
  const ref = useRef();
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    if (geo) {
      geo.computeBoundingBox();
      geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, pointer, camera } = state;
    const v = state.viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    
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
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      {nodes[geometryKey] && (
        <mesh ref={ref} scale={scale ?? 0.24} rotation-x={Math.PI / 2} geometry={nodes[geometryKey].geometry} {...props}>
          <MeshTransmissionMaterial
            buffer={buffer.texture}
            ior={ior ?? 1.22}
            thickness={thickness ?? 5.5}
            anisotropy={anisotropy ?? 0.03}
            chromaticAberration={chromaticAberration ?? 0.14}
            transmission={1}
            roughness={0.0}
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

// 3D Visual Tree containing background + text structures inside the render target buffer
function SceneContent() {
  const { width, height } = useThree((state) => state.viewport);

  // Dynamic responsive sizing calculation weights based on screen size properties
  const isMobile = window.innerWidth < 768;
  const headlineSize = isMobile ? height * 0.11 : height * 0.14;
  const startX = isMobile ? -width * 0.42 : -width * 0.38;

  return (
    <group>
      {/* 3D Core Layer Background Texture */}
      <Image position={[0, 0, 0]} scale={[width, height, 1]} url="/bg.png" />

      {/* Sub-Headline Text Element */}
      <Text
        position={[startX, height * 0.22, 2]}
        fontSize={height * 0.02}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGdfAZ9hiA.woff2"
        color="#22d3ee"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.4}
      >
        UI/UX DESIGNER • FRONTEND DEVELOPER
      </Text>

      {/* Main Headline Stack: Row 1 */}
      <Text
        position={[startX, height * 0.08, 2]}
        fontSize={headlineSize}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGdfAZ9hiA.woff2"
        color="white"
        anchorX="left"
        anchorY="middle"
        letterSpacing={-0.04}
      >
        ATHARVA
      </Text>

      {/* Main Headline Stack: Row 2 */}
      <Text
        position={[startX, -height * 0.06, 2]}
        fontSize={headlineSize}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGdfAZ9hiA.woff2"
        color="white"
        anchorX="left"
        anchorY="middle"
        letterSpacing={-0.04}
      >
        BULBULE
      </Text>

      {/* Paragraph Core Summary Text Section */}
      <Text
        position={[startX, -height * 0.18, 2]}
        fontSize={height * 0.026}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        color="#d4d4d8"
        anchorX="left"
        anchorY="top"
        maxWidth={isMobile ? width * 0.85 : width * 0.45}
        lineHeight={1.4}
      >
        Crafting cinematic digital experiences through design, code, and visual storytelling.
      </Text>
    </group>
  );
}