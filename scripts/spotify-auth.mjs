// One-time Spotify connection for the Now Playing card. Run it yourself: node scripts/spotify-auth.mjs
//
// Before running, on developer.spotify.com/dashboard open (or create) your app and:
//   1. Settings → Redirect URIs → add  http://127.0.0.1:8888/callback  → Save
//   2. User Management → add the email of your own Spotify account
//   3. Copy the Client ID and Client Secret; this script asks for them
//
// It opens Spotify in your browser to approve read-only access to what you're playing, then
// writes SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN to .env.local
// (git-ignored). Upload them to Netlify with:  netlify env:import .env.local
import http from 'node:http';
import { exec } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';

const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const id = process.env.SPOTIFY_CLIENT_ID || (await rl.question('Spotify Client ID: ')).trim();
const secret = process.env.SPOTIFY_CLIENT_SECRET || (await rl.question('Spotify Client Secret: ')).trim();
rl.close();

const state = Math.random().toString(36).slice(2);
const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({ client_id: id, response_type: 'code', redirect_uri: REDIRECT, scope: SCOPES, state });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== '/callback') return res.writeHead(404).end();
  const code = url.searchParams.get('code');
  if (!code || url.searchParams.get('state') !== state) {
    res.writeHead(400).end(`Spotify said: ${url.searchParams.get('error') ?? 'no code'}. Close this tab and try again.`);
    return server.close();
  }
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
  });
  const body = await tokenRes.json();
  if (!tokenRes.ok || !body.refresh_token) {
    res.writeHead(500).end('Could not get a token. Check the Client Secret and Redirect URI, then try again.');
    console.error('Token exchange failed:', body.error_description ?? body.error ?? tokenRes.status);
    return server.close();
  }
  await writeFile(
    '.env.local',
    `SPOTIFY_CLIENT_ID=${id}\nSPOTIFY_CLIENT_SECRET=${secret}\nSPOTIFY_REFRESH_TOKEN=${body.refresh_token}\n`,
  );
  res.writeHead(200, { 'Content-Type': 'text/plain' }).end('Connected. You can close this tab.');
  console.log('\nSaved to .env.local. Next:  netlify env:import .env.local');
  server.close();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Opening Spotify to approve access…\nIf nothing opens, visit:\n' + authUrl);
  exec(`open "${authUrl}"`);
});
