#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

console.log('🔍 Validating Environment Configuration...\n');

// Load frontend environment variables from root .env
const frontendEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(frontendEnvPath)) {
  require('dotenv').config({ path: frontendEnvPath });
  console.log('📱 Frontend .env loaded from root directory');
} else {
  console.log('❌ Frontend .env not found in root directory');
  process.exit(1);
}

// Load backend environment variables from server/.env
const backendEnvPath = path.join(__dirname, 'server', '.env');
if (fs.existsSync(backendEnvPath)) {
  require('dotenv').config({ path: backendEnvPath });
  console.log('🔌 Backend .env loaded from server directory');
} else {
  console.log('❌ Backend .env not found in server directory');
  process.exit(1);
}

// Required frontend variables
const requiredFrontend = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'NEXT_PUBLIC_API_URL'
];

// Required backend variables
const requiredBackend = [
  'MONGODB_URI',
  'PORT',
  'NODE_ENV',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS',
  'ALLOWED_ORIGINS'
];

// Optional backend variables (Firebase Admin SDK)
const optionalBackend = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
  'FIREBASE_AUTH_URI',
  'FIREBASE_TOKEN_URI',
  'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
  'FIREBASE_CLIENT_X509_CERT_URL'
];

let hasErrors = false;

// Check frontend variables
console.log('\n📱 Frontend Variables (from root .env):');
requiredFrontend.forEach(varName => {
  if (process.env[varName]) {
    console.log(`  ✅ ${varName}`);
  } else {
    console.log(`  ❌ ${varName} - MISSING`);
    hasErrors = true;
  }
});

// Check backend variables
console.log('\n🔌 Backend Variables (from server/.env):');
requiredBackend.forEach(varName => {
  if (process.env[varName]) {
    console.log(`  ✅ ${varName}`);
  } else {
    console.log(`  ❌ ${varName} - MISSING`);
    hasErrors = true;
  }
});

// Check optional Firebase Admin SDK variables
console.log('\n🔑 Optional Firebase Admin SDK Variables (from server/.env):');
optionalBackend.forEach(varName => {
  if (process.env[varName]) {
    console.log(`  ✅ ${varName}`);
  } else {
    console.log(`  ⚠️  ${varName} - Not set (Firebase Admin SDK may not work)`);
  }
});

// Check specific values
console.log('\n🔍 Configuration Validation:');

// Check PORT
if (process.env.PORT === '5001') {
  console.log('  ✅ PORT is set to 5001 (avoids macOS ControlCenter conflict)');
} else if (process.env.PORT) {
  console.log(`  ⚠️  PORT is set to ${process.env.PORT} (not 5001)`);
} else {
  console.log('  ❌ PORT is not set');
  hasErrors = true;
}

// Check API URL
if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.includes('5001')) {
  console.log('  ✅ API URL is configured for port 5001');
} else if (process.env.NEXT_PUBLIC_API_URL) {
  console.log(`  ⚠️  API URL is set to ${process.env.NEXT_PUBLIC_API_URL}`);
} else {
  console.log('  ℹ️  Using default API URL: http://localhost:5001/api');
}

// Check CORS origins
if (process.env.ALLOWED_ORIGINS && process.env.ALLOWED_ORIGINS.includes('3000')) {
  console.log('  ✅ CORS origins include localhost:3000');
} else if (process.env.ALLOWED_ORIGINS) {
  console.log(`  ⚠️  CORS origins: ${process.env.ALLOWED_ORIGINS}`);
} else {
  console.log('  ℹ️  Using default CORS origins');
}

// Check MongoDB URI
if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb')) {
  console.log('  ✅ MongoDB URI is configured');
} else if (process.env.MONGODB_URI) {
  console.log('  ⚠️  MongoDB URI format may be incorrect');
} else {
  console.log('  ❌ MongoDB URI is missing');
  hasErrors = true;
}

console.log('\n📊 Summary:');
if (hasErrors) {
  console.log('  ❌ Environment configuration has errors. Please fix the missing variables above.');
  process.exit(1);
} else {
  console.log('  ✅ Environment configuration looks good!');
  console.log('\n🚀 You can now start the development servers:');
  console.log('   npm run dev:both');
  console.log('   npm run dev:frontend');
  console.log('   npm run dev:backend');
}
