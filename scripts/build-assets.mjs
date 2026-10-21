// Builds the site's images from assets-src/ into public/. Run with `npm run assets`.
// - LEGO-you: tightens the Vision cut-out's edge (drops the yellow backdrop fringe), trims it,
//   and splits it at the neck so the head can nod on its own layer.
// - Work: resizes each case study's images to webp, in the order the case study shows them.
// - Kickback clips: cleans and re-encodes the lens recordings with ffmpeg (skipped when the output
//   already exists; delete it to re-encode).
// The cut-out itself comes from: swift scripts/cutout.swift assets-src/ena-lego.png assets-src/ena-lego-cutout.png
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const NECK_Y = 600; // row in the source photo just above the shoulders
const NECK_X = 510; // column through the middle of the neck: the head's pivot
const OVERLAP = 10; // head layer reaches this far into the body layer so no seam shows mid-nod

// The recordings sit in phone mock-ups whose status-bar strip came out blank white; each box
// paints one strip black (x, y, w, h in source pixels). Measured from frames of each clip.
const statusBar = (x, w, bottom) => ({ x, y: 20, w, h: bottom - 20, color: 'black' });
const CLIPS = [
  {
    // Three-step storyboard: open the camera, tap, the room drops in.
    src: 'kickback/clip-20.mp4',
    out: 'kickback-how-it-works',
    boxes: [
      statusBar(20, 298, 55),
      statusBar(451, 298, 79),
      statusBar(882, 298, 71),
      { x: 451, y: 649, w: 298, h: 6, color: 'black' }, // white line along the bottom of the screen
      { x: 882, y: 649, w: 298, h: 6, color: 'black' },
    ],
    audio: false,
    poster: 8,
  },
  {
    // Three phones exploring inside the bedroom.
    src: 'kickback/clip-4.mp4',
    out: 'kickback-inside',
    boxes: [
      statusBar(20, 298, 58),
      statusBar(623, 298, 76),
      { x: 623, y: 547, w: 298, h: 31, color: 'black' }, // blank band above the nav bar
      { x: 623, y: 650, w: 298, h: 5, color: 'black' }, // white line along the bottom of the screen
      statusBar(1203, 288, 51),
      { x: 337, y: 420, w: 7, h: 180, color: 'white' }, // stray line beside the left phone
    ],
    audio: false,
    poster: 6,
  },
  {
    // The room placed in the park, then walked through. Keeps its sound, evened out.
    src: 'kickback/clip-3.mp4',
    out: 'kickback-demo',
    boxes: [statusBar(20, 298, 71), { x: 20, y: 650, w: 298, h: 5, color: 'black' }],
    audio: true,
    poster: 5,
  },
];

