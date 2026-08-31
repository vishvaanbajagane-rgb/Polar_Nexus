'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

function IceSphere() {
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (core.current) core.current.rotation.y += delta * 0.12;
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.05;
      shell.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <group>
      <Sphere ref={core} args={[1.6, 64, 64]}>
        <meshStandardMaterial
          color="#0ea5e9"
          roughness={0.35}
          metalness={0.65}
          emissive="#0c4a6e"
          emissiveIntensity={0.55}
        />
      </Sphere>
      <Sphere ref={shell} args={[1.78, 32, 32]}>
        <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.22} />
      </Sphere>
      {/* Polar ice caps */}
      <mesh position={[0, 1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 48]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.75, 48]} />
        <meshStandardMaterial color="#f0f9ff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export default function PolarGlobe({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 1.2, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 3]} intensity={1.5} color="#bae6fd" />
        <pointLight position={[-5, -3, -4]} intensity={1.2} color="#a78bfa" />
        <Stars radius={60} depth={40} count={2500} factor={3} fade speed={0.6} />
        <IceSphere />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
