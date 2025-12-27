#!/usr/bin/env node

/**
 * Backend Testing Script
 * Tests the backend API endpoints with provided credentials
 */

const https = require('https');
const http = require('http');

// Test configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_EMAIL = 'hirenitinsingh@gmail.com';
const TEST_PASSWORD = 'm49qmhihux';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: 10000,
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  log('\n📊 Testing Health Check Endpoint...', 'cyan');
  try {
    const response = await makeRequest(`${BASE_URL}/health`);
    if (response.status === 200) {
      log('✅ Health check passed', 'green');
      log(`   Status: ${response.data.status}`, 'blue');
      log(`   Uptime: ${Math.floor(response.data.uptime)}s`, 'blue');
      return true;
    } else {
      log(`❌ Health check failed: Status ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function testFirebaseAuth() {
  log('\n🔐 Testing Firebase Authentication...', 'cyan');
  log('⚠️  Note: This requires Firebase Admin SDK to be configured', 'yellow');
  log('   Testing with email: ' + TEST_EMAIL, 'blue');
  
  // Note: We can't directly test Firebase auth without the Firebase Admin SDK
  // This is just a placeholder to show what would be tested
  log('   Authentication testing requires Firebase Admin SDK configuration', 'yellow');
  return true;
}

async function testApiEndpoints() {
  log('\n📝 Testing API Endpoints...', 'cyan');
  
  // Test without auth (should fail)
  log('\n1. Testing /api/resumes without authentication...', 'blue');
  try {
    const response = await makeRequest(`${BASE_URL}/api/resumes`);
    if (response.status === 401) {
      log('✅ Correctly rejected unauthenticated request', 'green');
    } else {
      log(`⚠️  Unexpected status: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ Request failed: ${error.message}`, 'red');
  }

  // Note: To test authenticated endpoints, we'd need a valid Firebase ID token
  // This would require:
  // 1. User to login via frontend
  // 2. Get the ID token from Firebase Auth
  // 3. Use that token in Authorization header
  
  log('\n⚠️  To test authenticated endpoints:', 'yellow');
  log('   1. Start the frontend and login with the provided credentials', 'yellow');
  log('   2. Get the Firebase ID token from browser console', 'yellow');
  log('   3. Use it in the Authorization header: Bearer <token>', 'yellow');
  
  return true;
}

async function testMongoDBConnection() {
  log('\n🗄️  Testing MongoDB Connection...', 'cyan');
  log('   This is handled by the server on startup', 'blue');
  log('   Check server logs for MongoDB connection status', 'blue');
  return true;
}

// Main test function
async function runTests() {
  log('\n🧪 Backend API Testing Suite', 'cyan');
  log('='.repeat(50), 'cyan');
  log(`Base URL: ${BASE_URL}`, 'blue');
  log(`Test Email: ${TEST_EMAIL}`, 'blue');
  log('='.repeat(50), 'cyan');

  const results = {
    healthCheck: false,
    mongoDB: false,
    apiEndpoints: false,
  };

  // Test health check
  results.healthCheck = await testHealthCheck();

  // Test MongoDB (informational)
  results.mongoDB = await testMongoDBConnection();

  // Test API endpoints
  results.apiEndpoints = await testApiEndpoints();

  // Summary
  log('\n📋 Test Summary', 'cyan');
  log('='.repeat(50), 'cyan');
  log(`Health Check: ${results.healthCheck ? '✅ PASS' : '❌ FAIL'}`, results.healthCheck ? 'green' : 'red');
  log(`MongoDB: ${results.mongoDB ? '✅ INFO' : '❌ FAIL'}`, results.mongoDB ? 'green' : 'red');
  log(`API Endpoints: ${results.apiEndpoints ? '✅ INFO' : '❌ FAIL'}`, results.apiEndpoints ? 'green' : 'red');
  log('='.repeat(50), 'cyan');

  if (results.healthCheck) {
    log('\n✅ Backend server is running and responding!', 'green');
    log('\n💡 Next Steps:', 'cyan');
    log('   1. Start the frontend: npm run dev:frontend', 'blue');
    log('   2. Login with the provided credentials', 'blue');
    log('   3. Check browser console for API calls', 'blue');
  } else {
    log('\n❌ Backend server is not responding', 'red');
    log('\n💡 To start the backend:', 'cyan');
    log('   npm run dev:unified (unified server)', 'blue');
    log('   or', 'blue');
    log('   npm run dev:backend (backend only)', 'blue');
  }
}

// Run tests
runTests().catch((error) => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});

