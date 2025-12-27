# Vercel Timeout Fix for Production

## Issue
API routes are timing out on Vercel production deployment at https://resumebuilder.ilc.limited

## Root Cause
- MongoDB connection on cold start takes time
- Function timeout was set to 30 seconds
- Frontend timeout was also 30 seconds
- Cold starts in serverless functions can be slow

## Fixes Applied

### 1. Increased Function Timeout
- **File:** `vercel.json`
- **Change:** Increased `maxDuration` from 30 to 60 seconds
- **Note:** Requires Vercel Pro plan (Hobby plan max is 10 seconds)

### 2. Optimized MongoDB Connection
- **File:** `src/lib/db.ts`
- **Changes:**
  - Added `serverSelectionTimeoutMS: 10000` (10 seconds)
  - Added `socketTimeoutMS: 45000` (45 seconds)
  - Added `connectTimeoutMS: 10000` (10 seconds)
  - Set `maxPoolSize: 1` (optimal for serverless)
  - Set `minPoolSize: 0` (allows connection to close when idle)

### 3. Increased Frontend Timeout
- **File:** `src/services/resumeApi.ts`
- **Change:** Increased timeout from 30 to 50 seconds (slightly less than function timeout)

## Vercel Plan Requirements

### Hobby Plan (Free)
- **Max Function Duration:** 10 seconds
- **Issue:** May not be enough for MongoDB cold start
- **Solution:** 
  - Upgrade to Pro plan, OR
  - Optimize MongoDB connection further, OR
  - Use MongoDB connection pooling service

### Pro Plan ($20/month)
- **Max Function Duration:** 60 seconds (or up to 300s with Enterprise)
- **Recommended:** This plan allows the 60-second timeout

## Additional Optimizations

### 1. MongoDB Atlas Optimization
- Use MongoDB Atlas connection string with `retryWrites=true`
- Ensure MongoDB Atlas is in the same region as Vercel (if possible)
- Check MongoDB Atlas performance metrics

### 2. Connection Caching
The code already caches connections using global variables, which helps with:
- Warm function invocations (faster)
- Reusing existing connections

### 3. Cold Start Mitigation
- First request after inactivity will be slower (cold start)
- Subsequent requests will be faster (warm)
- Consider using Vercel's Edge Functions for faster cold starts (if applicable)

## Testing After Fix

1. **Test Health Endpoint:**
   ```bash
   curl https://resumebuilder.ilc.limited/api/health
   ```

2. **Test with Authentication:**
   - Login to the app
   - Check browser console for errors
   - Verify API calls complete successfully

3. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions
   - Check execution time
   - Look for timeout errors

## If Still Timing Out

### Option 1: Upgrade Vercel Plan
Upgrade to Pro plan for 60-second timeout support

### Option 2: Further Optimize MongoDB
- Use MongoDB connection string with `maxPoolSize=1`
- Consider using MongoDB Atlas Serverless (faster connections)
- Check MongoDB Atlas region matches Vercel region

### Option 3: Add Connection Retry Logic
Add retry logic for failed connections (already partially implemented)

### Option 4: Use Edge Functions
For read-only operations, consider Vercel Edge Functions (faster cold starts)

## Monitoring

After deployment, monitor:
1. **Function execution time** in Vercel dashboard
2. **MongoDB connection time** in MongoDB Atlas
3. **Error rates** in Vercel logs
4. **User-reported timeouts**

## Expected Behavior

- **Cold Start:** First request may take 5-15 seconds
- **Warm Requests:** Should complete in 1-3 seconds
- **With Cached Connection:** Should be very fast (< 1 second)

If requests consistently take > 30 seconds, there may be a deeper issue with MongoDB Atlas connectivity.

