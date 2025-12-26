# Quick Start Guide

## Running Frontend and Backend Together

### Option 1: Using the Start Script (Recommended)
```bash
./start-dev.sh
```
This will start both frontend and backend in separate terminal windows (macOS) or in the background (Linux/Unix).

### Option 2: Using npm Scripts
```bash
npm run dev:both
```
Same as above, uses the start-dev.sh script.

### Option 3: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
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

Make sure your `.env` file has:
```env
MONGODB_URI=mongodb+srv://hunnidassets:hunnidassets%40123@hunnidassets.6bll8ud.mongodb.net/ilc_resume?retryWrites=true&w=majority&appName=hunnidassets
PORT=5001
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Troubleshooting

1. **Port already in use**: Make sure ports 3000 and 5001 are not in use
2. **MongoDB connection failed**: Check your MongoDB URI and network access
3. **Backend not starting**: Check if all dependencies are installed (`npm install`)

