# Vercel Deployment Guide

This guide covers deploying the Resume Builder application to Vercel with both frontend and backend running as serverless functions.

## Architecture

- **Frontend**: Next.js application (automatically handled by Vercel)
- **Backend**: Next.js API routes (serverless functions)
- **Database**: MongoDB Atlas (external)
- **Authentication**: Firebase (external)

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Database configured and accessible
3. **Firebase**: Authentication configured
4. **GitHub/GitLab/Bitbucket**: Repository for deployment

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js

### 3. Configure Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

#### Required Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url

# Frontend (NEXT_PUBLIC_* variables are exposed to browser)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# MeriPahachan
NEXT_PUBLIC_MERIPAHACHAN_CLIENT_ID=DT9A677087
NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI=https://your-app.vercel.app/digilocker/callback
NEXT_PUBLIC_MERIPAHACHAN_AUTH_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/2/authorize
MERIPAHACHAN_CLIENT_SECRET=your-client-secret
MERIPAHACHAN_TOKEN_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/2/token
MERIPAHACHAN_USERINFO_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/1/user
```

### 4. Important Notes

#### Firebase Private Key

When adding `FIREBASE_PRIVATE_KEY` in Vercel:
- Keep the `\n` characters in the key
- Wrap the entire key in quotes
- The key should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`

#### API URL Configuration

- Set `NEXT_PUBLIC_API_URL=/api` (relative URL)
- This ensures API calls work on any Vercel domain
- The frontend will automatically use the same domain

#### MeriPahachan Redirect URI

- Update `NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI` to your Vercel domain
- Example: `https://your-app.vercel.app/digilocker/callback`

### 5. Deploy

1. Click "Deploy" in Vercel dashboard
2. Vercel will:
   - Install dependencies
   - Build the Next.js application
   - Deploy to production
3. Your app will be available at `https://your-app.vercel.app`

### 6. Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Update environment variables with the new domain:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI`

## API Routes

All API routes are available at `/api/*`:

- `GET /api/health` - Health check
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/default` - Get default resume
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/verification` - Save verification data
- `GET /api/resumes/:id/verification` - Get verification data
- `POST /api/resumes/:id/duplicate` - Duplicate resume
- `POST /api/resumes/:id/set-default` - Set default resume

## MongoDB Connection

The application uses a serverless-compatible MongoDB connection that:
- Caches connections across function invocations
- Reuses connections when possible
- Handles connection errors gracefully

## Firebase Authentication

Firebase Admin SDK is initialized in each serverless function:
- Verifies ID tokens from the frontend
- Provides user authentication for API routes
- Works seamlessly with Vercel's serverless environment

## Troubleshooting

### Build Errors

1. **TypeScript Errors**: Ensure all TypeScript files compile
   ```bash
   npm run build
   ```

2. **Missing Dependencies**: Check `package.json` includes all required packages
   - `mongoose`
   - `firebase-admin`
   - `next`

### Runtime Errors

1. **MongoDB Connection Failed**:
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist (allow all IPs: `0.0.0.0/0`)
   - Verify network access in MongoDB Atlas

2. **Firebase Authentication Failed**:
   - Verify all Firebase Admin SDK environment variables
   - Check `FIREBASE_PRIVATE_KEY` format (keep `\n` characters)
   - Verify service account has correct permissions

3. **API Routes Not Found**:
   - Ensure API routes are in `src/pages/api/` directory
   - Check file naming matches route structure
   - Verify `vercel.json` configuration

### Environment Variables

- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Never expose sensitive keys with `NEXT_PUBLIC_` prefix
- Use Vercel's environment variable interface for secure storage

## Performance Optimization

1. **Database Connection Caching**: Already implemented for serverless
2. **Function Timeout**: Set to 30 seconds (configurable in `vercel.json`)
3. **Cold Starts**: First request may be slower, subsequent requests are fast

## Monitoring

1. **Vercel Dashboard**: View function logs and performance
2. **MongoDB Atlas**: Monitor database connections and queries
3. **Firebase Console**: Monitor authentication requests

## Continuous Deployment

Vercel automatically deploys on:
- Push to main/master branch (production)
- Push to other branches (preview deployments)
- Pull requests (preview deployments)

## Local Testing

Test Vercel deployment locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Firebase Documentation](https://firebase.google.com/docs)

