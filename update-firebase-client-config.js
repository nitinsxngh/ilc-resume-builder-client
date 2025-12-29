#!/usr/bin/env node

/**
 * Script to update Firebase Client Configuration in .env file
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env');

// Updated Firebase client config from user
const firebaseConfig = {
  apiKey: "AIzaSyDWXb5LaIXKgYq-jbOAlmTwsgU3CqO6CF4",
  authDomain: "forum-ilc.firebaseapp.com",
  projectId: "forum-ilc",
  storageBucket: "forum-ilc.firebasestorage.app",
  messagingSenderId: "307303631238",
  appId: "1:307303631238:web:e534992219fb0d62cc8407",
  measurementId: "G-03YTS2XKSK"
};

// Read .env file
let envContent;
try {
  envContent = fs.readFileSync(ENV_FILE, 'utf8');
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

// Update Firebase client variables
const updates = {
  'NEXT_PUBLIC_FIREBASE_API_KEY': firebaseConfig.apiKey,
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': firebaseConfig.authDomain,
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': firebaseConfig.projectId,
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': firebaseConfig.storageBucket,
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': firebaseConfig.messagingSenderId,
  'NEXT_PUBLIC_FIREBASE_APP_ID': firebaseConfig.appId,
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID': firebaseConfig.measurementId,
};

let updated = false;
let newContent = envContent;

// Update existing variables
Object.entries(updates).forEach(([key, value]) => {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(newContent)) {
    // Update existing
    newContent = newContent.replace(regex, `${key}=${value}`);
    updated = true;
    console.log(`✓ Updated ${key}`);
  } else {
    // Add new if doesn't exist
    newContent += `\n${key}=${value}`;
    updated = true;
    console.log(`✓ Added ${key}`);
  }
});

// Write updated .env file
if (updated) {
  try {
    fs.writeFileSync(ENV_FILE, newContent, 'utf8');
    console.log('\n✅ Firebase Client Configuration updated in .env file');
    console.log('\n📝 Next: You still need to add Firebase Admin SDK credentials');
    console.log('   Run: node update-firebase-admin.js <path-to-service-account-json>');
    console.log('   Or see QUICK_FIREBASE_SETUP.md for instructions');
  } catch (error) {
    console.error('❌ Error writing .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('ℹ️  No changes needed - variables already up to date');
}

