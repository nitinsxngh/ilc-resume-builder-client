# Quick Firebase Admin SDK Setup

## Option 1: Automatic Update (Recommended)

1. **Get your Firebase service account JSON:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: **forum-ilc**
   - Settings → Project settings → Service accounts
   - Click **"Generate new private key"**
   - Download the JSON file (e.g., `forum-ilc-firebase-adminsdk-xxxxx.json`)

2. **Run the update script:**
   ```bash
   node update-firebase-admin.js ~/Downloads/forum-ilc-firebase-adminsdk-xxxxx.json
   ```
   (Replace the path with your actual downloaded file path)

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## Option 2: Manual Update

If you prefer to manually update, add these to your `.env` file:

```env
FIREBASE_PROJECT_ID=forum-ilc
FIREBASE_PRIVATE_KEY_ID=<from-json>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n<your-key>\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=<from-json>
FIREBASE_CLIENT_ID=<from-json>
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=<from-json>
```

Replace `<from-json>` with values from your service account JSON file.

## Verify It Works

After updating and restarting, you should see:
- ✅ No more "Firebase Admin initialization failed" errors
- ✅ Authentication working properly

## Need Help?

See `FIREBASE_ADMIN_SETUP.md` for detailed step-by-step instructions.

