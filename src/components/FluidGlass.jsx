/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  Preload,
  ScrollControls,
  Scroll,
  MeshTransmissionMaterial,
  Image
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {}, mousePos = { x: 0, y: 0 }, children }) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'lens' ? lensProps : {};

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <ScrollControls pages={1} distance={0}>
        <Wrapper modeProps={rawOverrides} mousePos={mousePos}>
          {/* This injects the text and DOM elements right into the internal render target loop */}
          <Scroll html style={{ width: '100%', height: '100%' }}>
            {children}
          </Scroll>
          <RefractionSceneTarget />
          <Preload />
        </Wrapper>
      </ScrollControls>
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
  mousePos,
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

    // Capture the layout contents (including the portal children) directly to the refraction texture maps
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
            ior={ior ?? 1.25}
            thickness={thickness ?? 6}
            anisotropy={anisotropy ?? 0.03}
            chromaticAberration={chromaticAberration ?? 0.15}
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

function RefractionSceneTarget() {
  const { width, height } = useThree((state) => state.viewport);
  return <Image position={[0, 0, 0]} scale={[width, height, 1]} url="/bg.png" opacity={0} />;
}