async function clips() {
  await mkdir('public/work/kickback', { recursive: true });
  for (const clip of CLIPS) {
    const out = `public/work/kickback/${clip.out}.mp4`;
    if (existsSync(out)) continue;
    const draw = clip.boxes.map((b) => `drawbox=x=${b.x}:y=${b.y}:w=${b.w}:h=${b.h}:color=${b.color}:t=fill`).join(',');
    // Even out the loud burst at the end: normalise, then hard-limit peaks to about -2.5 dBFS.
    const audio = clip.audio
      ? ['-af', 'loudnorm=I=-18:TP=-1.5:LRA=11,alimiter=limit=0.75:level=false,aresample=48000', '-c:a', 'aac', '-b:a', '128k']
      : ['-an'];
    // Wide clips never show wider than ~1100px on the page.
    const video = `${draw},scale='min(1100,iw)':-2,fps=30,format=yuv420p`;
    const args = ['-v', 'error', '-y', '-i', `assets-src/${clip.src}`, '-vf', video,
      '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '28', '-movflags', '+faststart', ...audio, out];
    const run = spawnSync('ffmpeg', args, { stdio: 'inherit' });
    if (run.status !== 0) throw new Error(`ffmpeg failed on ${clip.src}`);
    // Poster: one cleaned frame, so the page shows something before the clip loads.
    const frame = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(clip.poster), '-i', out, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-']);
    await sharp(frame.stdout).webp({ quality: 82 }).toFile(`public/work/kickback/${clip.out}.webp`);
    console.log('clip', clip.out);
  }
}

const WORK = {
  // The paper's title page (rendered from the PDF at 3x with PDFKit), cropped to the title.
  'b-sides': [{ src: 'bsides/haic-p1.png', crop: { left: 240, top: 660, width: 1305, height: 900 } }],
  kickback: ['kickback/title.jpg'],
  'discovery-gap': ['captures/discovery-gap-desktop.png', 'captures/discovery-gap-phone.png'],
  ecms: ['captures/ecms-desktop.png', 'work/ecms/ecms_dashboard.png'],
  movierec: [
    'work/movierec/movierec_01_hero.png',
    'work/movierec/movierec_04_watchlist.png',
    'work/movierec/movierec_03_search.png',
    'work/movierec/movierec_02_rows.png',
  ],
  peerpods: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20].map(
    (n) => `work/peerpods/slide_${String(n).padStart(2, '0')}.png`,
  ),
  'kuda-teens': [
    '01_problem_statement', '04_market_research', '02_assumption_mapping', '03_risk_importance_graph',
    '05_parent_user_interviews', '06_teen_user_interviews', '07_key_findings', '08_moscow_framework',
    '09_value_vs_effort_map', '10_user_stories',
  ].map((f) => `work/kuda_teens/${f}.png`),
  ufit: [
    'work/UX/header_thumbnail.png',
    ...Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
      const names = ['project_overview', 'user_research', 'affinity_map', 'user_persona', 'problem_statement',
        'lightning_demo', 'brainstorming', 'lofi_wireframes_1', 'lofi_wireframes_2', 'prototype',
        'usability_testing_flow1', 'usability_testing_flow2'];
      return `work/UX/ux_${String(n).padStart(2, '0')}_${names[n - 1]}.png`;
    }),
  ],
};

