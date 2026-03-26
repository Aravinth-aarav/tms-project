// test-fetch.js
async function test() {
  const res = await fetch('http://localhost:5000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testu' + Date.now(),
      email: Date.now() + '@example.com',
      phone: '1234567890',
      password: 'Password@123',
      role: 'User'
    })
  });
  console.log('Status:', res.status);
  console.log('Body:', await res.json());
}
test();
