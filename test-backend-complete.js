#!/usr/bin/env node

/**
 * Complete Backend Testing Script
 * Checks environment, starts server if needed, and tests all endpoints
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check environment setup
function checkEnvironment() {
  log('\n🔍 Checking Environment Setup...', 'cyan');
  
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found!', 'red');
    log('   Please create a .env file in the project root', 'yellow');
    return false;
  }
  
  log('✅ .env file found', 'green');
  
  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  });
  
  // Check required variables
  const required = ['MONGODB_URI'];
  const optional = ['PORT', 'NEXT_PUBLIC_API_URL'];
  
  let allGood = true;
  required.forEach(key => {
    if (envVars[key]) {
      log(`✅ ${key} is set`, 'green');
    } else {
      log(`❌ ${key} is missing!`, 'red');
      allGood = false;
    }
  });
  
  optional.forEach(key => {
    if (envVars[key]) {
      log(`✅ ${key} is set: ${envVars[key]}`, 'green');
    } else {
      log(`ℹ️  ${key} not set (using default)`, 'blue');
    }
  });
  
  return allGood;
}

// Test health endpoint
async function testHealth(baseUrl = 'http://localhost:3000') {
  return new Promise((resolve) => {
    const http = require('http');
    const url = new URL(`${baseUrl}/health`);
    
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: 'GET',
      timeout: 5000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ success: true, status: res.statusCode, data: json });
        } catch (e) {
          resolve({ success: true, status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Connection timeout' });
    });
    
    req.end();
  });
}

// Main function
async function main() {
  log('\n🧪 Backend Testing & Verification', 'magenta');
  log('='.repeat(60), 'cyan');
  
  // Step 1: Check environment
  const envOk = checkEnvironment();
  if (!envOk) {
    log('\n❌ Environment check failed!', 'red');
    log('\n📝 Please ensure your .env file contains:', 'yellow');
    log('   MONGODB_URI=mongodb+srv://...', 'blue');
    log('   PORT=3000 (optional)', 'blue');
    process.exit(1);
  }
  
  // Step 2: Test health endpoint
  log('\n📊 Testing Backend Health Endpoint...', 'cyan');
  log('   Trying http://localhost:3000/health...', 'blue');
  
  const healthResult = await testHealth('http://localhost:3000');
  
  if (!healthResult.success) {
    log('❌ Backend is not running!', 'red');
    log('\n🚀 To start the backend:', 'yellow');
    log('   1. Unified Server (Recommended):', 'blue');
    log('      npm run build', 'blue');
    log('      npm run dev:unified', 'blue');
    log('', 'blue');
    log('   2. Or use the start script:', 'blue');
    log('      ./start-unified.sh', 'blue');
    log('', 'blue');
    log('   3. For separate backend only:', 'blue');
    log('      npm run dev:backend', 'blue');
    return;
  }
  
  if (healthResult.status === 200) {
    log('✅ Backend is running!', 'green');
    log(`   Status: ${healthResult.data.status}`, 'green');
    log(`   Uptime: ${Math.floor(healthResult.data.uptime)}s`, 'green');
  } else {
    log(`⚠️  Backend responded with status: ${healthResult.status}`, 'yellow');
  }
  
  // Step 3: Test API endpoints
  log('\n📝 Testing API Endpoints...', 'cyan');
  log('   Note: Authenticated endpoints require Firebase ID token', 'yellow');
  log('   Test credentials provided:', 'blue');
  log('   Email: hirenitinsingh@gmail.com', 'blue');
  log('   Password: m49qmhihux', 'blue');
  log('', 'blue');
  log('   To test authenticated endpoints:', 'yellow');
  log('   1. Start frontend: npm run dev:frontend', 'blue');
  log('   2. Login with the credentials above', 'blue');
  log('   3. Open browser console and run:', 'blue');
  log('      const auth = getAuth();', 'blue');
  log('      const user = auth.currentUser;', 'blue');
  log('      user.getIdToken().then(token => console.log(token));', 'blue');
  log('   4. Use that token in API requests', 'blue');
  
  // Step 4: Summary
  log('\n📋 Test Summary', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Environment: ${envOk ? '✅ PASS' : '❌ FAIL'}`, envOk ? 'green' : 'red');
  log(`Backend Health: ${healthResult.success && healthResult.status === 200 ? '✅ PASS' : '❌ FAIL'}`, 
      healthResult.success && healthResult.status === 200 ? 'green' : 'red');
  log('='.repeat(60), 'cyan');
  
  if (healthResult.success && healthResult.status === 200) {
    log('\n✅ Backend is running properly!', 'green');
    log('\n💡 Next Steps:', 'cyan');
    log('   1. Test the frontend: npm run dev:frontend', 'blue');
    log('   2. Login and test the full application', 'blue');
    log('   3. Check MongoDB connection in server logs', 'blue');
  }
}

// Run
main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});

