const axios = require('axios');

async function testCreate() {
  try {
    const res = await axios.post('http://localhost:5000/api/users', {
      username: 'testu' + Date.now(),
      email: Date.now() + '@example.com',
      phone: '1234567890',
      password: 'Password@123',
      role: 'User',
      department: '',
      programme: ''
    });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR:", err.response?.status, err.response?.data);
  }
}

testCreate();
