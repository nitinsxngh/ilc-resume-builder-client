import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/db';
import { verifyAuth, AuthenticatedRequest } from '../../../../lib/auth';
import Resume from '../../../../models/Resume';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();
  } catch (dbError: any) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({
      success: false,
      error: dbError.message || 'Database connection failed. Please check your MONGODB_URI environment variable.',
    });
  }

  const isAuthenticated = await verifyAuth(req, res);
  if (!isAuthenticated) {
    return;
  }

  const userId = req.user!.uid;
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'POST':
        // Save verification data
        const verificationData = req.body;

        const resume = await Resume.findOneAndUpdate(
          { _id: id, userId },
          { 
            $set: { 
              verification: verificationData,
              updatedAt: new Date()
            }
          },
          { new: true, runValidators: true }
        ).select('-__v');

        if (!resume) {
          return res.status(404).json({
            success: false,
            error: 'Resume not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: resume
        });

      case 'GET':
        // Get verification data
        const resumeWithVerification = await Resume.findOne({
          _id: id,
          userId
        }).select('verification');

        if (!resumeWithVerification) {
          return res.status(404).json({
            success: false,
            error: 'Resume not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: resumeWithVerification.verification || null
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error: any) {
    console.error('Error in verification API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

