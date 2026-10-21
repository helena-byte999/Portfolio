'use client';

import { useEffect, useRef } from 'react';

// The site background: a deep field of tiny sparkles on black, in three slowly drifting layers.
// The stars shy away from the cursor (you can never quite touch them), and when a playlist is
// playing (<html data-music="playing">) the field sparks up: more stars, LEGO-coloured sparkles
// that pulse on the beat, and the odd shooting star. Plain WebGL, one full-screen shader; a still
// frame with reduced motion; plain black without WebGL.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uPlay;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// LEGO yellow, blue, red, green
vec3 lego(float h) {
  if (h < .25) return vec3(1., .82, .3);
  if (h < .5) return vec3(.3, .49, 1.);
  if (h < .75) return vec3(.9, .28, .3);
  return vec3(.31, .69, .36);
}

// One layer of stars on a grid: each cell may hold a star at a random spot
vec3 stars(vec2 uv, float scale, float density, float t, float play, float seed) {
  vec2 g = uv * scale;
  vec2 id = floor(g);
  vec2 f = fract(g) - .5;
  float h = hash(id + seed);
  if (h > density) return vec3(0.);
  vec2 off = vec2(hash(id + seed + 3.1), hash(id + seed + 7.7)) - .5;
  float d = length(f - off * .7);
  float size = .045 + .09 * hash(id + seed + 1.3);
  float tw = .55 + .45 * sin(t * (1.5 + h * 6.) + h * 60.);
  float core = smoothstep(size, 0., d);
  // A cross-shaped glint on the bigger ones
  vec2 q = abs(f - off * .7);
  float glint = (smoothstep(.012, 0., q.x) + smoothstep(.012, 0., q.y)) * smoothstep(.35, 0., d) * step(.75, hash(id + seed + 9.));
  float bright = (core + glint * .6) * tw;
  // While music plays some stars take a LEGO colour and pulse on the beat
  float beat = pow(1. - fract(t * 2.), 3.);
  float coloured = step(.55, hash(id + seed + 5.)) * play;
  vec3 c = mix(vec3(1., .97, .92), lego(hash(id + seed + 11.)), coloured);
  return c * bright * (1. + play * (.6 + 1.2 * beat * coloured));
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float t = uTime;
  float play = uPlay;

  // Stars near the cursor are pushed away from it
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  vec2 dm = uv - m;
  vec2 push = normalize(dm + 1e-5) * .06 * exp(-dot(dm, dm) / .015);

  vec3 col = vec3(0.);
  // Far, middle and near layers drift at different speeds (and with scroll), for depth
  col += stars(uv + push * .4 + vec2(t * .004, uScroll * .05), 70., mix(.2, .38, play), t, play, 1.) * .55;
  col += stars(uv + push * .8 + vec2(t * .008, uScroll * .1), 38., mix(.12, .26, play), t, play, 17.) * .8;
  col += stars(uv + push + vec2(t * .014, uScroll * .18), 18., mix(.07, .16, play), t, play, 41.);

  // Shooting stars while music plays
  float cycle = floor(t / 2.6);
  float ph = fract(t / 2.6);
  vec2 start = vec2(hash(vec2(cycle, 1.)) * aspect, .55 + .45 * hash(vec2(cycle, 2.)));
  vec2 dir = normalize(vec2(-.8, -.45));
  vec2 head = start + dir * ph * 1.4;
  vec2 rel = uv - head;
  float along = dot(rel, -dir);
  float across = abs(dot(rel, vec2(-dir.y, dir.x)));
  float trail = smoothstep(.003, 0., across) * smoothstep(.25, 0., along) * step(0., along) * smoothstep(1., .6, ph);
  col += vec3(1., .92, .75) * trail * play * step(.35, hash(vec2(cycle, 3.)));

  gl_FragColor = vec4(col, 1.);
}`;

export default function WaveBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uScroll = u('uScroll'), uPlay = u('uPlay');

    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Starts far off-screen, so nothing moves aside until a mouse moves (and never on touch screens).
    const mouse = { x: -5, y: -5, tx: -5, ty: -5 };
    let play = 0;
    let frame = 0;
    const start = performance.now();

    const resize = () => {
      // Full resolution on small screens would be wasted on tiny stars; cap the pixel ratio.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(innerWidth * scale);
      canvas.height = Math.round(innerHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      // Ease into and out of the "music playing" look
      const target = root.dataset.music === 'playing' ? 1 : 0;
      play = reduced ? target : play + (target - play) * 0.04;
      gl.uniform1f(uPlay, play);
      gl.uniform1f(uTime, reduced ? 12 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, window.scrollY / Math.max(1, innerHeight));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      // Jump straight to the cursor on first contact rather than sweeping in from off-screen.
      if (mouse.x < -1) {
        mouse.x = e.clientX / innerWidth;
        mouse.y = 1 - e.clientY / innerHeight;
      }
      mouse.tx = e.clientX / innerWidth;
      mouse.ty = 1 - e.clientY / innerHeight;
    };
    const onLeave = () => {
      mouse.tx = mouse.ty = mouse.x = mouse.y = -5;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(loop);
    };
    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };
    // Music starting or stopping (redrawn here when nothing is animating)
    const rootObserver = new MutationObserver(() => reduced && draw(0));

    resize();
    rootObserver.observe(root, { attributes: true, attributeFilter: ['data-music'] });
    window.addEventListener('resize', onResize);
    if (reduced) {
      draw(0);
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      root.addEventListener('pointerleave', onLeave);
      document.addEventListener('visibilitychange', onVisibility);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      rootObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
    />
  );
}
