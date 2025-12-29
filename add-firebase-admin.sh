#!/bin/bash

# Script to add Firebase Admin SDK variables to .env file

ENV_FILE=".env"

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Check if Firebase Admin variables already exist
if grep -q "FIREBASE_PROJECT_ID=" "$ENV_FILE" && ! grep -q "^# Firebase Admin SDK" "$ENV_FILE"; then
    echo "⚠️  Firebase Admin SDK variables already exist in .env"
    echo "Skipping addition..."
    exit 0
fi

# Add Firebase Admin SDK section
echo "" >> "$ENV_FILE"
echo "# ========================================" >> "$ENV_FILE"
echo "# Firebase Admin SDK (Server-Side Only)" >> "$ENV_FILE"
echo "# ========================================" >> "$ENV_FILE"
echo "# These are for server-side authentication verification" >> "$ENV_FILE"
echo "# DO NOT prefix with NEXT_PUBLIC_ (these are secret!)" >> "$ENV_FILE"
echo "# Get these from Firebase Console > Project Settings > Service Accounts" >> "$ENV_FILE"
echo "" >> "$ENV_FILE"
echo "FIREBASE_PROJECT_ID=forum-ilc" >> "$ENV_FILE"
echo "FIREBASE_PRIVATE_KEY_ID=REPLACE_WITH_YOUR_PRIVATE_KEY_ID" >> "$ENV_FILE"
echo "FIREBASE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\nREPLACE_WITH_YOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\"" >> "$ENV_FILE"
echo "FIREBASE_CLIENT_EMAIL=REPLACE_WITH_YOUR_SERVICE_ACCOUNT_EMAIL" >> "$ENV_FILE"
echo "FIREBASE_CLIENT_ID=REPLACE_WITH_YOUR_CLIENT_ID" >> "$ENV_FILE"
echo "FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth" >> "$ENV_FILE"
echo "FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token" >> "$ENV_FILE"
echo "FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs" >> "$ENV_FILE"
echo "FIREBASE_CLIENT_X509_CERT_URL=REPLACE_WITH_YOUR_CERT_URL" >> "$ENV_FILE"

echo "✅ Firebase Admin SDK variables added to .env file"
echo ""
echo "📝 Next steps:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/"
echo "2. Select project: forum-ilc"
echo "3. Go to Project Settings > Service Accounts"
echo "4. Click 'Generate new private key'"
echo "5. Download the JSON file"
echo "6. Replace the REPLACE_WITH_* values in .env with values from the JSON file"
echo ""
echo "See FIREBASE_ADMIN_SETUP.md for detailed instructions"

