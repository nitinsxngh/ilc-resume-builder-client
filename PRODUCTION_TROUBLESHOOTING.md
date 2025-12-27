# Production Backend Troubleshooting Guide

## Common Issues and Solutions

### 1. Backend API Routes Not Working

#### Symptoms:
- `ERR_CONNECTION_REFUSED` errors
- `500 Internal Server Error`
- API endpoints return errors

#### Solutions:

**Check Environment Variables in Vercel:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these are set:
   - `MONGODB_URI` - Your MongoDB connection string
   - `FIREBASE_PROJECT_ID` - Firebase project ID
   - `FIREBASE_PRIVATE_KEY` - Firebase private key (with `\n` characters)
   - `FIREBASE_CLIENT_EMAIL` - Firebase service account email
   - All other Firebase Admin SDK variables

**Check Vercel Function Logs:**
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on any API route (e.g., `/api/health`)
3. Check the logs for errors

**Common Error Messages:**

```
MONGODB_URI environment variable is not defined
```
**Fix:** Add `MONGODB_URI` in Vercel environment variables

```
Database connection failed
```
**Fix:** 
- Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0` for all IPs)
- Verify MongoDB connection string format
- Check network access in MongoDB Atlas

```
Firebase Admin not initialized
```
**Fix:**
- Verify all Firebase Admin SDK environment variables are set
- Check `FIREBASE_PRIVATE_KEY` format (must include `\n` characters)
- Ensure private key is wrapped in quotes in Vercel

### 2. Health Check Not Working

Test the health endpoint:
```bash
curl https://your-app.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.45
}
```

**If it fails:**
- Check Vercel deployment logs
- Verify the function is deployed
- Check function timeout settings

### 3. Authentication Errors

**Error:** `401 Unauthorized` or `Invalid or expired token`

**Solutions:**
- Verify Firebase Admin SDK is configured correctly
- Check that `FIREBASE_PRIVATE_KEY` includes newline characters (`\n`)
- Ensure Firebase service account has correct permissions
- Verify frontend is sending the Authorization header

### 4. MongoDB Connection Issues

**Error:** `MongoServerError: connection timed out`

**Solutions:**
1. **MongoDB Atlas IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allow all IPs) OR
   - Add Vercel's IP ranges

2. **Connection String:**
   - Verify `MONGODB_URI` is correct
   - Check for special characters that need URL encoding
   - Ensure database name is correct

3. **Network Access:**
   - In MongoDB Atlas, ensure "Allow access from anywhere" is enabled
   - Or add specific Vercel IP ranges

### 5. Function Timeout

**Error:** `Function execution exceeded timeout`

**Solutions:**
- Check `vercel.json` - function timeout is set to 30 seconds
- Optimize database queries
- Add connection pooling
- Check MongoDB Atlas connection limits

### 6. Build Errors

**Error:** Build fails during deployment

**Solutions:**
- Check build logs in Vercel dashboard
- Verify all TypeScript files compile
- Check for missing dependencies
- Ensure `package.json` has all required packages

## Debugging Steps

### Step 1: Check Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```

### Step 2: Check Function Logs
1. Vercel Dashboard → Functions → Select function → Logs
2. Look for error messages
3. Check execution time

### Step 3: Test API Endpoint
```bash
# Get Firebase token from browser console after login
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-app.vercel.app/api/resumes/default
```

### Step 4: Verify Environment Variables
```bash
# In Vercel, check that all required variables are set:
- MONGODB_URI
- FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY
- FIREBASE_CLIENT_EMAIL
- FIREBASE_CLIENT_ID
- FIREBASE_PRIVATE_KEY_ID
- FIREBASE_AUTH_URI
- FIREBASE_TOKEN_URI
- FIREBASE_AUTH_PROVIDER_X509_CERT_URL
- FIREBASE_CLIENT_X509_CERT_URL
```

### Step 5: Check MongoDB Atlas
1. Go to MongoDB Atlas Dashboard
2. Check "Network Access" - should allow `0.0.0.0/0`
3. Check "Database Access" - user has read/write permissions
4. Test connection from MongoDB Atlas → Connect → Test connection

## Quick Fixes

### Fix 1: Re-deploy After Adding Environment Variables
After adding environment variables in Vercel:
1. Go to Deployments
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger redeploy

### Fix 2: Clear Function Cache
Vercel caches functions. To clear:
1. Redeploy the application
2. Or wait for cache to expire (usually 24 hours)

### Fix 3: Check Function Timeout
In `vercel.json`, increase timeout if needed:
```json
{
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

## Testing Production API

### Test Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```

### Test with Authentication
1. Login to your app
2. Open browser console
3. Get Firebase token:
   ```javascript
   import { getAuth } from 'firebase/auth';
   const auth = getAuth();
   auth.currentUser.getIdToken().then(token => console.log(token));
   ```
4. Test API:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://your-app.vercel.app/api/resumes/default
   ```

## Still Not Working?

1. **Check Vercel Status:** https://vercel-status.com
2. **Check MongoDB Atlas Status:** https://status.mongodb.com
3. **Review Vercel Documentation:** https://vercel.com/docs
4. **Check Function Logs:** Detailed error messages in Vercel dashboard

## Environment Variables Checklist

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `FIREBASE_PROJECT_ID` - Firebase project ID
- [ ] `FIREBASE_PRIVATE_KEY` - Private key (with `\n`)
- [ ] `FIREBASE_CLIENT_EMAIL` - Service account email
- [ ] `FIREBASE_CLIENT_ID` - Client ID
- [ ] `FIREBASE_PRIVATE_KEY_ID` - Private key ID
- [ ] `FIREBASE_AUTH_URI` - Auth URI
- [ ] `FIREBASE_TOKEN_URI` - Token URI
- [ ] `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` - Cert URL
- [ ] `FIREBASE_CLIENT_X509_CERT_URL` - Client cert URL
- [ ] `NEXT_PUBLIC_API_URL` - Set to `/api` (relative)
- [ ] All `NEXT_PUBLIC_FIREBASE_*` variables
- [ ] All `NEXT_PUBLIC_MERIPAHACHAN_*` variables

