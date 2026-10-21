'use client';

import { useEffect, useRef } from 'react';

// The site background: slowly marbling ink with bundles of music-wave lines flowing through it.
// The waves swell on a 120 BPM beat (the booth's tempo), ripple as you scroll, and a soft glow
// follows the cursor. Plain WebGL, one full-screen shader. Light and dark get their own palettes;
// with reduced motion it draws a single still frame; without WebGL the plain page colour shows.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uDark;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;

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
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= .5;
  }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float t = uTime;

  // Ink: domain-warped noise, slowly marbling
  vec2 q = vec2(fbm(uv * 1.4 + vec2(0., t * .03)), fbm(uv * 1.4 + vec2(5.2, 1.3) - t * .025));
  float ink = fbm(uv * 2.2 + 1.6 * q + vec2(t * .02, -uScroll * .15));
  vec3 col = mix(uBg, uInk, smoothstep(.45, .95, ink) * mix(.7, .9, uDark));

  // A soft glow that follows the cursor
  float md = length(uv - vec2(uMouse.x * aspect, uMouse.y));
  float bloom = exp(-md * md * 14.);
  col = mix(mix(col, uB, .1 * bloom), col + uB * .16 * bloom, uDark);

  // Music waves: bundles of lines that flow across, swell on the beat and ripple with the ink
  float beat = pow(1. - fract(t * 2.), 3.);
  float px = 1.6 / uRes.y;
  for (int b = 0; b < 2; b++) {
    float fb = float(b);
    float centre = fb < .5 ? .3 : .76;
    float strength = fb < .5 ? 1. : .45;
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float k = fi / 6.;
      float x = uv.x + fb * 3.1;
      float env = .55 + .45 * sin(x * 1.3 - t * .4 + fi * .35);
      env *= .7 + .6 * noise(vec2(x * 3. - t * .6, fi + fb * 7.));
      float amp = (.032 + .022 * beat) * env;
      float y = centre + (k - .5) * .075
        + amp * sin(x * (7. + fi * .9) - t * (1.1 + fi * .14) + fi * 1.3 + uScroll * .8)
        + (q.x - .5) * .09;
      float d = abs(uv.y - y);
      float line = 1. - smoothstep(0., px * (1. + .7 * k), d);
      float glow = exp(-d * 85.) * .32;
      vec3 lc = k < .5 ? mix(uA, uB, k * 2.) : mix(uB, uC, k * 2. - 1.);
      float a = (line * .85 + glow) * strength;
      col = mix(mix(col, lc, a * .42), col + lc * a * .55, uDark);
    }
  }

  gl_FragColor = vec4(col, 1.);
}`;

type Palette = { bg: number[]; ink: number[]; a: number[]; b: number[]; c: number[] };
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const PALETTES: Record<'light' | 'dark', Palette> = {
  light: { bg: hex('#f3f1ec'), ink: hex('#dedbea'), a: hex('#3557e8'), b: hex('#8a4fd8'), c: hex('#e5484d') },
  dark: { bg: hex('#121211'), ink: hex('#1f1c38'), a: hex('#5b7cff'), b: hex('#b36bff'), c: hex('#f2c94c') },
};

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
    const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uScroll = u('uScroll'), uDark = u('uDark');
    const uBg = u('uBg'), uInk = u('uInk'), uA = u('uA'), uB = u('uB'), uC = u('uC');

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 };
    let frame = 0;
    const start = performance.now();

    const setTheme = () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      const p = PALETTES[dark ? 'dark' : 'light'];
      gl.uniform1f(uDark, dark ? 1 : 0);
      gl.uniform3fv(uBg, p.bg);
      gl.uniform3fv(uInk, p.ink);
      gl.uniform3fv(uA, p.a);
      gl.uniform3fv(uB, p.b);
      gl.uniform3fv(uC, p.c);
    };

    const resize = () => {
      // Rendered a little under full resolution: soft ink doesn't need every pixel.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (innerWidth < 700 ? 0.6 : 0.75);
      canvas.width = Math.round(innerWidth * scale);
      canvas.height = Math.round(innerHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
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
      mouse.tx = e.clientX / innerWidth;
      mouse.ty = 1 - e.clientY / innerHeight;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(loop);
    };
    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };
    const themeObserver = new MutationObserver(() => {
      setTheme();
      if (reduced) draw(0);
    });

    setTheme();
    resize();
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', onResize);
    if (reduced) {
      draw(0);
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
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
