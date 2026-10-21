'use client';

import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PADS } from '@/content/site';
import { FIGURE } from './figure';

/** Shared, mutable state between the DOM pads and the scene; read every frame, never re-renders. */
export type BoothSignal = { hover: number; flash: number; flashAt: number };

type Props = {
  signal: React.RefObject<BoothSignal>;
  roles: readonly string[];
  onPad: (index: number) => void;
  onReady: () => void;
  running: boolean;
};

const BPM = 120;
const FIG_H = 3.6; // world height of LEGO-you
const FIG_TOP = 4.0;
const FIG_Z = -1.05;
const DESK_TOP = 1.3;
const DESK_W = 6.2;
const CHARCOAL = '#2b2b2e';
const CREAM = '#ebe7de';
const LCD_GREEN = '#9be36a';
const now = () => performance.now() / 1000;

/** 0→1 envelope that spikes on every beat and decays before the next. */
const kick = (t: number) => Math.pow(1 - ((t * BPM) / 60) % 1, 4);

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d')!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const cssFont = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

// The LCD types each role, holds it, backspaces, then moves on to the next.
const TYPE = 0.07;
const HOLD = 1.8;
const ERASE = 0.035;
const GAP = 0.35;

function typedAt(roles: readonly string[], t: number) {
  const spans = roles.map((r) => r.length * (TYPE + ERASE) + HOLD + GAP);
  let x = t % spans.reduce((a, b) => a + b, 0);
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i].toUpperCase();
    if (x < spans[i]) {
      if (x < role.length * TYPE) return role.slice(0, Math.ceil(x / TYPE));
      x -= role.length * TYPE;
      if (x < HOLD) return role;
      x -= HOLD;
      if (x < role.length * ERASE) return role.slice(0, role.length - Math.floor(x / ERASE));
      return '';
    }
    x -= spans[i];
  }
  return '';
}

function Figure() {
  const [bodyTex, headTex] = useLoader(THREE.TextureLoader, ['/booth/ena-body.webp', '/booth/ena-head.webp']);
  for (const t of [bodyTex, headTex]) t.colorSpace = THREE.SRGBColorSpace;

  const k = FIG_H / FIGURE.height;
  const w = FIGURE.width * k;
  const bodyH = (FIGURE.height - FIGURE.bodyTop) * k;
  const headH = FIGURE.headHeight * k;
  const pivotY = FIG_TOP - FIGURE.bodyTop * k;
  const pivotX = (FIGURE.neckX - FIGURE.width / 2) * k; // neck sits left of the layer's centre (the record widens it)

  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const beat = (t * BPM) / 60;
    const hit = kick(t);
    body.current!.position.y = -0.045 * hit;
    body.current!.rotation.z = Math.sin(beat * Math.PI) * 0.012;
    head.current!.rotation.x = 0.13 * hit;
    head.current!.rotation.z = Math.sin(beat * Math.PI) * 0.035;
    head.current!.rotation.y = THREE.MathUtils.lerp(head.current!.rotation.y, pointer.x * 0.22, 0.08);
  });

  return (
    <group position={[-pivotX, 0, FIG_Z]}>
      <group ref={body}>
        <mesh position={[0, pivotY - bodyH / 2, 0]} renderOrder={1}>
          <planeGeometry args={[w, bodyH]} />
          <meshBasicMaterial map={bodyTex} transparent toneMapped={false} depthWrite={false} />
        </mesh>
        <group ref={head} position={[pivotX, pivotY, 0.01]}>
          <mesh position={[-pivotX, FIG_TOP - pivotY - headH / 2, 0]} renderOrder={2}>
            <planeGeometry args={[w, headH]} />
            <meshBasicMaterial map={headTex} transparent toneMapped={false} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Deck({ x, label, signal }: { x: number; label: string; signal: React.RefObject<BoothSignal> }) {
  const platter = useRef<THREE.Group>(null);
  const vinyl = useMemo(
    () =>
      canvasTexture(512, 512, (ctx) => {
        ctx.fillStyle = '#0b0b0e';
        ctx.beginPath();
        ctx.arc(256, 256, 256, 0, Math.PI * 2);
        ctx.fill();
        for (let r = 90; r < 250; r += 5) {
          ctx.strokeStyle = r % 15 === 0 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)';
          ctx.beginPath();
          ctx.arc(256, 256, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = label;
        ctx.beginPath();
        ctx.arc(256, 256, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#161616';
        ctx.font = `700 22px ${cssFont('--font-display', 'sans-serif')}`;
        ctx.textAlign = 'center';
        ctx.fillText('SIDE A', 256, 222);
        ctx.font = `600 16px ${cssFont('--font-display', 'sans-serif')}`;
        ctx.fillText('33 ⅓ RPM', 256, 306);
        ctx.beginPath();
        ctx.arc(256, 256, 7, 0, Math.PI * 2);
        ctx.fill();
      }),
    [label],
  );
  const speed = useRef(3.49); // 33⅓ rpm

  useFrame((_, delta) => {
    const since = now() - signal.current!.flashAt;
    const target = since < 0.35 ? -9 : 3.49; // a quick scratch when a pad is hit
    speed.current = THREE.MathUtils.lerp(speed.current, target, 0.2);
    platter.current!.rotation.y -= speed.current * delta;
  });

  return (
    <group position={[x, DESK_TOP, 0.05]}>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[1.75, 0.14, 1.12]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.6} metalness={0.25} />
      </mesh>
      <group ref={platter} position={[-0.14, 0.17, 0]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 48]} />
          <meshStandardMaterial color="#111014" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.49, 64]} />
          <meshStandardMaterial map={vinyl} roughness={0.35} />
        </mesh>
      </group>
      <group position={[0.62, 0.2, -0.38]} rotation={[0, 0.42, 0]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 20]} />
          <meshStandardMaterial color="#c9c6c0" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.04, 0.36]}>
          <boxGeometry args={[0.035, 0.03, 0.72]} />
          <meshStandardMaterial color="#d8d5cf" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}

