# Vercel Environment Variable Fix

## Critical Issue

The `NEXT_PUBLIC_API_URL` in Vercel is set to `https://resumeapi.ilc.limited/api`, but since we're using Next.js API routes, it should be `/api` (relative URL).

## Why This Matters

- **Current Setup:** Frontend tries to connect to `https://resumeapi.ilc.limited/api` (separate server)
- **Correct Setup:** Frontend should use `/api` (Next.js API routes on same domain)
- **Result:** Timeout errors because `resumeapi.ilc.limited` doesn't exist or isn't configured

## Fix in Vercel Dashboard

### Step 1: Update Environment Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_API_URL`
3. **Change it from:**
   ```
   https://resumeapi.ilc.limited/api
   ```
   **To:**
   ```
   /api
   ```
4. Click **Save**

### Step 2: Redeploy

After updating the environment variable:
1. Go to **Deployments**
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger redeploy

## Alternative: Remove the Variable

If you remove `NEXT_PUBLIC_API_URL` entirely, the code will automatically use `/api` (relative URL).

## Why Relative URLs Work

- Next.js API routes are served from the same domain as the frontend
- `/api` automatically resolves to `https://resumebuilder.ilc.limited/api`
- No CORS issues
- No separate server needed
- Works perfectly with Vercel serverless functions

## Verification

After updating and redeploying:

1. **Test Health Endpoint:**
   ```bash
   curl https://resumebuilder.ilc.limited/api/health
   ```

2. **Check Browser Console:**
   - Should see requests to `/api/resumes/default` (relative)
   - Not `https://resumeapi.ilc.limited/api/resumes/default`

3. **Test Database Connection:**
   ```bash
   curl https://resumebuilder.ilc.limited/api/test-db
   ```

## Code Update

The code has been updated to automatically use relative URLs even if `NEXT_PUBLIC_API_URL` points to a different domain (like `resumeapi.ilc.limited`). However, it's still best practice to set it to `/api` in Vercel.

## Environment Variables Checklist

**Required in Vercel:**
- ✅ `MONGODB_URI` - MongoDB connection string
- ✅ `NEXT_PUBLIC_API_URL` - Set to `/api` (relative URL)
- ✅ All Firebase Admin SDK variables
- ✅ All `NEXT_PUBLIC_FIREBASE_*` variables
- ✅ All MeriPahachan variables

**Important:** `NEXT_PUBLIC_API_URL=/api` (not an absolute URL)

