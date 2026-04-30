const axios = require('axios');

async function testAPI() {
  try {
    // Test without auth first to see what happens
    const response = await axios.get('http://localhost:3003/api/patients');
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI();
