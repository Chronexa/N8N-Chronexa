require('dotenv').config();
const axios = require('axios');

async function searchWorkflows() {
    const url = process.env.N8N_API_URL;
    const apiKey = process.env.N8N_API_KEY;

    try {
        const response = await axios.get(`${url}/workflows`, {
            headers: { 'X-N8N-API-KEY': apiKey },
            params: { limit: 100 }
        });

        const workflows = response.data.data;
        const keywords = ['lead', 'enrich', 'research', 'company', 'data', 'email', 'write', 'writing'];
        
        console.log(`Searching through ${workflows.length} workflows...`);
        
        const matched = workflows.filter(wf => {
            const name = wf.name.toLowerCase();
            return keywords.some(k => name.includes(k));
        });

        if (matched.length > 0) {
            console.log(`\n✅ Found ${matched.length} workflows matching your research/enrichment criteria:`);
            matched.forEach(wf => {
                const status = wf.active ? '🟢 ACTIVE' : '⚪️ INACTIVE';
                console.log(`${status} - [${wf.id}] ${wf.name}`);
            });
        } else {
            console.log('\n❌ No workflows found matching those specific keywords.');
        }
    } catch (error) {
        console.error('Failed to search workflows');
        if (error.response) console.error(error.response.data);
    }
}

searchWorkflows();
