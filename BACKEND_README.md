# Resume Builder Backend

A robust Node.js/Express backend for storing and managing resume data in MongoDB. This backend provides a comprehensive API for CRUD operations on resumes with proper validation, authentication, and error handling.

## 🚀 Features

- **MongoDB Integration**: Structured data storage with Mongoose schemas
- **RESTful API**: Complete CRUD operations for resumes
- **Data Validation**: Joi-based input validation
- **Authentication**: Firebase-based user authentication
- **Security**: Helmet, CORS, rate limiting
- **Error Handling**: Comprehensive error handling and logging
- **Search**: Public resume search functionality
- **Statistics**: User resume analytics

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to the project directory**
   ```bash
   cd ILC-Blockchain-Resume-Builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----"
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start the backend server**
   ```bash
   # Development mode with auto-reload
   npm run dev:backend
   
   # Production mode
   npm run backend
   ```

## 🗄️ Database Schema

### Resume Structure

The backend uses a comprehensive MongoDB schema that matches your existing frontend data structure:

```javascript
{
  userId: String,           // User identifier
  title: String,            // Resume title
  template: String,         // Template type
  theme: String,            // Theme selection
  basics: {                 // Personal information
    name: String,
    label: String,
    email: String,
    phone: String,
    location: Object,
    profiles: Array
  },
  skills: {                 // Skills organized by category
    languages: Array,
    frameworks: Array,
    libraries: Array,
    databases: Array,
    technologies: Array,
    practices: Array,
    tools: Array
  },
  work: Array,              // Work experience
  education: Array,         // Education history
  activities: Object,       // Activities and achievements
  volunteer: Array,         // Volunteer work
  awards: Array,            // Awards and certifications
  labels: Object,           // Custom labels
  isPublic: Boolean,        // Public visibility
  isDefault: Boolean,       // Default resume flag
  lastModified: Date,       // Last modification timestamp
  createdAt: Date           // Creation timestamp
}
```

## 🔌 API Endpoints

### Authentication Required Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | Get all user resumes |
| GET | `/api/resumes/default` | Get default resume |
| GET | `/api/resumes/:id` | Get specific resume |
| POST | `/api/resumes` | Create new resume |
| PUT | `/api/resumes/:id` | Update entire resume |
| PATCH | `/api/resumes/:id/:section` | Update specific section |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST | `/api/resumes/:id/duplicate` | Duplicate resume |
| POST | `/api/resumes/:id/set-default` | Set as default |
| GET | `/api/resumes/stats/overview` | Get user statistics |

### Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes/public/search` | Search public resumes |
| GET | `/api/resumes/public/:id` | Get public resume |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## 🔐 Authentication

The API uses Firebase Authentication. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

To get a Firebase ID token in your frontend:
```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
if (user) {
  const idToken = await user.getIdToken();
  // Use this token in your API calls
}
```

## 📝 Usage Examples

### Creating a Resume

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
const idToken = await user.getIdToken();

const resumeData = {
  title: "My Professional Resume",
  template: "professional",
  basics: {
    name: "John Doe",
    label: "Software Engineer",
    email: "john@example.com",
    // ... other fields
  },
  skills: {
    languages: [
      { name: "JavaScript", level: 5 },
      { name: "Python", level: 4 }
    ]
  }
  // ... other sections
};

const response = await fetch('/api/resumes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  },
  body: JSON.stringify(resumeData)
});
```

### Updating a Section

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
const idToken = await user.getIdToken();

const skillsUpdate = {
  languages: [
    { name: "JavaScript", level: 5 },
    { name: "TypeScript", level: 4 }
  ]
};

const response = await fetch(`/api/resumes/${resumeId}/skills`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  },
  body: JSON.stringify(skillsUpdate)
});
```

### Searching Public Resumes

```javascript
const response = await fetch('/api/resumes/public/search?q=javascript&limit=10');
const results = await response.json();
```

## 🔧 Frontend Integration

The backend is designed to work seamlessly with your existing frontend. Use the provided `resumeApiService` to interact with the backend:

```typescript
import { resumeApiService } from '../services/resumeApi';

// Sync local data with backend
const syncedResume = await resumeApiService.syncLocalData(localResumeData);

// Get user's resumes
const resumes = await resumeApiService.getUserResumes();

// Update a section
const updatedResume = await resumeApiService.updateResumeSection(
  resumeId, 
  'skills', 
  newSkillsData
);
```

## 🚨 Error Handling

The API provides comprehensive error handling:

- **400**: Validation errors, bad requests
- **401**: Authentication required
- **403**: Access forbidden
- **404**: Resource not found
- **429**: Rate limit exceeded
- **500**: Internal server error

All errors include descriptive messages and proper HTTP status codes.

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API request throttling
- **Input Validation**: Joi schema validation
- **Authentication**: JWT token verification
- **Data Sanitization**: MongoDB injection prevention

## 📊 Performance Features

- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Response Caching**: Future implementation ready
- **Compression**: Response size optimization

## 🧪 Testing

To test the API endpoints:

1. **Start the server**
   ```bash
   npm run dev:backend
   ```

2. **Test health endpoint**
   ```bash
   curl http://localhost:5000/health
   ```

3. **Test with authentication**
   ```bash
   # Get Firebase ID token from your frontend and use it here
   curl -H "Authorization: Bearer <firebase-id-token>" \
        http://localhost:5000/api/resumes
   ```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
FIREBASE_PROJECT_ID=your_production_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_production_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Production Private Key Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_production_service_account_email
FIREBASE_CLIENT_ID=your_production_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_production_cert_url
PORT=5000
```

### PM2 Process Manager

```bash
npm install -g pm2
pm2 start server/index.js --name "resume-backend"
pm2 save
pm2 startup
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "run", "backend"]
```

## 🔄 Data Migration

To migrate existing resume data from your frontend stores:

1. **Export data from Zustand stores**
2. **Use the syncLocalData method**
3. **Verify data integrity**

## 📈 Monitoring and Logging

- **Request Logging**: All API requests are logged
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring
- **Health Checks**: Automated health monitoring

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation
5. Test thoroughly

## 📄 License

This project is part of the ILC Blockchain Resume Builder.

## 🆘 Support

For issues and questions:
1. Check the error logs
2. Verify environment variables
3. Test database connectivity
4. Review API documentation

---

**Happy coding! 🎉**
