// One-off: scan all live n8n workflows for email-capable nodes and the
// credentials they reference, so the calculator breakdown-email workflow can
// reuse an existing credential instead of inventing one.
require('dotenv').config({ path: __dirname + '/../.env' });

const url = process.env.N8N_API_URL;
const apiKey = process.env.N8N_API_KEY;

async function main() {
  const res = await fetch(`${url}/workflows?limit=100`, {
    headers: { 'X-N8N-API-KEY': apiKey },
  });
  if (!res.ok) throw new Error(`list failed: ${res.status}`);
  const { data } = await res.json();
  console.log(`workflows: ${data.length}`);
  const hits = [];
  for (const wf of data) {
    for (const node of wf.nodes || []) {
      const t = (node.type || '').toLowerCase();
      if (t.includes('email') || t.includes('gmail') || t.includes('smtp') || t.includes('sendgrid') || t.includes('mailjet')) {
        hits.push({ workflow: wf.name, active: wf.active, node: node.name, type: node.type, credentials: node.credentials || {} });
      }
    }
  }
  console.log(JSON.stringify(hits, null, 2));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
