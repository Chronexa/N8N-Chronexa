/**
 * One-time OAuth (client ID/secret) to grant the Sheets scope so the site can
 * create + write the leads Google Sheet under YOUR Google account (no service
 * account). Opens a browser; after you approve, the refresh token is saved to
 * .env as GOOGLE_OAUTH_REFRESH_TOKEN. Run: node scripts/google-oauth.mjs
 */
import { google } from 'googleapis';
import { createServer } from 'http';
import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import { exec } from 'child_process';

const ENV = resolve(dirname(fileURLToPath(import.meta.url)), '../.env');
dotenvConfig({ path: ENV });

const REDIRECT_URI = 'http://localhost:3456';
const oauth2 = new google.auth.OAuth2(process.env.GSC_CLIENT_ID, process.env.GSC_CLIENT_SECRET, REDIRECT_URI);
const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

console.log('\nOpening Google authorization in your browser…');
console.log('If it does not open, visit:\n' + authUrl + '\n');
exec(`${process.platform === 'darwin' ? 'open' : 'xdg-open'} "${authUrl}"`);

const server = createServer(async (req, res) => {
  const code = new URL(req.url, REDIRECT_URI).searchParams.get('code');
  if (!code) { res.end('No code — try again.'); return; }
  try {
    const { tokens } = await oauth2.getToken(code);
    let env = readFileSync(ENV, 'utf8');
    if (/^GOOGLE_OAUTH_REFRESH_TOKEN=/m.test(env)) env = env.replace(/^GOOGLE_OAUTH_REFRESH_TOKEN=.*$/m, `GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    else env = env.trimEnd() + `\nGOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}\n`;
    writeFileSync(ENV, env);
    console.log('\n✓ GOOGLE_OAUTH_REFRESH_TOKEN saved to .env');
    res.end('<html><body style="font-family:sans-serif"><h2>✓ Authorized — you can close this tab.</h2></body></html>');
  } catch (e) {
    console.error('Token exchange failed:', e.message);
    res.end('Error: ' + e.message);
  } finally { server.close(); }
});
server.listen(3456, () => console.log('Waiting for Google redirect on localhost:3456…\n'));
