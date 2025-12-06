/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import './Lanyard.css';

function Card3D({ isMobile }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const cardWidth = 2;
  const cardHeight = 3;
  const scale = isMobile ? 1.2 : 1;

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
    <group ref={meshRef} scale={scale}>
      {/* Main Card Body */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[cardWidth, cardHeight, 0.1]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Card Front */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[cardWidth * 0.95, cardHeight * 0.95]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.4}
          emissive="#dc2626"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Card Back */}
      <mesh position={[0, 0, -0.051]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[cardWidth * 0.95, cardHeight * 0.95]} />
        <meshStandardMaterial
          color="#0f0f1e"
          metalness={0.3}
          roughness={0.4}
          emissive="#f43f5e"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Decorative elements */}
      {/* Top Bar */}
      <mesh position={[0, 1, 0.06]}>
        <boxGeometry args={[1.8, 0.4, 0.02]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#dc2626"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Middle Section */}
      <mesh position={[0, 0.2, 0.06]}>
        <boxGeometry args={[1.6, 0.8, 0.02]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#f43f5e"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Bottom Accent */}
      <mesh position={[0, -0.8, 0.06]}>
        <boxGeometry args={[1.4, 0.3, 0.02]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#f43f5e"
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
  // Array untuk text yang berulang
  const textRepeats = [];
  const textSpacing = 0.5; // Jarak antar text
  const textCount = 6; // Jumlah text yang berulang
  
  for (let i = 0; i < textCount; i++) {
    textRepeats.push(
      <Text
        key={i}
        position={[0, startY + 0.5 + (i * textSpacing), 0.021]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.1}
        color="#1a1a2e"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
        maxWidth={1.5}
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff"
      >
        Fazrilukman
      </Text>
    );
  }

  return (
    <group>
      {/* Tali Lanyard - Bentuk Persegi Panjang (Ribbon/Flat) */}
      <mesh position={[0, startY + 1.5, 0]}>
        <boxGeometry args={[0.25, 3, 0.04]} />
        <meshStandardMaterial
          color="#e8e8e8"
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      
      {/* Text yang berulang */}
      {textRepeats}
    </group>
  );
}

export default function Lanyard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas gl={{ alpha: true }} style={{ background: 'transparent' }}>
        <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 7 : 8]} fov={isMobile ? 50 : 50} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 5]} intensity={1} color="#dc2626" />
        
        <Card3D isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
