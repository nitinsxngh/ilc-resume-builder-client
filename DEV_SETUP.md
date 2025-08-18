# Development Setup Guide

## Quick Start

### Option 1: Start Both Servers (Recommended)
```bash
npm run dev:both
```
This will open both servers in separate terminal windows.

### Option 2: Start Servers Individually

**Frontend (Next.js) - Port 3000:**
```bash
npm run dev:frontend
# or
./start-frontend.sh
```

**Backend (Express) - Port 5001:**
```bash
npm run dev:backend
# or
./start-backend.sh
```

## Port Configuration

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5001`
- **API Base**: `http://localhost:5001/api`
- **Health Check**: `http://localhost:5001/health`

## Environment Variables

**Important**: This project uses a single `.env` file in the root directory with separate variables for frontend and backend.

### Frontend Variables (Client-Side)
- Prefixed with `NEXT_PUBLIC_` for Firebase client configuration
- API URL configuration
- App metadata

### Backend Variables (Server-Side)
- MongoDB connection string
- Server configuration (PORT, NODE_ENV)
- Firebase Admin SDK credentials
- Rate limiting and CORS settings

**See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for complete configuration details.**

Make sure your `.env` file contains:
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
# ... other NEXT_PUBLIC_ variables

# Backend
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
# ... other backend variables
```

## Troubleshooting

### CORS Issues
- Ensure backend is running on port 5001
- Check that frontend API calls use `http://localhost:5001/api`
- Verify CORS configuration in `server/index.js`

### Port Conflicts
- Port 5000 is often used by macOS ControlCenter
- Backend is configured to use port 5001
- Frontend uses port 3000

### MongoDB Connection
- Check your MongoDB Atlas IP whitelist
- Verify connection string in `.env`
- Ensure network connectivity

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:both` | Start both frontend and backend |
| `npm run dev:frontend` | Start only frontend |
| `npm run dev:backend` | Start only backend |
| `./start-dev.sh` | Start both servers (script) |
| `./start-frontend.sh` | Start frontend (script) |
| `./start-backend.sh` | Start backend (script) |

## File Structure

```
ILC-Blockchain-Resume-Builder/
├── .env                    # Environment variables
├── start-dev.sh           # Start both servers
├── start-frontend.sh      # Start frontend only
├── start-backend.sh       # Start backend only
├── src/                   # Frontend source code
├── server/                # Backend source code
└── package.json           # Dependencies and scripts
```
