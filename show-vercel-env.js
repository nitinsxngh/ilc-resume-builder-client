#!/usr/bin/env node

/**
 * Script to display Firebase Admin SDK environment variables
 * formatted for easy copying to Vercel
 */

require('dotenv').config({ path: '.env' });

const variables = {
  'FIREBASE_PROJECT_ID': process.env.FIREBASE_PROJECT_ID,
  'FIREBASE_PRIVATE_KEY_ID': process.env.FIREBASE_PRIVATE_KEY_ID,
  'FIREBASE_PRIVATE_KEY': process.env.FIREBASE_PRIVATE_KEY,
  'FIREBASE_CLIENT_EMAIL': process.env.FIREBASE_CLIENT_EMAIL,
  'FIREBASE_CLIENT_ID': process.env.FIREBASE_CLIENT_ID,
  'FIREBASE_AUTH_URI': process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
  'FIREBASE_TOKEN_URI': process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
  'FIREBASE_AUTH_PROVIDER_X509_CERT_URL': process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
  'FIREBASE_CLIENT_X509_CERT_URL': process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

console.log('📋 Firebase Admin SDK Environment Variables for Vercel\n');
console.log('Copy these to Vercel Dashboard → Settings → Environment Variables\n');
console.log('=' .repeat(70));

let allPresent = true;

Object.entries(variables).forEach(([key, value]) => {
  if (!value) {
    console.log(`\n❌ ${key}: MISSING`);
    allPresent = false;
  } else {
    // Truncate long values for display
    let displayValue = value;
    if (key === 'FIREBASE_PRIVATE_KEY' && value.length > 100) {
      displayValue = value.substring(0, 50) + '...' + value.substring(value.length - 50);
    } else if (value.length > 80) {
      displayValue = value.substring(0, 80) + '...';
    }
    
    console.log(`\n✅ ${key}`);
    console.log(`   Value: ${displayValue}`);
    
    // Special instructions for private key
    if (key === 'FIREBASE_PRIVATE_KEY') {
      console.log(`   ⚠️  IMPORTANT: Copy the ENTIRE value including quotes and \\n characters`);
      console.log(`   ⚠️  The value should start with "-----BEGIN PRIVATE KEY-----`);
    }
  }
});

console.log('\n' + '='.repeat(70));

if (!allPresent) {
  console.log('\n⚠️  Some variables are missing!');
  console.log('Make sure your .env file has all Firebase Admin SDK variables.');
  console.log('Run: node update-firebase-admin.js <path-to-json-file>');
} else {
  console.log('\n✅ All variables are present!');
  console.log('\n📝 Next steps:');
  console.log('1. Go to https://vercel.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings → Environment Variables');
  console.log('4. Add each variable above');
  console.log('5. Select Production, Preview, and Development for each');
  console.log('6. Redeploy your application');
}

