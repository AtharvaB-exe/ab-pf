/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  Preload,
  MeshTransmissionMaterial,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <Wrapper modeProps={rawOverrides}>
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
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    
    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);
      if (modeProps.scale == null) {
        const maxWorld = v.width * 0.9;
        const desired = maxWorld / geoWidthRef.current;
        ref.current.scale.setScalar(Math.min(0.24, desired));
      }
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Keep background completely transparent so the Prism colors show through
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(
        <group>
          {/* Subtitle Line */}
          <Text
            position={[0, 1.6, 12]}
            fontSize={0.075}
            letterSpacing={0.4}
            color="#22d3ee"
            anchorX="center"
            anchorY="middle"
          >
            UI/UX DESIGNER • FRONTEND DEVELOPER
          </Text>

          {/* Perfectly Proportioned Main Typography Headers */}
          <Text
            position={[0, 0.5, 12]}
            fontSize={0.46}
            fontWeight={900}
            letterSpacing={-0.03}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            ATHARVA
          </Text>
          <Text
            position={[0, -0.5, 12]}
            fontSize={0.46}
            fontWeight={900}
            letterSpacing={-0.03}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            BULBULE
          </Text>

          {/* Description Tagline */}
          <Text
            position={[0, -1.3, 12]}
            fontSize={0.095}
            maxWidth={3.5}
            textAlign="center"
            color="#d4d4d8"
            anchorX="center"
            anchorY="middle"
          >
            Crafting cinematic digital experiences through design, code, and visual storytelling.
          </Text>
        </group>,
        scene
      )}
      
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      
      {nodes[geometryKey] && (
        <mesh ref={ref} scale={scale ?? 0.24} rotation-x={Math.PI / 2} geometry={nodes[geometryKey]?.geometry} {...props}>
          <MeshTransmissionMaterial
            buffer={buffer.texture}
            ior={ior ?? 1.35}
            thickness={thickness ?? 8}
            anisotropy={anisotropy ?? 0.08}
            chromaticAberration={chromaticAberration ?? 0.25}
            transmission={1.0}
            roughness={0.0}
            transparent
            {...extraMat}
          />
        </mesh>
      )}
    </>
  );
});

function Lens({ modeProps, ...p }) { return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />; }
function Cube({ modeProps, ...p }) { return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" followPointer modeProps={modeProps} {...p} />; }
function Bar({ modeProps = {}, ...p }) { return <ModeWrapper glb="/assets/3d/bar.glb" geometryKey="Cube" lockToBottom followPointer={false} modeProps={modeProps} {...p} />; }