/**
 * Firebase Admin authentication middleware for Next.js API routes
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      tokenUri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };

    if (serviceAccount.projectId && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      });
      console.log('✅ Firebase Admin initialized successfully');
    } else {
      console.error('❌ Firebase Admin initialization failed: Missing required environment variables');
      console.error('Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
    }
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization error:', error.message);
  }
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    uid: string;
    email?: string;
  };
}

export async function verifyAuth(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<boolean> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided'
      });
      return false;
    }

    const token = authHeader.split('Bearer ')[1];

    if (!admin.apps.length) {
      // Development mode: Try to extract user ID from token payload without verification
      // This allows development to work without Firebase Admin setup
      if (process.env.NODE_ENV === 'development') {
        try {
          // Decode JWT token without verification (for development only)
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            req.user = {
              uid: payload.user_id || payload.sub || payload.uid || 'dev-user-' + Date.now(),
              email: payload.email || payload.email_address
            };
            console.warn('⚠️  Development mode: Using unverified token. User ID:', req.user.uid);
            return true;
          }
        } catch (decodeError) {
          console.error('Failed to decode token in dev mode:', decodeError);
        }
      }
      
      // Production mode: Firebase Admin must be initialized
      console.error('❌ Firebase Admin not initialized. Please check your environment variables.');
      res.status(500).json({
        success: false,
        error: 'Authentication service not configured. Please check server configuration.'
      });
      return false;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email
      };
      console.log('✅ User authenticated:', { uid: decodedToken.uid, email: decodedToken.email });
      return true;
    } catch (error: any) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return false;
    }
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
    return false;
  }
}

