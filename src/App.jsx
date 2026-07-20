import React from 'react';
import FluidGlass from './components/FluidGlass';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#000000' }}>
      <FluidGlass 
        mode="lens"
        lensProps={{
          scale: 0.25,
          ior: 1.15,
          thickness: 5,
          chromaticAberration: 0.1,
          anisotropy: 0.01  
        }}
      />
    </div>
  );
}