const fs = require('fs');

async function getAccessToken() {
  const gClientId = process.env.GSC_CLIENT_ID;
  const gSecret = process.env.GSC_CLIENT_SECRET;
  const gRefresh = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!gClientId || !gSecret || !gRefresh) {
    throw new Error("Missing GSC OAuth credentials in env");
  }

  const tokRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ 
      client_id: gClientId, 
      client_secret: gSecret, 
      refresh_token: gRefresh, 
      grant_type: 'refresh_token' 
    }),
  });
  
  const tok = await tokRes.json();
  if (!tok.access_token) {
    console.error("Token response:", tok);
    throw new Error("Failed to get access token");
  }
  return tok.access_token;
}

async function submitSitemap(accessToken) {
  const siteUrl = encodeURIComponent('sc-domain:chronexa.io');
  // Or 'https://chronexa.io/' if it's registered as a URL-prefix property
  const sitemapUrl = encodeURIComponent('https://chronexa.io/sitemap.xml');
  
  // Try sc-domain first
  let res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${sitemapUrl}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!res.ok) {
    console.log(`Failed with sc-domain:chronexa.io (${res.status}), trying https://chronexa.io/`);
    const siteUrl2 = encodeURIComponent('https://chronexa.io/');
    res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl2}/sitemaps/${sitemapUrl}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  if (res.ok) {
    console.log("✅ Successfully submitted sitemap.xml to Google Search Console!");
  } else {
    console.error("❌ Failed to submit sitemap:", res.status, await res.text());
  }
}

async function requestIndexing(accessToken, url) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}` 
    },
    body: JSON.stringify({
      url: url,
      type: 'URL_UPDATED'
    })
  });
  
  if (res.ok) {
    console.log(`✅ Requested indexing for ${url}`);
  } else {
    const errorText = await res.text();
    console.log(`⚠️ Indexing API failed for ${url} (often requires specific GCP setup): ${res.status} ${errorText}`);
  }
}

async function main() {
  require('dotenv').config({ path: '.env.local' });
  require('dotenv').config({ path: '.env' });
  
  try {
    console.log("Getting access token...");
    const token = await getAccessToken();
    console.log("Access token acquired. Submitting sitemap...");
    
    await submitSitemap(token);
    
    const urls = [
      'https://chronexa.io/law-firm-billing-leakage-calculator',
      'https://chronexa.io/cpa-tax-season-capacity-calculator',
      'https://chronexa.io/document-processing-cost-calculator'
    ];
    
    console.log("\nAttempting to push URLs directly via Indexing API...");
    for (const url of urls) {
      await requestIndexing(token, url);
    }
    
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
