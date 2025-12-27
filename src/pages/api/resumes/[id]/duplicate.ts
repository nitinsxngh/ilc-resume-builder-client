import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/db';
import { verifyAuth, AuthenticatedRequest } from '../../../../lib/auth';
import Resume from '../../../../models/Resume';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

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
    const originalResume = await Resume.findOne({
      _id: id,
      userId
    });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    const duplicateData = originalResume.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.title = `${duplicateData.title} (Copy)`;
    duplicateData.isDefault = false;

    const duplicate = new Resume(duplicateData);
    await duplicate.save();

    return res.status(201).json({
      success: true,
      data: duplicate
    });
  } catch (error: any) {
    console.error('Error duplicating resume:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to duplicate resume'
    });
  }
}

