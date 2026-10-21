// Reads each playlist's name, cover and track count from Spotify's public pages (no keys needed)
// and writes content/playlists.json for the stack beside the booth. Run after editing
// content/playlist-links.json:  npm run playlists
// With --demo it writes content/playlists.demo.json from three public Spotify playlists instead,
// used only when the page is opened with ?playlists=demo.
import { readFile, writeFile } from 'node:fs/promises';

const DEMO = [
  'https://open.spotify.com/playlist/37i9dQZF1DWYkaDif7Ztbp',
  'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
  'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
];

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const demo = process.argv.includes('--demo');
const links = demo ? DEMO : JSON.parse(await readFile('content/playlist-links.json', 'utf8')).links;

const playlists = [];
for (const link of links.slice(0, 3)) {
  const id = link.match(/playlist\/([A-Za-z0-9]+)/)?.[1];
  if (!id) throw new Error(`Not a Spotify playlist link: ${link}`);
  const url = `https://open.spotify.com/playlist/${id}`;
  const oembed = await (await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`)).json();
  const html = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
  const meta = (name) => html.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]*)"`))?.[1];

  const description = decode(meta('og:description') ?? '');
  // A personal playlist's description reads "Playlist · Name · 39 items · 5 saves".
  const counted = description.match(/(\d[\d,]*)\s+(?:songs|items|tracks)/i)?.[1]?.replace(/,/g, '');
  // Otherwise count the songs in Spotify's embed page data.
  const embed = await (await fetch(`https://open.spotify.com/embed/playlist/${id}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
  const data = embed.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s)?.[1];
  const listed = data ? (JSON.parse(data).props?.pageProps?.state?.data?.entity?.trackList ?? []).length : 0;

  const cover = meta('og:image') ?? oembed.thumbnail_url;
  // Spotify's daylist renames and re-covers itself every day; the site refreshes it on each visit.
  const daily = cover.includes('daylist.') || /inspired by your listening/i.test(description);
  playlists.push({
    id,
    url,
    title: decode(oembed.title),
    cover,
    tracks: counted ? Number(counted) : listed || null,
    subtitle: daily ? 'Changes every day' : description && !description.startsWith('Playlist ·') ? description : null,
    ...(daily && { daily: true }),
  });
  console.log('playlist', decode(oembed.title));
}

await writeFile(demo ? 'content/playlists.demo.json' : 'content/playlists.json', JSON.stringify(playlists, null, 2) + '\n');
