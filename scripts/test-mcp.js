require('dotenv').config();
const axios = require('axios');

async function listMcpTools() {
    const url = process.env.MCP_URL;
    const token = process.env.MCP_AUTH_TOKEN;

    console.log(`Querying MCP tools from: ${url}`);

    try {
        // Most MCP-over-HTTP implementations use POST /tools or similar
        // However, if it's the official MCP HTTP transport, it might be different.
        // Let's try a simple POST to see if it responds to list tools.
        
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/list",
            params: {}
        }, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ MCP Tools found:');
        const tools = response.data.result.tools;
        tools.forEach(tool => {
            console.log(`- ${tool.name}: ${tool.description.substring(0, 100)}...`);
        });
    } catch (error) {
        console.error('❌ Failed to list MCP tools');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

listMcpTools();
