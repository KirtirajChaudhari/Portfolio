"use client";

import { useRef, useState, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useTexture, Decal } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { Physics, RigidBody, BallCollider, CylinderCollider } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { Reveal } from "../Reveal";

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

/*
 * Dual-highlight cinematic glass (user spec): every sphere keeps a white
 * translucent base with a sharp pure-white specular; a skill-category
 * Fresnel rim tints only the edges so the logo stays legible.
 */
const RIM = {
  aiml: "#bb86fc", // Neon Amethyst — AI/ML core
  python: "#306998", // Sapphire Blue — Python backend logic
  react: "#61dafb", // Electric Cyan — React & Next.js interfaces
  data: "#4db33d", // Emerald Green — Django & database architecture
  fastapi: "#00d4c0", // Iridescent Teal — FastAPI services
} as const;

const SKILLS = [
  // AI/ML Core
  { name: "PyTorch", icon: "/skills/pytorch.png", rim: RIM.aiml },
  { name: "TensorFlow", icon: "/skills/Tensorflow_logo.svg.webp", rim: RIM.aiml },
  { name: "scikit-learn", icon: "/skills/scikit learn.webp", rim: RIM.aiml },
  { name: "OpenCV", icon: "/skills/38-384674_opencv-logo-png-transparent-png.png", rim: RIM.aiml },
  { name: "pandas", icon: "/skills/pandas.png", rim: RIM.aiml },
  { name: "NumPy", icon: "/skills/numpy.png", rim: RIM.aiml },
  { name: "Neo4j", icon: "/skills/neo4j.png", rim: RIM.data },
  { name: "XGBoost", icon: "/skills/66d8691e2943609aef09f8ee_xgboost.png", rim: RIM.aiml },
  { name: "YOLO", icon: "/skills/yolo.jpg", rim: RIM.aiml },
  { name: "GradCAM", icon: "/skills/gradcam.png", rim: RIM.aiml },

  // Python & C++
  { name: "Python", icon: "/skills/Python-logo.png", rim: RIM.python },
  { name: "C++", icon: "/skills/ISO_C++_Logo.svg.webp", rim: RIM.python },

  // React & Next.js
  { name: "Next.js", icon: `${DEVICON}/nextjs/nextjs-original.svg`, rim: RIM.react },
  { name: "React", icon: `${DEVICON}/react/react-original.svg`, rim: RIM.react },
  { name: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg`, rim: RIM.react },
  { name: "JavaScript", icon: `${DEVICON}/javascript/javascript-original.svg`, rim: RIM.react },

  // Django & databases
  { name: "Django", icon: "/skills/django.jpeg", rim: RIM.data },
  { name: "MongoDB", icon: "/skills/mongodb-logo-png_seeklogo-481256.png", rim: RIM.data },
  { name: "PostgreSQL", icon: "/skills/Postgresql_elephant.svg", rim: RIM.data },
  { name: "MySQL", icon: "/skills/logo-mysql-mysql-logo-png-images-are-download-crazypng-21.png", rim: RIM.data },

  // FastAPI
  { name: "FastAPI", icon: "/skills/fastapi.png", rim: RIM.fastapi },

  // Tools
  { name: "Git", icon: `${DEVICON}/git/git-original.svg`, rim: RIM.python },
];

/* ——— Fresnel rim shader (edge-only color, additive) ——— */
const RIM_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const RIM_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.0);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;

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
  index,
  isActive,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
}: {
  skill: (typeof SKILLS)[number];
  index: number;
  isActive: boolean;
  vec?: THREE.Vector3;
  r?: typeof THREE.MathUtils.randFloatSpread;
}) {
  const api = useRef<RapierRigidBody>(null);

  // Deterministic per-instance scale (index-seeded — render must stay pure)
  const scale = useMemo(() => [1.2, 1.6, 1.4, 1.6, 1.6][index % 5], [index]);
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 64, 64), []);

  // colorSpace is set in the loader callback — mutating a hook-returned
  // value in render/effects trips the react compiler's immutability rule.
  const texture = useTexture(skill.icon, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  });

  // Skill-specific Fresnel rim — colored edges only, logo center stays clean.
  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: RIM_VERTEX,
        fragmentShader: RIM_FRAGMENT,
        uniforms: {
          uColor: { value: new THREE.Color(skill.rim) },
          uIntensity: { value: 0.85 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [skill.rim]
  );
  // Fixed square decal — reading texture.image during render is impure
  // (react-hooks/immutability) and the logos are near-square anyway.
  const decalScaleX = 1.2;
  const decalScaleY = 1.2;

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
        {/* White translucent glass base + sharp pure-white specular */}
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.04}
          metalness={0.1}
          roughness={0.04}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
          transmission={0.95}
          thickness={1.5}
          ior={1.5}
          specularIntensity={1.25}
          specularColor="#ffffff"
          envMapIntensity={2.0}
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[0, 0, 0]}
          scale={[decalScaleX, decalScaleY, 1.2]}
        >
          <meshBasicMaterial map={texture} transparent polygonOffset polygonOffsetFactor={-1} depthWrite={false} />
        </Decal>
        <Decal
          position={[0, 0, -1]}
          rotation={[0, Math.PI, 0]}
          scale={[decalScaleX, decalScaleY, 1.2]}
        >
          <meshBasicMaterial map={texture} transparent polygonOffset polygonOffsetFactor={-1} depthWrite={false} />
        </Decal>
        {/* Fresnel rim shell — additive colored edge light */}
        <mesh geometry={sphereGeometry} scale={1.02} material={rimMaterial} />
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
          <SkillSphere key={`${skill.name}-${i}`} skill={skill} index={i} isActive={isActive} />
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
