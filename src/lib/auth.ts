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
    }
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
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
      // Development fallback
      console.warn('⚠️  Firebase Admin not initialized, using dev user');
      req.user = { uid: 'dev-user', email: 'dev@example.com' };
      return true;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email
      };
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

