# Production Deployment Guide

## Overview

This guide covers deploying both the frontend and backend to production.

## Prerequisites

1. **MongoDB Atlas** - Database configured and accessible
2. **Firebase** - Authentication configured
3. **Server** - VPS/Cloud server with Node.js 14+ installed
4. **Domain** - Domain name configured (e.g., resumebuilder.ilc.limited)

## Environment Variables

### Frontend (.env or production environment)

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://resumeapi.ilc.limited/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# MeriPahachan Configuration
NEXT_PUBLIC_MERIPAHACHAN_CLIENT_ID=DT9A677087
NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI=https://resumebuilder.ilc.limited/digilocker/callback
NEXT_PUBLIC_MERIPAHACHAN_AUTH_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/2/authorize

# App URL
NEXT_PUBLIC_APP_URL=https://resumebuilder.ilc.limited
```

### Backend (server/.env or production environment)

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://hunnidassets:hunnidassets%40123@hunnidassets.6bll8ud.mongodb.net/ilc_resume?retryWrites=true&w=majority&appName=hunnidassets

# Server Configuration
PORT=5001
NODE_ENV=production

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# MeriPahachan
MERIPAHACHAN_CLIENT_SECRET=e878bfd2b55d33c71c54
MERIPAHACHAN_TOKEN_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/2/token
MERIPAHACHAN_USERINFO_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/1/user
```

## Deployment Options

### Option 1: Using PM2 (Recommended for Backend)

1. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

2. **Start backend with PM2:**
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

3. **Save PM2 configuration:**
   ```bash
   pm2 save
   pm2 startup
   ```

4. **PM2 Commands:**
   ```bash
   pm2 list              # List all processes
   pm2 logs              # View logs
   pm2 restart all       # Restart all processes
   pm2 stop all          # Stop all processes
   pm2 delete all        # Delete all processes
   ```

### Option 2: Using systemd (Linux)

Create a systemd service file for the backend:

```ini
[Unit]
Description=Resume Builder Backend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/ilc-resume-builder-client-main-13-dec-updated
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

### Option 3: Using Docker

Create a `Dockerfile` for the backend:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server/ ./server/
COPY .env ./
EXPOSE 5001
CMD ["node", "server/index.js"]
```

## Frontend Deployment

### Next.js Production Build

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Or use PM2:**
   ```bash
   pm2 start npm --name "resume-builder-frontend" -- start
   ```

## Reverse Proxy Setup (Nginx)

Example Nginx configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name resumeapi.ilc.limited;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
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
    }
}
```

## SSL/HTTPS Setup

Use Let's Encrypt for free SSL certificates:

```bash
sudo certbot --nginx -d resumebuilder.ilc.limited -d resumeapi.ilc.limited
```

## Health Checks

- Backend Health: `https://resumeapi.ilc.limited/health`
- Frontend: `https://resumebuilder.ilc.limited`

## Monitoring

1. **PM2 Monitoring:**
   ```bash
   pm2 monit
   ```

2. **Logs:**
   ```bash
   pm2 logs resume-builder-backend
   ```

## Troubleshooting

1. **Backend not starting:**
   - Check MongoDB connection
   - Verify environment variables
   - Check port availability

2. **CORS errors:**
   - Verify `NEXT_PUBLIC_APP_URL` matches frontend domain
   - Check CORS configuration in server/index.js

3. **Authentication errors:**
   - Verify Firebase Admin credentials
   - Check token verification

## Data Storage

All data is stored in:
- **MongoDB Atlas**: `hunnidassets.6bll8ud.mongodb.net`
- **Database**: `ilc_resume`
- **Collection**: `resumes`

