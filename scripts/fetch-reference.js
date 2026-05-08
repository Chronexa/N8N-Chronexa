require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchWorkflow(id) {
    const url = process.env.N8N_API_URL;
    const apiKey = process.env.N8N_API_KEY;

    try {
        const response = await axios.get(`${url}/workflows/${id}`, {
            headers: {
                'X-N8N-API-KEY': apiKey
            }
        });

        const workflow = response.data;
        const filePath = path.join(__dirname, '../src/workflows', `reference_${id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
        console.log(`✅ Workflow ${id} fetched and saved to ${filePath}`);
    } catch (error) {
        console.error(`❌ Failed to fetch workflow ${id}`);
        if (error.response) {
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Fetch the most recent workflow as a reference
async function fetchLatest() {
    const url = process.env.N8N_API_URL;
    const apiKey = process.env.N8N_API_KEY;

    try {
        const response = await axios.get(`${url}/workflows`, {
            headers: {
                'X-N8N-API-KEY': apiKey
            },
            params: {
                limit: 1
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            const latest = response.data.data[0];
            console.log(`Latest workflow ID: ${latest.id} (${latest.name})`);
            await fetchWorkflow(latest.id);
        } else {
            console.log('No workflows found.');
        }
    } catch (error) {
        console.error('❌ Failed to fetch workflows list');
    }
}

fetchLatest();
