require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const url = process.env.N8N_API_URL;
const apiKey = process.env.N8N_API_KEY;

const ids = {
  'd96au9JL4iHaFdKj': 'blog-agent-1-strategist.json',
  'PKh8zA5zH3dewf02': 'blog-agent-2-researcher.json',
  'eVPVPBzfFp4obCu0': 'blog-agent-3-copywriter.json',
  '3EVAeoUzCWBzlvKp': 'blog-agent-4-designer.json',
  'Pxyseu0euKXlTXsX': 'blog-agent-5-publisher.json'
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
