/**
 * Shared helpers for the Meta Ads / Lead Ads scripts.
 *
 * The "CX Ads" app (996838773388054) has *Require App Secret* enabled, so EVERY
 * Graph API call must carry an appsecret_proof — an HMAC-SHA256 of the access
 * token keyed by the app secret. Without it the API rejects the call outright
 * with code 100, "API calls from the server require an appsecret_proof argument".
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ENV_PATH = path.join(__dirname, '..', '..', '.env');

function loadEnv(p = ENV_PATH) {
  const env = {};
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    env[m[1]] = v;
  }
  return env;
}

/** Append or replace a KEY=value pair in .env, so IDs we mint survive the run. */
function setEnv(key, value, p = ENV_PATH) {
  const raw = fs.readFileSync(p, 'utf8');
  const re = new RegExp(`^${key}=.*$`, 'm');
  fs.writeFileSync(p, re.test(raw) ? raw.replace(re, `${key}=${value}`) : `${raw.replace(/\n*$/, '\n')}${key}=${value}\n`);
}

const appSecretProof = (token, secret) => crypto.createHmac('sha256', secret).update(token).digest('hex');

/** Graph API GET that transparently follows `paging.next` and concatenates `data`. */
async function graphAll(pathname, params, { token, secret, version = 'v23.0' }) {
  const out = [];
  let url = new URL(`https://graph.facebook.com/${version}/${pathname}`);
  for (const [k, v] of Object.entries(params || {})) url.searchParams.set(k, v);
  url.searchParams.set('access_token', token);
  url.searchParams.set('appsecret_proof', appSecretProof(token, secret));
  while (url) {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) throw new Error(`Graph ${pathname}: ${json.error.message}`);
    out.push(...(json.data || []));
    // Meta's `next` URL carries the access token but NOT appsecret_proof, so it
    // must be re-attached or page two fails with code 100.
    if (json.paging && json.paging.next) {
      url = new URL(json.paging.next);
      url.searchParams.set('appsecret_proof', appSecretProof(token, secret));
    } else {
      url = null;
    }
  }
  return out;
}

async function graphGet(pathname, params, { token, secret, version = 'v23.0' }) {
  const url = new URL(`https://graph.facebook.com/${version}/${pathname}`);
  for (const [k, v] of Object.entries(params || {})) url.searchParams.set(k, v);
  url.searchParams.set('access_token', token);
  url.searchParams.set('appsecret_proof', appSecretProof(token, secret));
  const json = await (await fetch(url)).json();
  if (json.error) throw new Error(`Graph ${pathname}: ${json.error.message}`);
  return json;
}

/** Exchange the long-lived refresh token for a Google access token (~1h life). */
async function googleAccessToken(env) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GSC_CLIENT_ID,
      client_secret: env.GSC_CLIENT_SECRET,
      refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const tok = await res.json();
  if (!tok.access_token) throw new Error(`Google token exchange failed: ${JSON.stringify(tok).slice(0, 300)}`);
  return tok.access_token;
}

async function sheets(method, pathname, accessToken, body) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets${pathname}`, {
    method,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Sheets ${method} ${pathname} -> ${res.status} ${JSON.stringify(json).slice(0, 400)}`);
  return json;
}

module.exports = { loadEnv, setEnv, appSecretProof, graphAll, graphGet, googleAccessToken, sheets, ENV_PATH };
