# Backend Server

This is the Express.js backend server for the ILC Resume Builder application.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   The backend uses environment variables from the root `.env` file. Make sure you have:
   - `MONGODB_URI` - MongoDB connection string
   - `PORT` - Server port (default: 5001)
   - `NODE_ENV` - Environment (development/production)
   - Firebase Admin credentials for authentication

3. **Start the Server**
   ```bash
   npm run dev:backend
   # or
   npm run start:backend
   ```

## API Endpoints

### Resumes

- `GET /api/resumes` - Get all resumes for authenticated user
- `GET /api/resumes/default` - Get default resume
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update entire resume
- `PATCH /api/resumes/:id/:section` - Update specific section
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/duplicate` - Duplicate resume
- `POST /api/resumes/:id/set-default` - Set resume as default
- `GET /api/resumes/stats/overview` - Get resume statistics
- `GET /api/resumes/public/:id` - Get public resume
- `GET /api/resumes/public/search` - Search public resumes

### Verification

- `POST /api/resumes/:id/verification` - Save verification data
- `GET /api/resumes/:id/verification` - Get verification data

### Health Check

- `GET /health` - Server health check

## Authentication

All API endpoints (except `/health` and public routes) require Firebase authentication. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Database

The backend uses MongoDB with Mongoose ODM. Data is stored in the `ilc_resume` database.

## Project Structure

```
server/
├── index.js              # Main server file
├── config/
│   └── database.js       # MongoDB connection
├── models/
│   └── Resume.js         # Resume Mongoose model
├── routes/
│   ├── resumes.js        # Resume API routes
│   └── verification.js   # Verification API routes
└── middleware/
    └── auth.js           # Firebase authentication middleware
```

