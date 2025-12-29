# Firebase Admin SDK Setup Guide

## Why You Need This

You have **client-side** Firebase config (`NEXT_PUBLIC_FIREBASE_*`) which works in the browser, but the **server-side** API routes need **Firebase Admin SDK** credentials to verify authentication tokens.

## Step 1: Get Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **forum-ilc**
3. Click the **gear icon** ⚙️ → **Project settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (e.g., `forum-ilc-firebase-adminsdk-xxxxx.json`)

## Step 2: Extract Values from JSON

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "forum-ilc",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@forum-ilc.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40forum-ilc.iam.gserviceaccount.com"
}
```

## Step 3: Add to Your `.env` File

Add these variables to your **root `.env` file** (NOT prefixed with `NEXT_PUBLIC_`):

```env
# ========================================
# Firebase Admin SDK (Server-Side Only)
# ========================================
# These are for server-side authentication verification
# DO NOT prefix with NEXT_PUBLIC_ (these are secret!)

FIREBASE_PROJECT_ID=forum-ilc
FIREBASE_PRIVATE_KEY_ID=your-private-key-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@forum-ilc.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id-from-json
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40forum-ilc.iam.gserviceaccount.com
```

## Important Notes

1. **Keep the quotes** around `FIREBASE_PRIVATE_KEY` - it contains newlines
2. **Keep the `\n` characters** in the private key - they represent newlines
3. **Do NOT add `NEXT_PUBLIC_` prefix** - these are server-side secrets
4. **Restart your dev server** after adding these variables

## Quick Copy Template

Replace the values with your actual service account JSON:

```env
FIREBASE_PROJECT_ID=forum-ilc
FIREBASE_PRIVATE_KEY_ID=<from-json>
FIREBASE_PRIVATE_KEY="<from-json-with-quotes-and-\n>"
FIREBASE_CLIENT_EMAIL=<from-json>
FIREBASE_CLIENT_ID=<from-json>
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=<from-json>
```

## Verify It Works

After adding the variables and restarting your server, you should see:
- ✅ `Firebase Admin initialized successfully` (if `DEBUG_FIREBASE=true`)
- No more "Firebase Admin initialization failed" errors

## Development Mode

If you don't want to set up Firebase Admin in development, the app will automatically use development mode authentication (decoding tokens without verification). This is fine for local development but **not for production**.

