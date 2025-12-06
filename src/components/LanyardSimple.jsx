/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import './Lanyard.css';

function Card3D() {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [hovered]);

  return (
    <group ref={meshRef}>
      {/* Main Card */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 3, 0.1]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Card Details - Top Bar */}
      <mesh position={[0, 1, 0.06]}>
        <boxGeometry args={[1.8, 0.4, 0.02]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Card Details - Middle Section */}
      <mesh position={[0, 0.2, 0.06]}>
        <boxGeometry args={[1.6, 0.8, 0.02]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Card Details - Bottom Accent */}
      <mesh position={[0, -0.8, 0.06]}>
        <boxGeometry args={[1.4, 0.3, 0.02]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Lanyard Clip at top */}
      <mesh position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial
          color="#888888"
          metalness={1}
          roughness={0.3}
        />
      </mesh>

      {/* Lanyard String */}
      <LanyardRope startY={1.7} />
    </group>
  );
}

function LanyardRope({ startY }) {
  const points = [];
  const segments = 20;
  
  // Create a curved rope path
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = startY + t * 3;
    const x = Math.sin(t * Math.PI * 2) * 0.3;
    const z = 0;
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.05, 8, false);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial
        color="#6366f1"
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
}

export default function LanyardSimple() {
  return (
    <div className="lanyard-wrapper">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 5]} intensity={1} color="#6366f1" />
        
        <Card3D />
        
        {/* Background gradient */}
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color="#030014" />
        </mesh>
      </Canvas>
    </div>
  );
}
