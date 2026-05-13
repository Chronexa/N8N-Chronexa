require('dotenv').config();
const axios = require('axios');

async function testFramerAPI() {
  const token = process.env.FRAMER_API_TOKEN;
  if (!token) {
    console.error('No FRAMER_API_TOKEN found in environment.');
    process.exit(1);
  }

  console.log('Testing Framer API connection...');
  
  try {
    const response = await axios.get('https://api.framer.com/v1/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('API Connection Successful!');
    console.log('User Data:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Request Error:', error.message);
    }
  }
}

testFramerAPI();
