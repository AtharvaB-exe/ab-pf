/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  Preload,
  MeshTransmissionMaterial
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <Wrapper modeProps={rawOverrides} />
      <Preload />
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
  const { viewport: vp } = useThree();
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

    // FIXED: Prevent the canvas from painting a solid color fill mask over layers beneath it
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {nodes[geometryKey] && (
        <mesh ref={ref} scale={scale ?? 0.24} rotation-x={Math.PI / 2} geometry={nodes[geometryKey]?.geometry} {...props}>
          <MeshTransmissionMaterial
            ior={ior ?? 1.25}
            thickness={thickness ?? 6}
            anisotropy={anisotropy ?? 0.05}
            chromaticAberration={chromaticAberration ?? 0.2}
            transmission={1.0}
            roughness={0.0}
            distortion={0.3}
            distortionScale={0.5}
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
function Bar({ modeProps = {}, ...p }) {
  const defaultMat = { transmission: 1, roughness: 0, thickness: 10, ior: 1.15, color: '#ffffff' };
  return <ModeWrapper glb="/assets/3d/bar.glb" geometryKey="Cube" lockToBottom followPointer={false} modeProps={{ ...defaultMat, ...modeProps }} {...p} />;
}