async function figure() {
  const src = 'assets-src/ena-lego-cutout.png';
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const tight = await sharp(src).ensureAlpha().extractChannel(3).erode(3).blur(1).raw().toBuffer();

  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const a = Math.min(data[i * 4 + 3], tight[i]);
      data[i * 4 + 3] = a;
      // Edge pixels still carry some of the yellow backdrop; darken them into a soft outline.
      if (a < 255) {
        const k = 0.45 + 0.55 * (a / 255);
        for (let c = 0; c < 3; c++) data[i * 4 + c] = Math.round(data[i * 4 + c] * k);
      }
      if (data[i * 4 + 3] > 8) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x);
        y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
    }
  }
  const width = x1 - x0 + 1;
  const height = y1 - y0 + 1;
  const raw = { raw: { width: W, height: H, channels: 4 } };
  const webp = { quality: 90, alphaQuality: 100, effort: 6 };

  await mkdir('public/booth', { recursive: true });
  const headHeight = NECK_Y + OVERLAP - y0;
  await sharp(data, raw).extract({ left: x0, top: y0, width, height }).webp(webp).toFile('public/booth/ena-full.webp');
  await sharp(data, raw).extract({ left: x0, top: y0, width, height: headHeight }).webp(webp).toFile('public/booth/ena-head.webp');
  await sharp(data, raw).extract({ left: x0, top: NECK_Y, width, height: y1 - NECK_Y + 1 }).webp(webp).toFile('public/booth/ena-body.webp');

  const dims = { width, height, headHeight, bodyTop: NECK_Y - y0, neckX: NECK_X - x0 };
  await writeFile(
    'components/booth/figure.ts',
    `// Generated by scripts/build-assets.mjs. Pixel sizes of the LEGO-you layers in public/booth/.\n` +
      `export const FIGURE = ${JSON.stringify(dims, null, 2)} as const;\n`,
  );
  console.log('figure', dims);

  // Favicon: the head, squared up on transparent.
  const headBox = { left: 126, top: 0, width: 415, height: 386 };
  await sharp(data, raw)
    .extract({ left: x0 + headBox.left, top: y0, width: headBox.width, height: headBox.height })
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('app/icon.png');

  // Link preview card (1200×630) for LinkedIn, Slack and iMessage.
  const fig = await sharp('public/booth/ena-full.webp').resize({ height: 580 }).toBuffer();
  const text = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f3f1ec"/>
    <rect x="52" y="272" width="470" height="84" rx="4" fill="#f2c94c" transform="skewX(-12) rotate(-1.4 290 314)"/>
    <text x="64" y="250" font-family="Helvetica Neue, Arial" font-weight="800" font-size="92" fill="#161616">ENA</text>
    <text x="64" y="345" font-family="Helvetica Neue, Arial" font-weight="800" font-size="92" fill="#161616">OTUOKON</text>
    <text x="66" y="410" font-family="Helvetica Neue, Arial" font-weight="700" font-size="34" fill="#2f4be0">Product Manager · Software Engineer · DJ</text>
    <text x="66" y="460" font-family="Helvetica Neue, Arial" font-size="26" fill="#5f5b55">AI, music and consumer products · London</text>
  </svg>`;
  await sharp(Buffer.from(text))
    .composite([{ input: fig, left: 760, top: 50 }])
    .png()
    .toFile('public/booth/og.png');
}

// Organisation logos for the credentials carousel, from each organisation's own website
// (northumbria.ac.uk og:image, aun.edu.ng header logo, entrylevel.net apple-touch-icon).
// Snap, Google and Coursera come from simple-icons in the page itself.
// `wide` logos keep their full lockup (mark + name) at their own shape; the rest become squares.
const LOGOS = {
  // White crest and name on black: turn the black into transparency.
  northumbria: { src: 'logos/northumbria.png', knockOutBlack: true, wide: true },
  // Mark plus the university's name in white, already on transparency.
  aun: { src: 'logos/aun.png', wide: true },
  entrylevel: { src: 'logos/entrylevel.png' },
};

async function logos() {
  await mkdir('public/logos', { recursive: true });
  for (const [name, l] of Object.entries(LOGOS)) {
    let img = sharp(`assets-src/${l.src}`).ensureAlpha();
    if (l.crop) img = img.extract(l.crop);
    let buf = await img.png().toBuffer();
    if (l.knockOutBlack) {
      // Alpha from brightness, so the white crest stays and the black square disappears.
      const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += 4) {
        const lum = Math.max(data[i], data[i + 1], data[i + 2]);
        data[i + 3] = Math.min(data[i + 3], lum);
        data[i] = data[i + 1] = data[i + 2] = 255;
      }
      buf = await sharp(data, { raw: info }).png().toBuffer();
    }
    // Trim to the logo itself, then fit it into a square with a little breathing room (or, for
    // wide lockups, just size it).
    buf = await sharp(buf).trim({ threshold: 10 }).png().toBuffer();
    if (l.wide) {
      await sharp(buf).resize({ height: 120, withoutEnlargement: true }).png().toFile(`public/logos/${name}.png`);
      continue;
    }
    await sharp(buf)
      .resize(224, 224, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
      .extend({ top: 16, bottom: 16, left: 16, right: 16, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(`public/logos/${name}.png`);
  }
  console.log('logos', Object.keys(LOGOS).length);
}

async function work() {
  for (const [slug, files] of Object.entries(WORK)) {
    await mkdir(`public/work/${slug}`, { recursive: true });
    await Promise.all(
      files.map((file, i) =>
        (typeof file === 'string' ? sharp(`assets-src/${file}`) : sharp(`assets-src/${file.src}`).extract(file.crop))
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 82, effort: 5 })
          .toFile(`public/work/${slug}/${String(i + 1).padStart(2, '0')}.webp`),
      ),
    );
    console.log(slug, files.length);
  }
}

await mkdir('components/booth', { recursive: true });
await figure();
await work();
await logos();
await clips();
