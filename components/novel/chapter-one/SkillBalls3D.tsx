"use client";

import { useRef, useState, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { Physics, RigidBody, BallCollider, CylinderCollider } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { Reveal } from "../Reveal";

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const SKILLS = [
  // AI/ML Core
  { name: "PyTorch", icon: "/skills/pytorch.png" },
  { name: "TensorFlow", icon: "/skills/Tensorflow_logo.svg.webp" },
  { name: "scikit-learn", icon: "/skills/scikit learn.webp" },
  { name: "OpenCV", icon: "/skills/38-384674_opencv-logo-png-transparent-png.png" },
  { name: "pandas", icon: "/skills/pandas.png" },
  { name: "NumPy", icon: "/skills/numpy.png" },
  { name: "Neo4j", icon: "/skills/neo4j.png" },
  { name: "XGBoost", icon: "/skills/66d8691e2943609aef09f8ee_xgboost.png" },
  { name: "YOLO", icon: "/skills/yolo.jpg" },
  { name: "GradCAM", icon: "/skills/gradcam.png" },
  
  // Python & C++
  { name: "Python", icon: "/skills/Python-logo.png" },
  { name: "C++", icon: "/skills/ISO_C++_Logo.svg.webp" },
  
  // React & Next.js
  { name: "Next.js", icon: `${DEVICON}/nextjs/nextjs-original.svg` },
  { name: "React", icon: `${DEVICON}/react/react-original.svg` },
  { name: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg` },
  { name: "JavaScript", icon: `${DEVICON}/javascript/javascript-original.svg` },
  
  // Django & MongoDB
  { name: "Django", icon: "/skills/django.jpeg" },
  { name: "MongoDB", icon: "/skills/mongodb-logo-png_seeklogo-481256.png" },
  { name: "PostgreSQL", icon: "/skills/Postgresql_elephant.svg" },
  { name: "MySQL", icon: "/skills/logo-mysql-mysql-logo-png-images-are-download-crazypng-21.png" },
  
  // FastAPI
  { name: "FastAPI", icon: "/skills/fastapi.png" },
  
  // Tools
  { name: "Git", icon: `${DEVICON}/git/git-original.svg` },
];

const DOUBLE_SKILLS = [...SKILLS, ...SKILLS];

/* ——— Pointer Repulsion ——— */
function Pointer({ vec = new THREE.Vector3(), isActive }: { vec?: THREE.Vector3; isActive: boolean }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

/* ——— Swarming Skill Sphere ——— */
function SkillSphere({
  skill,
  isActive,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
}: {
  skill: (typeof SKILLS)[number];
  isActive: boolean;
  vec?: THREE.Vector3;
  r?: typeof THREE.MathUtils.randFloatSpread;
}) {
  const api = useRef<RapierRigidBody>(null);
  
  // Determine scale for this sphere instance based on the reference code
  const scale = useMemo(() => [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)], []);
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 64, 64), []);
  
  const texture = useTexture(skill.icon);
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    if (api.current) {
      const impulse = vec
        .copy(api.current.translation())
        .normalize()
        .multiply(
          new THREE.Vector3(
            -50 * delta * scale,
            -150 * delta * scale,
            -50 * delta * scale
          )
        );
      api.current.applyImpulse(impulse, true);
    }
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.1}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        rotation={[0.3, 1, 1]}
      >
        <meshPhysicalMaterial
          map={texture}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.15}
          metalness={0.1}
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          transmission={0.2}
          thickness={1.5}
          ior={1.5}
        />
      </mesh>
    </RigidBody>
  );
}

/* ——— Scene ——— */
function Scene({ isActive }: { isActive: boolean }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="white"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[0, 5, -4]} intensity={2.5} />
      <pointLight position={[-10, 10, 10]} intensity={2} color="#ffffff" />

      <Physics gravity={[0, 0, 0]}>
        <Pointer isActive={isActive} />
        {DOUBLE_SKILLS.map((skill, i) => (
          <SkillSphere key={`${skill.name}-${i}`} skill={skill} isActive={isActive} />
        ))}
      </Physics>

      <Environment
        preset="city"
        environmentIntensity={0.8}
        environmentRotation={[0, 4, 2]}
      />
      <EffectComposer enableNormalPass={false}>
        <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
      </EffectComposer>
    </>
  );
}

/* ——— Static Fallback ——— */
function StaticFallback() {
  return (
    <div className="flex h-full flex-wrap content-center items-center justify-center gap-4 p-8">
      {SKILLS.map((skill) => (
        <div
          key={skill.name}
          className="skill-ball !static"
          title={skill.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={skill.icon}
            alt={skill.name}
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.dataset.fallback =
                skill.name.slice(0, 2);
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ——— Exported Component ——— */
export function SkillBalls3D() {
  const [useStatic, setUseStatic] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Set active if the container is anywhere within the viewport
        setIsActive(rect.top < window.innerHeight && rect.bottom > 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger initially
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (checkReducedMotion || useStatic) {
    return (
      <section aria-label="Skills" className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <Reveal className="mb-12">
          <span className="type-heading text-sm tracking-[0.4em] text-accent">THE TOOLKIT</span>
          <h3 className="type-heading mt-3 text-4xl uppercase text-text md:text-5xl">Skills</h3>
        </Reveal>
        <div className="relative h-[65vh] min-h-[400px] overflow-hidden rounded-xl border border-border bg-surface/40">
          <StaticFallback />
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Skills" className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <Reveal className="mb-12">
        <span className="type-heading text-sm tracking-[0.4em] text-accent">THE TOOLKIT</span>
        <h3 className="type-heading mt-3 text-4xl uppercase text-text md:text-5xl">Skills</h3>
        <p className="mt-3 text-sm text-text-muted">Hover to push them away. They swarm.</p>
      </Reveal>

      <div 
        ref={containerRef}
        className="relative h-[65vh] min-h-[400px] overflow-hidden rounded-xl border border-border bg-surface/40 cursor-crosshair"
      >
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true, stencil: false, depth: false }}
          camera={{ position: [0, 0, 25], fov: 32.5, near: 1, far: 100 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
          }}
          onError={() => setUseStatic(true)}
          className="tech-canvas"
        >
          <Suspense fallback={null}>
            <Scene isActive={isActive} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
