# Production Backend Fixes

## Changes Made

### 1. Improved Database Connection Error Handling
- **File:** `src/lib/db.ts`
- **Fix:** Moved error check from module load time to function call time
- **Benefit:** Prevents build failures if env vars are missing, provides better error messages

### 2. Added Database Error Handling to All API Routes
- **Files:** All files in `src/pages/api/resumes/`
- **Fix:** Wrapped `connectDB()` calls in try-catch blocks
- **Benefit:** Returns proper error responses instead of crashing

### 3. Better Error Messages
- All database connection errors now return clear messages
- Errors include guidance on what to check

## What to Check in Vercel

### 1. Environment Variables
Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Required Variables:**
```
MONGODB_URI=mongodb+srv://...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-email@...
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
```

**Important:** 
- `FIREBASE_PRIVATE_KEY` must include `\n` characters (newlines)
- Wrap the entire key in quotes
- Copy the key exactly as it appears in Firebase console

### 2. MongoDB Atlas Settings

**Network Access:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (`0.0.0.0/0`)
4. Or add Vercel's IP ranges

**Database User:**
- Ensure user has read/write permissions
- Verify password is correct in connection string

### 3. Test Health Endpoint

After deployment, test:
```bash
curl https://your-app.vercel.app/api/health
```

**Expected:** `{"status":"ok","timestamp":"...","uptime":...}`

**If it fails:**
- Check Vercel function logs
- Verify deployment succeeded
- Check for build errors

### 4. Check Function Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Click on any API route
3. View "Logs" tab
4. Look for error messages

**Common Errors:**

**"MONGODB_URI environment variable is not defined"**
→ Add `MONGODB_URI` in Vercel environment variables

**"Database connection failed"**
→ Check MongoDB Atlas network access and connection string

**"Firebase Admin not initialized"**
→ Check all Firebase Admin SDK environment variables

## Quick Fix Steps

1. **Add Missing Environment Variables**
   - Go to Vercel → Settings → Environment Variables
   - Add all required variables
   - Click "Save"

2. **Redeploy**
   - Go to Deployments
   - Click "Redeploy" on latest deployment
   - Or push a new commit

3. **Test Again**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

4. **Check Logs**
   - If still failing, check function logs for specific error

## Testing Production API

### 1. Health Check (No Auth Required)
```bash
curl https://your-app.vercel.app/api/health
```

### 2. With Authentication
1. Login to your app
2. Open browser console
3. Get token:
   ```javascript
   import { getAuth } from 'firebase/auth';
   const auth = getAuth();
   auth.currentUser.getIdToken().then(token => console.log(token));
   ```
4. Test:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://your-app.vercel.app/api/resumes/default
   ```

## Still Not Working?

See `PRODUCTION_TROUBLESHOOTING.md` for detailed troubleshooting steps.

