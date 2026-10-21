// Pulls Ena's latest Medium posts (title, link, date, reading time, header image) from her RSS feed
// into content/writing.json, with each thumbnail saved as public/writing/<slug>.webp.
// Runs before every build, so each deploy picks up new posts. If Medium can't be reached it keeps
// the last saved list rather than failing the build.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const FEED = 'https://medium.com/feed/@otuokonhelena';
const UA = { 'User-Agent': 'Mozilla/5.0' };

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function main() {
  const xml = await (await fetch(FEED, { headers: UA })).text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  if (!items.length) throw new Error('no posts in the feed');

  await mkdir('public/writing', { recursive: true });
  const posts = [];
  for (const it of items.slice(0, 8)) {
    const title = decode(it.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ?? '').trim();
    const link = (it.match(/<link>([^<]+)<\/link>/)?.[1] ?? '').split('?')[0];
    const date = new Date(it.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] ?? Date.now());
    const body = it.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] ?? '';
    const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    // Blurb: the opening paragraphs, until there's a proper sentence's worth.
    let firstPara = '';
    for (const m of body.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
      firstPara = `${firstPara} ${decode(m[1].replace(/<[^>]+>/g, ''))}`.trim();
      if (firstPara.length >= 70) break;
    }
    const image = body.match(/<img[^>]+src="([^"]+)"/)?.[1];
    const slug = link.split('/').pop().replace(/[^a-z0-9-]/gi, '').slice(0, 60) || `post-${posts.length + 1}`;

    let thumb = null;
    if (image) {
      const file = `public/writing/${slug}.webp`;
      if (!existsSync(file)) {
        const buf = Buffer.from(await (await fetch(image, { headers: UA })).arrayBuffer());
        await sharp(buf).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file);
      }
      thumb = `/writing/${slug}.webp`;
    }
    posts.push({
      title,
      href: link,
      date: date.toISOString().slice(0, 10),
      minutes: Math.max(1, Math.round(words / 230)),
      blurb: firstPara.length > 160 ? `${firstPara.slice(0, 157).trimEnd()}…` : firstPara,
      thumb,
    });
  }
  await writeFile('content/writing.json', JSON.stringify(posts, null, 2) + '\n');
  console.log(`writing: ${posts.length} posts`);
}

main().catch((err) => {
  if (existsSync('content/writing.json')) {
    console.warn(`writing: kept the saved list (${err.message})`);
  } else {
    console.error(err);
    process.exit(1);
  }
});
