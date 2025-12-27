# Backend Testing Guide

## Test Credentials
- **Email**: `hirenitinsingh@gmail.com`
- **Password**: `m49qmhihux`

## Quick Test

### 1. Check if Backend is Running

```bash
# Test health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":123.45}
```

### 2. Test API Endpoints

#### Health Check (No Auth Required)
```bash
curl http://localhost:3000/health
```

#### Get Resumes (Auth Required)
```bash
# This will fail without authentication
curl http://localhost:3000/api/resumes

# Expected: 401 Unauthorized
```

## Full Testing with Authentication

### Step 1: Start the Backend

**Option A: Unified Server (Recommended)**
```bash
# Build Next.js first
npm run build

# Start unified server
npm run dev:unified
```

**Option B: Backend Only**
```bash
npm run dev:backend
```

### Step 2: Start the Frontend

```bash
npm run dev:frontend
```

### Step 3: Login and Get Token

1. Open browser: http://localhost:3000
2. Login with:
   - Email: `hirenitinsingh@gmail.com`
   - Password: `m49qmhihux`
3. Open browser console (F12)
4. Run this to get the Firebase ID token:
   ```javascript
   import { getAuth } from 'firebase/auth';
   const auth = getAuth();
   const user = auth.currentUser;
   if (user) {
     user.getIdToken().then(token => {
       console.log('Token:', token);
       // Copy this token for API testing
     });
   }
   ```

### Step 4: Test API with Token

```bash
# Replace YOUR_TOKEN with the token from step 3
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/resumes

# Get default resume
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/resumes/default
```

## Automated Testing Script

Run the test script:

```bash
node test-backend.js
```

Or the complete test:

```bash
node test-backend-complete.js
```

## Expected Test Results

### ✅ Success Indicators

1. **Health Check**: Returns `200 OK` with status object
2. **MongoDB Connection**: Server logs show "✅ MongoDB connected successfully"
3. **Authentication**: API returns `401` without token, `200` with valid token
4. **Resume Endpoints**: Can create, read, update resumes with valid token

### ❌ Common Issues

1. **Backend not running**
   - Error: `ECONNREFUSED` or `Connection timeout`
   - Fix: Start the backend server

2. **MongoDB connection failed**
   - Error: `MONGODB_URI is not defined`
   - Fix: Check `.env` file has `MONGODB_URI` set

3. **401 Unauthorized**
   - Error: `Authentication failed`
   - Fix: Make sure you're sending a valid Firebase ID token

4. **CORS errors**
   - Error: `Not allowed by CORS`
   - Fix: Check `NEXT_PUBLIC_APP_URL` in `.env` matches your frontend URL

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] MongoDB connection successful (check server logs)
- [ ] Frontend can connect to backend
- [ ] Login works with test credentials
- [ ] Can fetch default resume after login
- [ ] Can save resume data
- [ ] Verification data can be saved
- [ ] API returns proper error messages for invalid requests

## Manual API Testing with Postman/Insomnia

1. **Setup**:
   - Base URL: `http://localhost:3000/api`
   - Get Firebase token (see Step 3 above)

2. **Headers**:
   ```
   Authorization: Bearer YOUR_FIREBASE_TOKEN
   Content-Type: application/json
   ```

3. **Endpoints to Test**:
   - `GET /api/resumes` - Get all resumes
   - `GET /api/resumes/default` - Get default resume
   - `POST /api/resumes` - Create new resume
   - `PUT /api/resumes/:id` - Update resume
   - `GET /health` - Health check (no auth)

## Performance Testing

```bash
# Test health endpoint response time
time curl http://localhost:3000/health

# Test with multiple requests
for i in {1..10}; do
  curl -s http://localhost:3000/health > /dev/null
done
```

## Troubleshooting

### Backend won't start
1. Check if port 3000 is available: `lsof -i :3000`
2. Check MongoDB URI is correct in `.env`
3. Check Node.js version: `node --version` (should be 14+)
4. Check dependencies: `npm install`

### Can't connect to MongoDB
1. Verify MongoDB URI format
2. Check MongoDB Atlas IP whitelist
3. Check network connectivity
4. Verify database name and credentials

### Authentication fails
1. Verify Firebase Admin SDK is configured
2. Check Firebase project ID matches
3. Verify service account credentials
4. Check token expiration (tokens expire after 1 hour)

