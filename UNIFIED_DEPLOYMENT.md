# Unified Deployment Guide

## Overview

This application now runs both frontend (Next.js) and backend (Express API) on a single server, simplifying deployment and reducing infrastructure complexity.

## Architecture

- **Single Server**: Express server serves both API routes (`/api/*`) and Next.js frontend
- **Port**: Default port is `3000` (configurable via `PORT` environment variable)
- **Routes**:
  - `/api/*` - Backend API endpoints
  - `/health` - Health check endpoint
  - `/*` - Next.js frontend routes

## Prerequisites

1. **Node.js** 14+ installed
2. **MongoDB Atlas** connection string
3. **Firebase** credentials configured
4. **PM2** (recommended for production) - `npm install -g pm2`

## Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Frontend Configuration (NEXT_PUBLIC_* variables are exposed to browser)
NEXT_PUBLIC_APP_URL=https://resumebuilder.ilc.limited
NEXT_PUBLIC_API_URL=/api  # Use relative URL since same server

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Firebase Admin SDK (Backend only)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url

# MeriPahachan Configuration
NEXT_PUBLIC_MERIPAHACHAN_CLIENT_ID=DT9A677087
NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI=https://resumebuilder.ilc.limited/digilocker/callback
NEXT_PUBLIC_MERIPAHACHAN_AUTH_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/2/authorize
MERIPAHACHAN_CLIENT_SECRET=your-client-secret
MERIPAHACHAN_TOKEN_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/2/token
MERIPAHACHAN_USERINFO_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/1/user

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Deployment Steps

### 1. Build the Application

```bash
# Install dependencies
npm install

# Build Next.js frontend
npm run build
```

### 2. Start with PM2 (Recommended)

```bash
# Start the unified server
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### 3. Start Manually

```bash
# Set environment
export NODE_ENV=production

# Start server
npm start
```

### 4. Using systemd (Linux)

Create `/etc/systemd/system/resume-builder.service`:

```ini
[Unit]
Description=Resume Builder (Unified Frontend + Backend)
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/ilc-resume-builder-client-main-13-dec-updated
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable resume-builder
sudo systemctl start resume-builder
```

## Nginx Configuration

Example Nginx reverse proxy configuration:

```nginx
server {
    listen 80;
    server_name resumebuilder.ilc.limited;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL/HTTPS Setup

Use Let's Encrypt:

```bash
sudo certbot --nginx -d resumebuilder.ilc.limited
```

## Health Checks

- **Health Endpoint**: `https://resumebuilder.ilc.limited/health`
- **API Base**: `https://resumebuilder.ilc.limited/api`
- **Frontend**: `https://resumebuilder.ilc.limited`

## Monitoring

### PM2 Commands

```bash
pm2 list                    # List all processes
pm2 logs resume-builder     # View logs
pm2 monit                   # Monitor resources
pm2 restart resume-builder  # Restart
pm2 stop resume-builder     # Stop
pm2 delete resume-builder   # Remove
```

### systemd Commands

```bash
sudo systemctl status resume-builder  # Check status
sudo systemctl restart resume-builder # Restart
sudo journalctl -u resume-builder -f  # View logs
```

## Development

For local development with hot reload:

```bash
# Option 1: Run both separately (for faster frontend reload)
npm run dev:both

# Option 2: Run unified server (slower but closer to production)
npm run dev:unified
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

### Next.js Build Errors

- Clear `.next` directory: `rm -rf .next`
- Rebuild: `npm run build`

### CORS Errors

- Ensure `NEXT_PUBLIC_APP_URL` matches your domain
- Check CORS configuration in `server/index.js`

## Benefits of Unified Deployment

1. **Simplified Infrastructure**: One server instead of two
2. **Reduced Latency**: No network hop between frontend and backend
3. **Easier Deployment**: Single process to manage
4. **Cost Effective**: Fewer resources needed
5. **Simplified Configuration**: One port, one domain

## Migration from Separate Servers

If you previously had separate frontend and backend:

1. Update `NEXT_PUBLIC_API_URL` to `/api` (relative URL)
2. Deploy the unified server
3. Update your reverse proxy to point to port 3000
4. Remove the old backend server configuration

