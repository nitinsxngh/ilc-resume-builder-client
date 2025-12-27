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

  await connectDB();

  const isAuthenticated = await verifyAuth(req, res);
  if (!isAuthenticated) {
    return;
  }

  const userId = req.user!.uid;
  const { id } = req.query;

  try {
    // Unset all other defaults for this user
    await Resume.updateMany(
      { userId, isDefault: true },
      { $set: { isDefault: false } }
    );

    // Set this resume as default
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isDefault: true } },
      { new: true }
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
  } catch (error: any) {
    console.error('Error setting default resume:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to set default resume'
    });
  }
}

