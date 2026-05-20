const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const key = JSON.parse(fs.readFileSync('./config/gsc-service-account.json','utf8'));

function request(method, hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body || null;
    if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr);
    const req = https.request({ hostname, path, method, headers }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function buildToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600
  };
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const bodyB = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signingInput = `${header}.${bodyB}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  sign.end();
  const gsc_jwt = `${signingInput}.${sign.sign(key.private_key, 'base64url')}`;
  const tokenBody = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${gsc_jwt}`;
  const tokenRes = await request('POST', 'oauth2.googleapis.com', '/token',
    {'Content-Type':'application/x-www-form-urlencoded'}, tokenBody);
  return tokenRes.data.access_token;
}

async function main() {
  const access = await buildToken();
  console.log('Token obtained:', !!access);

  const now2 = new Date();
  const endDate = new Date(now2 - 3*86400000).toISOString().split('T')[0];
  const startDate = new Date(now2 - 90*86400000).toISOString().split('T')[0];
  const gscBody = JSON.stringify({
    startDate, endDate, dimensions: ['query'], rowLimit: 1000,
    dimensionFilterGroups: [{filters:[{dimension:'query',operator:'notContains',expression:'chronexa'}]}]
  });

  // List all sites this service account can access
  const r3 = await request('GET', 'searchconsole.googleapis.com',
    '/webmasters/v3/sites',
    {'Authorization':`Bearer ${access}`}, null);
  console.log('\nList sites status:', r3.status);
  console.log('Sites response:', JSON.stringify(r3.data));

  // Try sc-domain format
  const r1 = await request('POST', 'searchconsole.googleapis.com',
    '/webmasters/v3/sites/sc-domain%3Achronexa.io/searchAnalytics/query',
    {'Authorization':`Bearer ${access}`,'Content-Type':'application/json'}, gscBody);
  console.log('\nsc-domain query status:', r1.status);
  console.log('Response:', JSON.stringify(r1.data).slice(0,400));
}
main().catch(e => console.error('ERR:', e));