function Pad({ index, x, z, onPad, signal }: { index: number; x: number; z: number; onPad: Props['onPad']; signal: React.RefObject<BoothSignal> }) {
  const pad = PADS[index];
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const hover3d = useRef(false);
  const number = useMemo(
    () =>
      canvasTexture(128, 128, (ctx) => {
        ctx.fillStyle = pad.ink;
        ctx.font = `800 76px ${cssFont('--font-display', 'sans-serif')}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pad.key, 64, 70);
      }),
    [pad.key, pad.ink],
  );

  useFrame(({ clock }) => {
    const s = signal.current!;
    const hovered = hover3d.current || s.hover === index;
    const since = now() - s.flashAt;
    const flash = s.flash === index && since < 0.6 ? 2 * (1 - since / 0.6) : 0;
    const target = (hovered ? 0.9 : 0.08 + 0.18 * kick(clock.elapsedTime + index * 0.125)) + flash;
    mat.current!.emissiveIntensity = THREE.MathUtils.lerp(mat.current!.emissiveIntensity, target, 0.3);
    mesh.current!.position.y = hovered || flash > 0 ? 0.015 : 0.03;
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hover3d.current = true;
    document.body.style.cursor = 'pointer';
  };
  const out = () => {
    hover3d.current = false;
    document.body.style.cursor = '';
  };

  return (
    <group position={[x, DESK_TOP + 0.16, z]}>
      <mesh ref={mesh} onPointerOver={over} onPointerOut={out} onClick={(e) => (e.stopPropagation(), onPad(index))}>
        <boxGeometry args={[0.32, 0.06, 0.3]} />
        <meshStandardMaterial ref={mat} color={pad.color} emissive={pad.color} emissiveIntensity={0.1} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[0.26, 0.26]} />
        <meshBasicMaterial map={number} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function Mixer({ onPad, signal }: { onPad: Props['onPad']; signal: React.RefObject<BoothSignal> }) {
  return (
    <group>
      <mesh position={[0, DESK_TOP + 0.08, 0.05]}>
        <boxGeometry args={[1.32, 0.16, 1.16]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.55} metalness={0.3} />
      </mesh>
      {PADS.map((_, i) => (
        <Pad key={i} index={i} x={(i % 3 - 1) * 0.4} z={i < 3 ? -0.14 : 0.24} onPad={onPad} signal={signal} />
      ))}
      {[-0.45, -0.15, 0.15, 0.45].map((x) => (
        <mesh key={x} position={[x, DESK_TOP + 0.19, -0.42]}>
          <cylinderGeometry args={[0.055, 0.055, 0.07, 20]} />
          <meshStandardMaterial color="#d8d5cf" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, DESK_TOP + 0.165, 0.52]}>
        <boxGeometry args={[0.5, 0.012, 0.04]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.06, DESK_TOP + 0.19, 0.52]}>
        <boxGeometry args={[0.08, 0.05, 0.1]} />
        <meshStandardMaterial color="#f2c94c" />
      </mesh>
    </group>
  );
}

/** The booth body. Its front carries an LCD that types out each role in turn. */
function Desk({ roles }: { roles: readonly string[] }) {
  const lcd = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 430;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { ctx: canvas.getContext('2d')!, texture };
  }, []);
  const shown = useRef('');

  const draw = (text: string, caret: boolean) => {
    const { ctx, texture } = lcd;
    const g = ctx.createLinearGradient(0, 0, 0, 430);
    g.addColorStop(0, '#f4f1ea');
    g.addColorStop(1, '#e2ddd1');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2048, 430);

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#e5484d';
    ctx.beginPath();
    ctx.arc(1800, 97, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#161616';
    ctx.font = `700 34px ${cssFont('--font-mono', 'monospace')}`;
    ctx.textAlign = 'right';
    ctx.fillText('LIVE', 1772, 110);

    ctx.fillStyle = '#121412';
    ctx.strokeStyle = '#2c302c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(224, 150, 1600, 210, 28);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.font = `700 112px ${cssFont('--font-mono', 'monospace')}`;
    ctx.fillStyle = LCD_GREEN;
    ctx.shadowColor = 'rgba(155, 227, 106, 0.55)';
    ctx.shadowBlur = 24;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 300, 258);
    if (caret) ctx.fillRect(300 + ctx.measureText(text).width + 12, 208, 58, 100);
    ctx.restore();
    texture.needsUpdate = true;
  };

  useFrame(({ clock }) => {
    const text = typedAt(roles, clock.elapsedTime);
    const caret = Math.floor(clock.elapsedTime * 2) % 2 === 0;
    const key = `${text}|${caret}`;
    if (key !== shown.current) {
      shown.current = key;
      draw(text, caret);
    }
  });

  const studs = useMemo(() => Array.from({ length: 18 }, (_, i) => -2.98 + i * 0.35), []);

  return (
    <group>
      <mesh position={[0, DESK_TOP / 2, 0.2]}>
        <boxGeometry args={[DESK_W, DESK_TOP, 1.6]} />
        <meshStandardMaterial attach="material-0" color={CREAM} roughness={0.7} />
        <meshStandardMaterial attach="material-1" color={CREAM} roughness={0.7} />
        <meshStandardMaterial attach="material-2" color="#e4dfd4" roughness={0.6} />
        <meshStandardMaterial attach="material-3" color={CREAM} roughness={0.7} />
        <meshStandardMaterial attach="material-4" map={lcd.texture} roughness={0.55} emissive="#ffffff" emissiveMap={lcd.texture} emissiveIntensity={0.2} />
        <meshStandardMaterial attach="material-5" color={CREAM} roughness={0.7} />
      </mesh>
      {/* LEGO plate trim with studs along the front edge */}
      <mesh position={[0, DESK_TOP + 0.04, 0.86]}>
        <boxGeometry args={[DESK_W + 0.1, 0.08, 0.3]} />
        <meshStandardMaterial color="#f2c94c" roughness={0.35} />
      </mesh>
      {studs.map((x) => (
        <mesh key={x} position={[x, DESK_TOP + 0.115, 0.86]}>
          <cylinderGeometry args={[0.085, 0.085, 0.07, 24]} />
          <meshStandardMaterial color="#f2c94c" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 7, 8]} intensity={1.6} />
      <directionalLight position={[-5, 3, 2]} intensity={0.45} />
    </>
  );
}

/** Frames the booth: fits its width on narrow screens, its height on wide ones, with a little parallax. */
function Rig() {
  const { camera, size, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const aspect = size.width / size.height;
    const tan = Math.tan(THREE.MathUtils.degToRad(15));
    const halfW = aspect < 1 ? 2.75 : 3.5;
    const dist = Math.max(halfW / (tan * aspect), 2.4 / tan);
    target.set(pointer.x * 0.45, 3.9 + pointer.y * 0.18, dist);
    camera.position.lerp(target, 0.06);
    camera.lookAt(0, 2.05, 0);
  });
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

export default function BoothScene({ signal, roles, onPad, onReady, running }: Props) {
  return (
    <Canvas
      frameloop={running ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 30, position: [0, 3.9, 9], near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      onPointerMissed={() => (document.body.style.cursor = '')}
    >
      <Lights />
      <Rig />
      <Suspense fallback={null}>
        <Figure />
        <Ready onReady={onReady} />
      </Suspense>
      <Desk roles={roles} />
      <Deck x={-1.95} label="#3557e8" signal={signal} />
      <Deck x={1.95} label="#f2c94c" signal={signal} />
      <Mixer onPad={onPad} signal={signal} />
    </Canvas>
  );
}
