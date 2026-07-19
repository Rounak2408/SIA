"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = clock.elapsedTime * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -20]} scale={[40, 40, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#4a1a7a"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function GalaxyParticles() {
  const count = 3000;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 25 + 5;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius - 15;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffd700"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Meteors() {
  const groupRef = useRef<THREE.Group>(null);
  const meteors = useMemo(
    () =>
      Array.from({ length: 8 }, () => ({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 20 + 5,
        z: -Math.random() * 30 - 10,
        speed: Math.random() * 0.15 + 0.08,
      })),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.x -= meteors[i].speed;
      child.position.y -= meteors[i].speed * 0.5;
      if (child.position.x < -30) {
        child.position.x = 30;
        child.position.y = Math.random() * 20 + 5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {meteors.map((m, i) => (
        <mesh key={i} position={[m.x, m.y, m.z]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.02, 0.02, 1.5]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraFlythrough({ onComplete }: { onComplete: () => void }) {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const completed = useRef(false);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    camera.position.z = 8 - t * 1.2;
    camera.position.y = Math.sin(t * 0.3) * 0.5;
    camera.position.x = Math.sin(t * 0.2) * 0.8;
    camera.lookAt(0, 0, -10);

    if (t > 22 && !completed.current) {
      completed.current = true;
      onComplete();
    }
  });

  return null;
}

interface SpaceSceneProps {
  onComplete: () => void;
}

function SpaceContent({ onComplete }: SpaceSceneProps) {
  return (
    <>
      <color attach="background" args={["#000005"]} />
      <fog attach="fog" args={["#000005", 10, 60]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffd700" />
      <Stars
        radius={100}
        depth={60}
        count={8000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <GalaxyParticles />
      <Nebula />
      <Sparkles count={200} scale={30} size={2} speed={0.3} color="#ffd700" />
      <Meteors />
      <CameraFlythrough onComplete={onComplete} />
    </>
  );
}

export function SpaceScene({ onComplete }: SpaceSceneProps) {
  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <SpaceContent onComplete={onComplete} />
      </Canvas>
    </div>
  );
}
