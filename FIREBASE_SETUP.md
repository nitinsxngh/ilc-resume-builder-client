# Firebase Setup Guide for Resume Builder Backend

This guide will help you set up Firebase Authentication for your Resume Builder backend.

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter your project name (e.g., "ilc-resume-builder")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 🔑 Step 2: Get Service Account Credentials

1. In your Firebase project, go to **Project Settings** (gear icon)
2. Click on the **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file
5. **Keep this file secure** - it contains sensitive credentials

## 📝 Step 3: Update Environment Variables

1. Copy the downloaded service account JSON content
2. Update your `.env.local` file with the following values:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id-from-json
FIREBASE_PRIVATE_KEY_ID=your-private-key-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account-email-from-json
FIREBASE_CLIENT_ID=your-client-id-from-json
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url-from-json
```

## 🔐 Step 4: Enable Authentication Methods

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable the authentication methods you want:
   - **Email/Password** (recommended)
   - **Google** (optional)
   - **GitHub** (optional)

## 🌐 Step 5: Configure Frontend (if not already done)

Make sure your frontend has Firebase configured. You should have a `firebase.ts` file in `src/config/` with:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

## 🚀 Step 6: Test the Backend

1. Start your backend server:
   ```bash
   npm run dev:backend
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

3. Test with Firebase authentication (you'll need a valid Firebase ID token)

## 🔍 Troubleshooting

### Common Issues:

1. **"Firebase Admin SDK not initialized"**
   - Check your environment variables
   - Ensure the service account JSON is properly formatted

2. **"Invalid private key"**
   - Make sure the private key includes the full `-----BEGIN PRIVATE KEY-----` wrapper
   - Check for proper escaping of newlines (`\n`)

3. **"Project not found"**
   - Verify your `FIREBASE_PROJECT_ID` matches your Firebase project

4. **"Permission denied"**
   - Ensure your service account has the necessary permissions
   - Check if Authentication is enabled in Firebase Console

### Testing Authentication:

1. **Get a Firebase ID token** from your frontend:
   ```javascript
   const auth = getAuth();
   const user = auth.currentUser;
   if (user) {
     const idToken = await user.getIdToken();
     console.log('ID Token:', idToken);
   }
   ```

2. **Test API endpoint** with the token:
   ```bash
   curl -H "Authorization: Bearer YOUR_ID_TOKEN" \
        http://localhost:5000/api/resumes
   ```

## 📚 Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Service Account Keys](https://firebase.google.com/docs/admin/setup#initialize-sdk)

## 🎯 Next Steps

After setting up Firebase:

1. **Test the save functionality** - Click the save button in your resume builder
2. **Verify data storage** - Check your MongoDB database for saved resumes
3. **Test loading** - Use the "Load from Cloud" option to retrieve saved resumes
4. **Monitor logs** - Check backend console for any errors

---

**Need help?** Check the backend logs and ensure all environment variables are properly set.
