require('dotenv').config();
const axios = require('axios');

async function fetchAirtable() {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    // Base and table IDs from earlier
    const url = `https://api.airtable.com/v0/${baseId}/tblEKgg9T1Z8tsj55`;
    
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
            params: {
                maxRecords: 20
            }
        });
        
        console.log(JSON.stringify(response.data.records.map(r => ({
            id: r.id,
            title: r.fields['Title'],
            status: r.fields['Status'],
            slug: r.fields['Slug'],
            coverImageUrl: r.fields['Cover Image URL'],
            framerId: r.fields['Framer Item ID'],
            error: r.fields['Error Log'],
            createdAt: r.fields['Created At']
        })), null, 2));
    } catch (err) {
        console.error(err.message);
        if (err.response) console.error(err.response.data);
    }
}
fetchAirtable();
