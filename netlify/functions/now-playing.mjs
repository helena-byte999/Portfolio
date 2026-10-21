// GET /api/now-playing: what Ena is playing on Spotify right now, followed by what she played
// recently, for the floating card on the home page. Reads her account with a long-lived refresh
// token (see scripts/spotify-auth.mjs). Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and
// SPOTIFY_REFRESH_TOKEN set on Netlify. Responses are cached at the edge for 30 seconds.

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1/me/player';

export const config = { path: '/api/now-playing' };

/** Trims a Spotify track object down to what the card shows. */
function slim(track, extra = {}) {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    art: track.album.images[0]?.url ?? null,
    url: track.external_urls.spotify,
    durationMs: track.duration_ms,
    ...extra,
  };
}

/** Current track (if any) first, then up to nine recent ones, without repeats. */
export function shape(current, recent) {
  const tracks = [];
  if (current?.item?.type === 'track') {
    tracks.push(slim(current.item, { live: Boolean(current.is_playing), progressMs: current.progress_ms ?? 0 }));
  }
  for (const { track, played_at } of recent?.items ?? []) {
    if (tracks.length >= 10) break;
    if (!tracks.some((t) => t.id === track.id)) tracks.push(slim(track, { live: false, playedAt: played_at }));
  }
  return { tracks };
}

async function accessToken() {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) throw new Error('Spotify is not connected');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  return (await res.json()).access_token;
}

const json = (body, status, cache) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': cache,
    },
  });

export default async function handler() {
  try {
    const token = await accessToken();
    const headers = { Authorization: `Bearer ${token}` };
    const [nowRes, recentRes] = await Promise.all([
      fetch(`${API}/currently-playing`, { headers }),
      fetch(`${API}/recently-played?limit=12`, { headers }),
    ]);
    // 204 means nothing is playing.
    const current = nowRes.status === 200 ? await nowRes.json() : null;
    const recent = recentRes.ok ? await recentRes.json() : null;
    return json(shape(current, recent), 200, 'public, s-maxage=30, stale-while-revalidate=60');
  } catch (err) {
    // The card hides itself when there are no tracks.
    return json({ tracks: [], error: String(err.message ?? err) }, 503, 'public, s-maxage=60');
  }
}
