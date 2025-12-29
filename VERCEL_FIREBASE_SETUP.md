# Add Firebase Admin SDK to Vercel Production

## Quick Fix for "Authentication service not configured" Error

The error you're seeing means Vercel production doesn't have the Firebase Admin SDK environment variables. Follow these steps:

## Step 1: Get Your Firebase Admin Credentials

If you still have the JSON file, you can use it. Otherwise:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **forum-ilc**
3. Settings → Project settings → Service accounts
4. Click **"Generate new private key"**
5. Download the JSON file

## Step 2: Add Environment Variables to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **ilc-resume-builder-client** (or your project name)
3. Go to **Settings** → **Environment Variables**
4. Add each of these variables:

#### Required Firebase Admin SDK Variables:

```
FIREBASE_PROJECT_ID
Value: forum-ilc

FIREBASE_PRIVATE_KEY_ID
Value: <from-json-file>

FIREBASE_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\n<your-key>\n-----END PRIVATE KEY-----"
⚠️ IMPORTANT: Keep the quotes and \n characters!

FIREBASE_CLIENT_EMAIL
Value: <from-json-file>

FIREBASE_CLIENT_ID
Value: <from-json-file>

FIREBASE_AUTH_URI
Value: https://accounts.google.com/o/oauth2/auth

FIREBASE_TOKEN_URI
Value: https://oauth2.googleapis.com/token

FIREBASE_AUTH_PROVIDER_X509_CERT_URL
Value: https://www.googleapis.com/oauth2/v1/certs

FIREBASE_CLIENT_X509_CERT_URL
Value: <from-json-file>
```

5. **Important**: Select **Production**, **Preview**, and **Development** for each variable
6. Click **Save** for each variable

### Option B: Using Vercel CLI

If you have Vercel CLI installed, you can use the helper script:

```bash
# First, run this to see what values to add
node show-vercel-env.js

# Then add them using Vercel CLI
vercel env add FIREBASE_PROJECT_ID production
# (Enter: forum-ilc)

vercel env add FIREBASE_PRIVATE_KEY production
# (Paste the full private key with quotes and \n)
```

## Step 3: Redeploy

After adding all variables:

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic redeploy

## Step 4: Verify

After redeployment, check:
- ✅ No more "Authentication service not configured" errors
- ✅ API calls to `/api/resumes/default` work
- ✅ Authentication works properly

## Quick Reference: Values from Your Local .env

If you want to copy values from your local `.env` file, run:

```bash
node show-vercel-env.js
```

This will show you all the Firebase Admin SDK values formatted for Vercel.

## Troubleshooting

### "Authentication service not configured" still appears?

1. **Check all variables are added**: Make sure all 9 Firebase Admin variables are in Vercel
2. **Check variable names**: They should NOT have `NEXT_PUBLIC_` prefix
3. **Check FIREBASE_PRIVATE_KEY format**: Must have quotes and `\n` characters
4. **Redeploy**: After adding variables, you must redeploy
5. **Check Vercel logs**: Go to Deployments → Latest → Functions tab to see error logs

### Private Key Format Issues?

The `FIREBASE_PRIVATE_KEY` in Vercel should look like:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

- Keep the quotes around the entire value
- Keep all `\n` characters (they represent newlines)
- The key should be on one line in Vercel (with `\n` characters)

### Still Not Working?

1. Check Vercel function logs for detailed error messages
2. Verify Firebase service account has proper permissions
3. Make sure you're using the correct Firebase project (forum-ilc)

