#!/usr/bin/env node

/**
 * Script to update Firebase Admin SDK variables in .env file
 * from a Firebase service account JSON file
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env');
const JSON_FILE = process.argv[2];

if (!JSON_FILE) {
  console.log('📝 Usage: node update-firebase-admin.js <path-to-service-account-json>');
  console.log('');
  console.log('Example:');
  console.log('  node update-firebase-admin.js ~/Downloads/forum-ilc-firebase-adminsdk-xxxxx.json');
  console.log('');
  console.log('To get the JSON file:');
  console.log('  1. Go to https://console.firebase.google.com/');
  console.log('  2. Select project: forum-ilc');
  console.log('  3. Go to Project Settings > Service Accounts');
  console.log('  4. Click "Generate new private key"');
  console.log('  5. Download the JSON file');
  process.exit(1);
}

// Read JSON file
let serviceAccount;
try {
  const jsonContent = fs.readFileSync(JSON_FILE, 'utf8');
  serviceAccount = JSON.parse(jsonContent);
} catch (error) {
  console.error('❌ Error reading JSON file:', error.message);
  process.exit(1);
}

// Read .env file
let envContent;
try {
  envContent = fs.readFileSync(ENV_FILE, 'utf8');
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

// Escape private key for .env format
const privateKey = serviceAccount.private_key.replace(/\n/g, '\\n');

// Update or add Firebase Admin variables
const updates = {
  'FIREBASE_PROJECT_ID': serviceAccount.project_id,
  'FIREBASE_PRIVATE_KEY_ID': serviceAccount.private_key_id,
  'FIREBASE_PRIVATE_KEY': `"${privateKey}"`,
  'FIREBASE_CLIENT_EMAIL': serviceAccount.client_email,
  'FIREBASE_CLIENT_ID': serviceAccount.client_id,
  'FIREBASE_AUTH_URI': serviceAccount.auth_uri,
  'FIREBASE_TOKEN_URI': serviceAccount.token_uri,
  'FIREBASE_AUTH_PROVIDER_X509_CERT_URL': serviceAccount.auth_provider_x509_cert_url,
  'FIREBASE_CLIENT_X509_CERT_URL': serviceAccount.client_x509_cert_url,
};

let updated = false;
let newContent = envContent;

// Update existing variables or add new ones
Object.entries(updates).forEach(([key, value]) => {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(newContent)) {
    // Update existing
    newContent = newContent.replace(regex, `${key}=${value}`);
    updated = true;
  } else {
    // Add new at the end
    newContent += `\n${key}=${value}`;
    updated = true;
  }
});

// Write updated .env file
if (updated) {
  try {
    fs.writeFileSync(ENV_FILE, newContent, 'utf8');
    console.log('✅ Firebase Admin SDK variables updated in .env file');
    console.log('');
    console.log('Updated variables:');
    Object.keys(updates).forEach(key => {
      console.log(`  ✓ ${key}`);
    });
    console.log('');
    console.log('🔄 Please restart your development server for changes to take effect');
  } catch (error) {
    console.error('❌ Error writing .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('ℹ️  No changes needed - variables already up to date');
}

