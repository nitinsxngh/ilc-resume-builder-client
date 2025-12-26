# Backend Setup Guide

## Overview

The backend server is now integrated into the same codebase as the frontend. It runs on port 5001 and connects to MongoDB Atlas.

## Quick Start

1. **Ensure .env file has required variables:**
   ```env
   MONGODB_URI=mongodb+srv://hunnidassets:hunnidassets%40123@hunnidassets.6bll8ud.mongodb.net/ilc_resume?retryWrites=true&w=majority&appName=hunnidassets
   PORT=5001
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

2. **Start the backend server:**
   ```bash
   npm run dev:backend
   ```

3. **Start the frontend (in another terminal):**
   ```bash
   npm run dev:frontend
   ```

4. **Or start both together:**
   ```bash
   npm run dev:both
   # or
   ./start-dev.sh
   ```

## Data Storage

- **Database**: MongoDB Atlas
- **Database Name**: `ilc_resume`
- **Collection**: `resumes`
- **Connection**: Uses `MONGODB_URI` from `.env` file

## API Endpoints

### Base URL
- Development: `http://localhost:5001/api`
- Health Check: `http://localhost:5001/health`

### Resume Endpoints
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/default` - Get default resume
- `POST /api/resumes` - Create resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### Verification Endpoints
- `POST /api/resumes/:id/verification` - Save verification data
- `GET /api/resumes/:id/verification` - Get verification data

## Authentication

All endpoints require Firebase authentication. The frontend automatically includes the Firebase ID token in the `Authorization` header.

## Project Structure

```
server/
├── index.js                 # Main server entry point
├── config/
│   └── database.js         # MongoDB connection
├── models/
│   └── Resume.js           # Resume Mongoose model
├── routes/
│   ├── resumes.js          # Resume API routes
│   └── verification.js     # Verification API routes
└── middleware/
    └── auth.js             # Firebase auth middleware
```

## Troubleshooting

1. **Backend won't start:**
   - Check if MongoDB URI is correct in `.env`
   - Ensure port 5001 is not in use
   - Check Node.js version (14+ required)

2. **Connection timeout errors:**
   - Verify MongoDB Atlas allows connections from your IP
   - Check MongoDB URI format
   - Ensure network connectivity

3. **Authentication errors:**
   - Verify Firebase credentials in `.env`
   - Check if Firebase Admin is properly initialized

