import { useRef, useState, useEffect } from 'react';
import './Lanyard.css';

export default function Lanyard() {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 50 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        // Pendulum physics with gravity
        const springStrength = 0.015;
        const gravity = 0.3;
        const damping = 0.96;
        
        setVelocity(prev => {
          const newVelX = (prev.x - position.x * springStrength) * damping;
          const newVelY = (prev.y - (position.y - 50) * springStrength - gravity) * damping;
          return { x: newVelX, y: newVelY };
        });
        
        setPosition(prev => ({
          x: prev.x + velocity.x,
          y: prev.y + velocity.y
        }));
      }
      animationFrame.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame.current);
  }, [isDragging, velocity.x, velocity.y, position.x, position.y]);

  const handleStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  const handleMove = (e) => {
    if (isDragging) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const newX = clientX - dragStart.current.x;
      const newY = clientY - dragStart.current.y;
      
      setPosition({
        x: Math.max(-200, Math.min(200, newX)),
        y: Math.max(-50, Math.min(200, newY))
      });
      
      setVelocity({
        x: (newX - position.x) * 0.2,
        y: (newY - position.y) * 0.2
      });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, position]);

  const rotateX = -position.y * 0.08;
  const rotateY = position.x * 0.12;
  const rotateZ = -position.x * 0.08;

  return (
    <div className="lanyard-wrapper" style={{ 
      minHeight: 'clamp(550px, 85vh, 700px)', 
      perspective: '1500px',
      position: 'relative',
      overflow: 'visible',
      marginTop: '0px',
      paddingTop: '100px',
      paddingBottom: '60px',
      width: '100%'
    }}>
      {/* Lanyard String - More visible */}
      <svg className="lanyard-string" style={{ 
        position: 'absolute',
        top: '10px',
        left: '50%',
        width: '400px',
        height: '400px',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'visible'
      }}>
        {/* Main lanyard rope */}
        <path
          d={`M 200 0 Q ${200 + position.x * 0.4} ${120 + position.y * 0.4} ${200 + position.x} ${220 + position.y}`}
          stroke="url(#lanyardGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />
        {/* Shadow line for depth */}
        <path
          d={`M 200 0 Q ${200 + position.x * 0.4} ${120 + position.y * 0.4} ${200 + position.x} ${220 + position.y}`}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          transform="translate(2, 2)"
        />
        <defs>
          <linearGradient id="lanyardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Attachment point at top */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '20px',
        background: 'linear-gradient(145deg, #333, #666)',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        zIndex: 11,
        border: '2px solid rgba(255,255,255,0.1)'
      }} />

      {/* 3D Depth Layers - Background shadows */}
      <div
        style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: `
            translateX(-50%)
            translate(${position.x * 0.95}px, ${position.y * 0.95}px)
            rotateX(${rotateX * 0.9}deg)
            rotateY(${rotateY * 0.9}deg)
            rotateZ(${rotateZ * 0.9}deg)
            translateZ(-20px)
          `,
          transformStyle: 'preserve-3d',
          width: 'clamp(260px, 75vw, 320px)',
          height: 'clamp(340px, 60vh, 440px)',
          background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.15), rgba(239, 68, 68, 0.1))',
          borderRadius: '24px',
          filter: 'blur(8px)',
          zIndex: 4,
          pointerEvents: 'none',
          transition: isDragging ? 'none' : 'transform 0.05s ease-out'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: `
            translateX(-50%)
            translate(${position.x * 0.9}px, ${position.y * 0.9}px)
            rotateX(${rotateX * 0.8}deg)
            rotateY(${rotateY * 0.8}deg)
            rotateZ(${rotateZ * 0.8}deg)
            translateZ(-40px)
          `,
          transformStyle: 'preserve-3d',
          width: 'clamp(260px, 75vw, 320px)',
          height: 'clamp(340px, 60vh, 440px)',
          background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.05))',
          borderRadius: '24px',
          filter: 'blur(12px)',
          zIndex: 3,
          pointerEvents: 'none',
          transition: isDragging ? 'none' : 'transform 0.05s ease-out'
        }}
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="lanyard-card"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          transform: `
            translate(${position.x}px, ${position.y}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
          `,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'transform 0.05s ease-out',
          transformStyle: 'preserve-3d',
          position: 'relative',
          top: '100px',
          width: 'clamp(260px, 75vw, 320px)',
          height: 'clamp(340px, 60vh, 440px)',
          margin: '0 auto',
          background: 'linear-gradient(145deg, #0a0a15 0%, #1a1a2e 50%, #0f0f1e 100%)',
          borderRadius: '24px',
          boxShadow: `
            0 40px 100px rgba(220, 38, 38, 0.5),
            0 20px 50px rgba(239, 68, 68, 0.4),
            0 10px 25px rgba(244, 63, 94, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.15),
            inset 0 0 40px rgba(220, 38, 38, 0.15),
            inset 0 2px 4px rgba(255, 255, 255, 0.1)
          `,
          zIndex: 5,
          border: '1px solid rgba(239, 68, 68, 0.2)',
          filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.3))'
        }}
      >
        {/* Clip/Hook at top */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '50px',
          height: '40px',
          background: 'linear-gradient(145deg, #4a4a5a, #888)',
          borderRadius: '50% 50% 40% 40%',
          boxShadow: '0 6px 12px rgba(0,0,0,0.6), inset 0 -2px 8px rgba(0,0,0,0.4)',
          border: '2px solid rgba(255,255,255,0.2)',
          zIndex: 1
        }}>
          {/* Hole in clip */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '10px',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '50%',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
          }} />
        </div>

        {/* Card Content */}
        <div style={{ padding: 'clamp(30px, 8vw, 50px) clamp(20px, 6vw, 35px) 40px', position: 'relative', zIndex: 1 }}>
          {/* Top header bar - Larger */}
          <div style={{
            width: '100%',
            height: 'clamp(50px, 12vw, 70px)',
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(220, 38, 38, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Shimmer effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shimmer 3s infinite'
            }} />
          </div>
          
          {/* Middle section - Profile/Info area */}
          <div style={{
            width: '92%',
            height: 'clamp(80px, 15vw, 100px)',
            background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
            borderRadius: '12px',
            margin: '0 auto 24px',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 3s 0.5s infinite'
            }} />
          </div>
          
          {/* Bottom bar - Footer */}
          <div style={{
            width: '85%',
            height: 'clamp(40px, 8vw, 50px)',
            background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
            borderRadius: '12px',
            margin: '0 auto 16px',
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
          }} />
          
          {/* Small accent bar at bottom */}
          <div style={{
            width: '70%',
            height: 'clamp(25px, 5vw, 30px)',
            background: 'linear-gradient(135deg, #fb7185 0%, #fda4af 100%)',
            borderRadius: '8px',
            margin: '0 auto',
            boxShadow: '0 2px 8px rgba(251, 113, 133, 0.3)'
          }} />
        </div>

        {/* Shine/Glass effect overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
          borderRadius: '24px',
          pointerEvents: 'none'
        }} />
        
        {/* Edge highlight */}
        <div style={{
          position: 'absolute',
          top: '1px',
          left: '1px',
          right: '1px',
          height: '100px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          borderRadius: '24px 24px 0 0',
          pointerEvents: 'none'
        }} />
      </div>
    </div>
  );
}

