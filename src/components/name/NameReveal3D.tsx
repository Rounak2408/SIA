"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  Text3D,
  Float,
  Sparkles,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { FULL_NAME, SHORT_NAME } from "@/lib/constants";

function GatheringParticles({
  targetPositions,
  progress,
}: {
  targetPositions: Float32Array;
  progress: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const count = targetPositions.length / 3;

  const startPositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 15 + Math.random() * 20;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(() => {
    if (!ref.current) return;
    const eased = 1 - Math.pow(1 - progress, 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] =
        startPositions[i * 3] +
        (targetPositions[i * 3] - startPositions[i * 3]) * eased;
      positions[i * 3 + 1] =
        startPositions[i * 3 + 1] +
        (targetPositions[i * 3 + 1] - startPositions[i * 3 + 1]) * eased;
      positions[i * 3 + 2] =
        startPositions[i * 3 + 2] +
        (targetPositions[i * 3 + 2] - startPositions[i * 3 + 2]) * eased;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffd700"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

const goldMaterial = (
  <meshPhysicalMaterial
    color="#ffd700"
    emissive="#ffaa00"
    emissiveIntensity={0.8}
    metalness={1}
    roughness={0.15}
    clearcoat={1}
    clearcoatRoughness={0.1}
  />
);

function GoldText3D({ text, size }: { text: string; size: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.12;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={size}
          height={0.35}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.02}
          bevelSegments={5}
        >
          {text}
          {goldMaterial}
        </Text3D>
      </Center>
    </group>
  );
}

function NameTextReveal({
  visible,
  namePhase,
}: {
  visible: boolean;
  namePhase: "full" | "transition" | "short";
}) {
  const fullRef = useRef<THREE.Group>(null);
  const shortRef = useRef<THREE.Group>(null);
  const transitionRef = useRef(0);

  useFrame((_, delta) => {
    if (!visible) return;

    if (namePhase === "transition") {
      transitionRef.current = Math.min(transitionRef.current + delta * 0.7, 1);
    }

    const t = transitionRef.current;
    const fullOpacity =
      namePhase === "full" ? 1 : namePhase === "transition" ? 1 - t : 0;
    const fullScale =
      namePhase === "full" ? 1 : namePhase === "transition" ? 1 - t * 0.35 : 0;
    const shortOpacity =
      namePhase === "short" ? 1 : namePhase === "transition" ? t : 0;
    const shortScale =
      namePhase === "short" ? 1 : namePhase === "transition" ? 0.65 + t * 0.35 : 0;

    if (fullRef.current) {
      fullRef.current.scale.setScalar(Math.max(fullScale, 0.001));
      fullRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshPhysicalMaterial;
          mat.opacity = fullOpacity;
          mat.transparent = true;
        }
      });
    }

    if (shortRef.current) {
      shortRef.current.scale.setScalar(Math.max(shortScale, 0.001));
      shortRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshPhysicalMaterial;
          mat.opacity = shortOpacity;
          mat.transparent = true;
        }
      });
    }
  });

  if (!visible) return null;

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group>
        <group ref={fullRef}>
          <GoldText3D text={FULL_NAME} size={0.72} />
        </group>
        <group ref={shortRef}>
          <GoldText3D text={SHORT_NAME} size={1.35} />
        </group>
        <Sparkles count={80} scale={8} size={3} speed={0.4} color="#ffd700" />
        <pointLight position={[0, 2, 4]} intensity={2} color="#ffd700" />
        <pointLight position={[-3, -1, 2]} intensity={1} color="#ffffff" />
      </group>
    </Float>
  );
}

function OrbitCamera() {
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * 0.2;
    camera.position.x = Math.sin(t) * 4;
    camera.position.z = Math.cos(t) * 4 + 2;
    camera.position.y = 1 + Math.sin(t * 0.5) * 0.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function NameSceneContent({
  progress,
  showText,
  namePhase,
  onComplete,
}: {
  progress: number;
  showText: boolean;
  namePhase: "full" | "transition" | "short";
  onComplete: () => void;
}) {
  const shortPhaseStart = useRef<number | null>(null);
  const completed = useRef(false);

  const targetPositions = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 * 8;
      const radius = 2 + (i % 20) * 0.05;
      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.3;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (namePhase === "short") {
      if (shortPhaseStart.current === null) {
        shortPhaseStart.current = 0;
      }
      shortPhaseStart.current += delta;
      if (shortPhaseStart.current > 5 && !completed.current) {
        completed.current = true;
        onComplete();
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#000008"]} />
      <fog attach="fog" args={["#000008", 8, 40]} />
      <ambientLight intensity={0.1} />
      <Environment preset="night" />
      <GatheringParticles
        targetPositions={targetPositions}
        progress={progress}
      />
      <NameTextReveal visible={showText} namePhase={namePhase} />
      <OrbitCamera />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

interface NameReveal3DProps {
  onComplete: () => void;
}

export function NameReveal3D({ onComplete }: NameReveal3DProps) {
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [namePhase, setNamePhase] = useState<"full" | "transition" | "short">(
    "full"
  );

  useEffect(() => {
    let start: number | null = null;
    const duration = 5000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const p = Math.min((timestamp - start) / duration, 1);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
        setShowText(true);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!showText) return;

    const toTransition = setTimeout(() => setNamePhase("transition"), 3200);
    const toShort = setTimeout(() => setNamePhase("short"), 4800);

    return () => {
      clearTimeout(toTransition);
      clearTimeout(toShort);
    };
  }, [showText]);

  return (
    <div className="absolute inset-0 z-10">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <NameSceneContent
            progress={progress}
            showText={showText}
            namePhase={namePhase}
            onComplete={onComplete}
          />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
