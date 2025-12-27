import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import { verifyAuth, AuthenticatedRequest } from '../../../lib/auth';
import Resume from '../../../models/Resume';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
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

  try {
    // Try to find default resume first
    let resume = await Resume.findOne({ 
      userId, 
      isDefault: true 
    }).select('-__v').lean();

    // If no default resume, get the most recently updated one
    if (!resume) {
      resume = await Resume.findOne({ userId })
        .sort({ updatedAt: -1 })
        .select('-__v')
        .lean();
    }

    if (!resume) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No resume found'
      });
    }

    return res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error: any) {
    console.error('Error fetching default resume:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch default resume'
    });
  }
}

