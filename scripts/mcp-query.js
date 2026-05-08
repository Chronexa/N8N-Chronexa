require('dotenv').config();
const axios = require('axios');

async function mcpQuery(method, params = {}) {
    const url = process.env.MCP_URL;
    const token = process.env.MCP_AUTH_TOKEN;

    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            id: Date.now(),
            method: method,
            params: params
        }, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream'
            }
        });

        // Parse SSE format
        const lines = response.data.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = JSON.parse(line.substring(6));
                return data;
            }
        }
        
        // If it was just JSON
        if (typeof response.data === 'object') return response.data;
        
        throw new Error('Could not parse MCP response');
    } catch (error) {
        if (error.response) {
            throw new Error(`MCP Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
}

// If run directly
if (require.main === module) {
    const method = process.argv[2];
    const params = process.argv[3] ? JSON.parse(process.argv[3]) : {};
    
    if (!method) {
        console.error('Usage: node scripts/mcp-query.js <method> [params-json]');
        process.exit(1);
    }

    mcpQuery(method, params)
        .then(res => console.log(JSON.stringify(res, null, 2)))
        .catch(err => {
            console.error(err.message);
            process.exit(1);
        });
}

module.exports = { mcpQuery };
