require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function deployWorkflow(filePath) {
    const url = process.env.N8N_API_URL;
    const apiKey = process.env.N8N_API_KEY;

    try {
        const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Remove ID if we want to create a new one, or keep it to update
        // For a new deployment, we usually don't send read-only fields
        const { id, createdAt, updatedAt, active, tags, ...cleanData } = workflowData;

        console.log(`Deploying workflow: ${cleanData.name}`);

        const response = await axios.post(`${url}/workflows`, cleanData, {
            headers: {
                'X-N8N-API-KEY': apiKey,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Deployment successful!');
        console.log(`New Workflow ID: ${response.data.id}`);
        console.log(`View it at: ${process.env.N8N_API_URL.replace('/api/v1', '')}/workflow/${response.data.id}`);
    } catch (error) {
        console.error('❌ Deployment failed!');
        if (error.response) {
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

const fileToDeploy = process.argv[2];
if (!fileToDeploy) {
    console.error('Usage: node scripts/deploy-workflow.js <path-to-json>');
    process.exit(1);
}

deployWorkflow(fileToDeploy);
