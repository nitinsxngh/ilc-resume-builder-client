# Environment Variables Configuration Guide

## Overview

This project uses **separate `.env` files** for frontend and backend to maintain clear separation of concerns:

- **Frontend variables**: Stored in root `.env` file, prefixed with `NEXT_PUBLIC_` for client-side access
- **Backend variables**: Stored in `server/.env` file, only accessible server-side

## File Structure

```
ILC-Blockchain-Resume-Builder/
├── .env                    # Frontend environment variables (root)
├── server/
│   ├── .env               # Backend environment variables
│   ├── index.js           # Express server
│   └── ...                # Other backend files
├── src/                    # Frontend source code
└── package.json
```

## Environment Variables

### Frontend Variables (Client-Side Accessible)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key for client | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase analytics ID | `G-ABC123` |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5001/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `ILC Blockchain Resume Builder` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |

### Backend Variables (Server-Side Only)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment mode | `development` |
| `FIREBASE_PROJECT_ID` | Firebase project ID for admin SDK | `your-project-id` |
| `FIREBASE_PRIVATE_KEY_ID` | Firebase private key ID | `abc123...` |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | `-----BEGIN PRIVATE KEY-----...` |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | `firebase-adminsdk@...` |
| `FIREBASE_CLIENT_ID` | Firebase client ID | `123456789` |
| `FIREBASE_AUTH_URI` | Firebase auth URI | `https://accounts.google.com/...` |
| `FIREBASE_TOKEN_URI` | Firebase token URI | `https://oauth2.googleapis.com/...` |
| `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` | Firebase cert URL | `https://www.googleapis.com/...` |
| `FIREBASE_CLIENT_X509_CERT_URL` | Firebase client cert URL | `https://www.googleapis.com/...` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:3001` |

## Configuration Files

### Root `.env` File

```env
# ========================================
# FRONTEND ENVIRONMENT VARIABLES
# ========================================
# These variables are accessible to the Next.js frontend
# and are prefixed with NEXT_PUBLIC_ for client-side access

# Firebase Client Configuration (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Frontend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_APP_NAME=ILC Blockchain Resume Builder
NEXT_PUBLIC_APP_VERSION=1.0.0

# ========================================
# BACKEND ENVIRONMENT VARIABLES
# ========================================
# These variables are only accessible to the Express backend server

# MongoDB Configuration (Backend)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server Configuration (Backend)
PORT=5001
NODE_ENV=development

# Firebase Admin SDK Configuration (Backend Service Account)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_cert_url

# Rate Limiting (Backend)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration (Backend)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

## How It Works

### Frontend (Next.js)
- Next.js automatically loads `.env` files from the project root
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are only available during build time

### Backend (Express)
- The server uses `dotenv.config({ path: './.env' })` to load from its own directory
- All variables in `server/.env` are available to the server
- Environment variables are loaded before any other code runs

## Security Considerations

1. **Never expose backend variables to the frontend**
   - Backend variables like `MONGODB_URI` and Firebase private keys should never have `NEXT_PUBLIC_` prefix
   - These contain sensitive information

2. **Frontend variables are public**
   - Variables with `NEXT_PUBLIC_` prefix are bundled with the client code
   - Only include non-sensitive configuration needed by the browser

3. **Environment-specific files**
   - `.env.local` for local development overrides
   - `.env.production` for production environment
   - `.env.example` for documentation (never commit actual values)

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure `.env` file is in the project root
   - Check file permissions
   - Verify no syntax errors in `.env` file

2. **Frontend can't access variables**
   - Ensure variables are prefixed with `NEXT_PUBLIC_`
   - Restart the development server after changes

3. **Backend can't access variables**
   - Check that `dotenv.config()` is called before other imports
   - Verify the path to `.env` file is correct

4. **CORS issues**
   - Ensure `ALLOWED_ORIGINS` includes your frontend URL
   - Check that backend is running on the correct port

### Validation

Use this command to validate your `.env` file:

```bash
# Check for syntax errors
node -e "require('dotenv').config(); console.log('Environment loaded successfully')"

# List all variables (be careful with sensitive data)
node -e "require('dotenv').config(); console.log(Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_') || k.startsWith('FIREBASE_') || k.startsWith('MONGODB_') || k === 'PORT' || k === 'NODE_ENV'))"
```
