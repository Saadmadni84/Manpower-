#!/usr/bin/env node

/**
 * Simple test script to verify server setup
 */

const http = require('http');

console.log('🧪 Testing server connection...');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is running on port ${options.port}`);
  console.log(`📊 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response:', data);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.log('❌ Server not responding on port 5001');
  console.log('🔧 Try running: cd backend && npm run dev');
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.log('⏰ Request timeout - server may be starting up');
  req.destroy();
  process.exit(1);
});

req.end();
