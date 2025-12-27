# Quick Start Guide

## Running Frontend and Backend Together

### Option 1: Unified Server (Recommended - Single Server)
Run both frontend and backend on the same server (port 3000):

```bash
# First, build Next.js (one time)
npm run build

# Then start unified server
npm run dev:unified
# or
./start-unified.sh
```

**Benefits:**
- Single process to manage
- No CORS issues
- Simpler configuration
- Closer to production setup

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api
- Health: http://localhost:3000/health

### Option 2: Using the Start Script (Separate Servers)
```bash
./start-dev.sh
```
This will prompt you to choose between unified or separate servers.

### Option 3: Separate Servers (Two Terminals)

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

**Note:** For separate servers, make sure `.env` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Option 4: Using concurrently (Optional)

If you want to run both in a single terminal with colored output:

1. Install concurrently:
   ```bash
   npm install --save-dev concurrently
   ```

2. Add to package.json scripts:
   ```json
   "dev:all": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" --names \"BACKEND,FRONTEND\" --prefix-colors \"blue,green\""
   ```

3. Run:
   ```bash
   npm run dev:all
   ```

## Verify Everything is Running

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **API Base**: http://localhost:5001/api

## Environment Setup

### For Unified Server (Recommended):
```env
MONGODB_URI=mongodb+srv://hunnidassets:hunnidassets%40123@hunnidassets.6bll8ud.mongodb.net/ilc_resume?retryWrites=true&w=majority&appName=hunnidassets
PORT=3000
# NEXT_PUBLIC_API_URL can be omitted or set to /api (relative URL)
NEXT_PUBLIC_API_URL=/api
```

### For Separate Servers:
```env
MONGODB_URI=mongodb+srv://hunnidassets:hunnidassets%40123@hunnidassets.6bll8ud.mongodb.net/ilc_resume?retryWrites=true&w=majority&appName=hunnidassets
PORT=5001
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Troubleshooting

1. **Port already in use**: Make sure ports 3000 and 5001 are not in use
2. **MongoDB connection failed**: Check your MongoDB URI and network access
3. **Backend not starting**: Check if all dependencies are installed (`npm install`)