function LanyardCard() {
  const cardRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? (isDragging ? 'grabbing' : 'grab') : 'auto';
  }, [hovered, isDragging]);

  useFrame((state) => {
    if (!cardRef.current) return;

    const time = state.clock.getElapsedTime();

    if (!isDragging) {
      // Pendulum physics
      const gravity = 0.02;
      const damping = 0.98;
      const springStrength = 0.02;
      
      // Spring force
      velocityRef.current.x += -cardRef.current.position.x * springStrength;
      velocityRef.current.y += -cardRef.current.position.y * springStrength - gravity;
      
      // Apply damping
      velocityRef.current.x *= damping;
      velocityRef.current.y *= damping;
      
      // Update position
      cardRef.current.position.x += velocityRef.current.x;
      cardRef.current.position.y += velocityRef.current.y;
      
      // Rotation based on movement
      cardRef.current.rotation.z = -velocityRef.current.x * 0.5;
      cardRef.current.rotation.x = velocityRef.current.y * 0.3;
      
      // Subtle auto swing
      cardRef.current.position.x += Math.sin(time * 1.2) * 0.002;
      cardRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
    } else {
      // Smooth rotation when dragging
      cardRef.current.rotation.z = -cardRef.current.position.x * 0.3;
      cardRef.current.rotation.x = cardRef.current.position.y * 0.2;
    }

    // Update rope/lanyard
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
    }
  });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.point.x, y: e.point.y });
    e.stopPropagation();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (isDragging && cardRef.current) {
      const deltaX = e.point.x - dragStart.x;
      const deltaY = e.point.y - dragStart.y;
      
      cardRef.current.position.x = Math.max(-1.5, Math.min(1.5, deltaX * 2));
      cardRef.current.position.y = Math.max(-1.5, Math.min(1, deltaY * 2));
      
      velocityRef.current = {
        x: deltaX * 0.1,
        y: deltaY * 0.1
      };
    }
  };

  return (
    <group ref={groupRef}>
      <LanyardRope 
        cardPosition={cardRef.current ? cardRef.current.position : { x: 0, y: -1, z: 0 }}
      />
      
      <group
        ref={cardRef}
        position={[0, -1, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <CardModel />
      </group>
    </group>
  );
}

function CardModel() {
  // Hanya gunakan fallback card tanpa GLB untuk menghindari error
  return (
    <group scale={0.8}>
      {/* Main card body */}
      <mesh>
        <boxGeometry args={[1.6, 2.2, 0.05]} />
        <meshPhysicalMaterial
          color="#0f0f1e"
          clearcoat={1}
          clearcoatRoughness={0.15}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      
      {/* Top accent bar */}
      <mesh position={[0, 0.7, 0.03]}>
        <boxGeometry args={[1.3, 0.35, 0.01]} />
        <meshStandardMaterial 
          color="#6366f1" 
          emissive="#6366f1"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Middle accent */}
      <mesh position={[0, 0.1, 0.03]}>
        <boxGeometry args={[1.1, 0.55, 0.01]} />
        <meshStandardMaterial 
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Bottom accent */}
      <mesh position={[0, -0.5, 0.03]}>
        <boxGeometry args={[0.9, 0.25, 0.01]} />
        <meshStandardMaterial 
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Clip at top */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshStandardMaterial 
          color="#888888" 
          metalness={1}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function LanyardRope({ cardPosition }) {
  const ropeSegments = 20;
  const points = [];
  
  for (let i = 0; i <= ropeSegments; i++) {
    const t = i / ropeSegments;
    const x = cardPosition.x * t;
    const y = 2.5 - (3.5 * t) + Math.sin(t * Math.PI) * 0.2 * Math.abs(cardPosition.x);
    const z = cardPosition.z * t;
    points.push(new THREE.Vector3(x, y, z));
  }
  
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, ropeSegments, 0.02, 8, false);
  
  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial 
        color="#6366f1" 
        emissive="#6366f1"
        emissiveIntensity={0.2}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
}
