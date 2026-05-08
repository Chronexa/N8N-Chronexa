require('dotenv').config();
const axios = require('axios');

async function listActiveWorkflows() {
    const url = process.env.N8N_API_URL;
    const apiKey = process.env.N8N_API_KEY;

    try {
        const response = await axios.get(`${url}/workflows`, {
            headers: { 'X-N8N-API-KEY': apiKey },
            params: { active: true }
        });

        const workflows = response.data.data;
        console.log(`Found ${workflows.length} active workflows:`);
        workflows.forEach(wf => {
            console.log(`- [${wf.id}] ${wf.name}`);
        });
    } catch (error) {
        console.error('Failed to list workflows');
        if (error.response) console.error(error.response.data);
    }
}

listActiveWorkflows();
