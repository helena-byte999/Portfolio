'use client';

import { useEffect, useRef } from 'react';

// The site background, after her reference: glossy ribbons sweeping in curves (blue → violet →
// red → magenta) over a field of tiny stars, slowly flowing. They part around the cursor so you
// can never quite touch them, and when a playlist is playing (<html data-music="playing">) the
// whole thing sparks up: more stars, sparks running along the ribbon edges, and a pulse on the
// beat. White page in light mode, black in dark. Plain WebGL, one full-screen shader; a still frame
// with reduced motion; the plain page colour without WebGL.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uDark;
uniform float uPlay;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0., a = .5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= .5;
  }
  return v;
}

// Ribbon colours by distance from the swirl's centre: violet near it, then magenta, red,
// violet again and blue on the far side, like the reference.
vec3 palette(float h) {
  vec3 violet = vec3(.48, .17, .94);
  vec3 magenta = vec3(.89, .23, .85);
  vec3 red = vec3(.9, .2, .17);
  vec3 blue = vec3(.18, .17, 1.);
  h = clamp(h, 0., 1.) * 4.;
  if (h < 1.) return mix(violet, magenta, h);
  if (h < 2.) return mix(magenta, red, h - 1.);
  if (h < 3.) return mix(red, violet, h - 2.);
  return mix(violet, blue, h - 3.);
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float t = uTime;
  float play = uPlay;
  float beat = pow(1. - fract(t * 2.), 3.);

  // The cursor pushes the field away, so the ribbons part around it
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  vec2 dm = uv - m;
  vec2 p = uv + normalize(dm + 1e-5) * .075 * exp(-dot(dm, dm) / .02);

  // Concentric curves around a point off the bottom-right, warped by slow noise, flowing outwards
  float n = fbm(p * 1.1 + vec2(t * .03, -t * .02 + uScroll * .12));
  vec2 c = vec2(aspect * 1.08, -.55);
  float r = length(p - c) + (n - .5) * .3;
  float x = r * 5.4 - t * (.05 + .07 * play);
  float id = floor(x);
  float f = fract(x);
  float rnd = hash(vec2(id, 7.3));
  float rnd2 = hash(vec2(id, 1.9));

  // Each ribbon: its own width and brightness, darker inside, a bright rim on its outer edge
  float width = .28 + .5 * rnd;
  float inBand = smoothstep(0., .035, f) * (1. - smoothstep(width - .035, width, f));
  float shade = mix(.22, 1., smoothstep(0., 1., f / width));
  float rim = exp(-pow((f - (width - .05)) / .028, 2.));
  float level = (.35 + .65 * rnd2) * (1. + play * (.25 + .55 * beat));
  vec3 rc = palette((r - .35) / 2. + (rnd - .5) * .08);

  // Stars, more of them (and twinkling harder) while music plays
  vec2 g = gl_FragCoord.xy / 3.;
  float hs = hash(floor(g));
  float star = step(mix(.992, .972, play), hs) * smoothstep(.5, 0., length(fract(g) - .5));
  star *= .45 + .55 * sin(t * (2. + hs * 7.) + hs * 40.);

  // Sparks running along the ribbon rims while music plays
  float spark = rim * inBand * step(.82, noise(vec2(p.x * 38. - t * 7., id * 3.1))) * play;

  vec3 col;
  if (uDark > .5) {
    col = rc * inBand * shade * level * .5;
    col += mix(rc, vec3(1.), .35) * rim * inBand * level * (.55 + .5 * play);
    col += vec3(.92, .86, 1.) * max(star, 0.) * (.55 + .9 * play);
    col += vec3(1., .85, 1.) * spark * 1.4;
  } else {
    col = vec3(1.);
    col = mix(col, rc, inBand * shade * level * .3);
    col = mix(col, rc, rim * inBand * level * (.38 + .3 * play));
    col = mix(col, rc, max(star, 0.) * (.35 + .5 * play));
    col = mix(col, mix(rc, vec3(1.), .2), spark * .9);
  }
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
    const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uScroll = u('uScroll'), uDark = u('uDark'), uPlay = u('uPlay');

    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Starts far off-screen, so nothing bends until a mouse moves (and never on touch screens).
    const mouse = { x: -5, y: -5, tx: -5, ty: -5 };
    let play = 0;
    let frame = 0;
    const start = performance.now();

    const setTheme = () => gl.uniform1f(uDark, root.dataset.theme === 'dark' ? 1 : 0);

    const resize = () => {
      // Rendered a little under full resolution: soft ribbons don't need every pixel.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (innerWidth < 700 ? 0.6 : 0.75);
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
    // Theme switches, and music starting or stopping (redrawn here when nothing is animating)
    const rootObserver = new MutationObserver(() => {
      setTheme();
      if (reduced) draw(0);
    });

    setTheme();
    resize();
    rootObserver.observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-music'] });
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
