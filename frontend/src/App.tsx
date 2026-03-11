import React from 'react';
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <div style={{ position: 'absolute', zIndex: 10, padding: '40px' }}>
        <h1 style={{ fontSize: '72px', fontWeight: 900, marginBottom: '20px' }}>
          ATHENA
        </h1>
        <p style={{ fontSize: '24px', opacity: 0.7 }}>
          AI-powered anti-sniper market maker
        </p>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#00ff88" wireframe />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
