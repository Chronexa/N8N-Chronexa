require('dotenv').config();
const axios = require('axios');

async function testConnection() {
    const url = process.env.N8N_API_URL;
    const apiKey = process.env.N8N_API_KEY;

    console.log(`Testing connection to: ${url}`);

    try {
        const response = await axios.get(`${url}/workflows`, {
            headers: {
                'X-N8N-API-KEY': apiKey
            },
            params: {
                limit: 1
            }
        });

        console.log('✅ Connection successful!');
        console.log(`Status: ${response.status}`);
        console.log(`Total workflows found: ${response.data.data ? 'Multiple' : 'None'}`);
    } catch (error) {
        console.error('❌ Connection failed!');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testConnection();
