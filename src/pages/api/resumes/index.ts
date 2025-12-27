import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import { verifyAuth, AuthenticatedRequest } from '../../../lib/auth';
import Resume from '../../../models/Resume';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  try {
    // Connect to database
    await connectDB();
  } catch (dbError: any) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({
      success: false,
      error: dbError.message || 'Database connection failed. Please check your MONGODB_URI environment variable.',
    });
  }

  // Verify authentication
  const isAuthenticated = await verifyAuth(req, res);
  if (!isAuthenticated) {
    return;
  }

  const userId = req.user!.uid;

  try {
    switch (req.method) {
      case 'GET':
        // Get all resumes for the authenticated user
        const resumes = await Resume.find({ userId })
          .sort({ updatedAt: -1 })
          .select('-__v');
        
        return res.status(200).json({
          success: true,
          data: resumes,
          count: resumes.length
        });

      case 'POST':
        // Create a new resume
        const resumeData = {
          ...req.body,
          userId
        };

        // If this is set as default, unset other defaults
        if (resumeData.isDefault) {
          await Resume.updateMany(
            { userId, isDefault: true },
            { $set: { isDefault: false } }
          );
        }

        const newResume = new Resume(resumeData);
        await newResume.save();

        return res.status(201).json({
          success: true,
          data: newResume
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error: any) {
    console.error('Error in resumes API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

