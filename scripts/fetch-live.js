require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const url = process.env.N8N_API_URL;
const apiKey = process.env.N8N_API_KEY;

// ACTIVE production pipeline (verified against live instance 2026-07-12).
// The previous IDs here pointed at inactive [DRAFT] copies — mirrors were stale.
const ids = {
  'fPqf1XhTxhGyWVbF': 'blog-agent-1-gsc-strategist.json',
  '6SzXgyv0rMfA68l6': 'blog-agent-2-researcher-baserow.json',
  'EbW7suHY7ji6EhsD': 'blog-agent-3-copywriter.json',
  'Z2ehkUAAYsub4l2i': 'blog-agent-4-designer.json',
  'qYIiCFzOoPMNFEmO': 'blog-agent-5-publisher.json'
};

async function fetchLive() {
  for (const [id, filename] of Object.entries(ids)) {
    try {
      const res = await axios.get(`${url}/workflows/${id}`, { headers: { 'X-N8N-API-KEY': apiKey } });
      fs.writeFileSync(`scripts/live-workflows/${filename}`, JSON.stringify(res.data, null, 2));
      console.log(`Saved ${filename}`);
    } catch (err) {
      console.error(`Failed ${id}`, err.message);
    }
  }
}
fetchLive();
