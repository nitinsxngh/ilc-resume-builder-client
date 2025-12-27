import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import { verifyAuth, AuthenticatedRequest } from '../../../lib/auth';
import Resume from '../../../models/Resume';

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
      case 'GET':
        // Get a specific resume by ID
        const resume = await Resume.findOne({
          _id: id,
          userId
        }).select('-__v');

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

      case 'PUT':
        // Update an entire resume
        const updateData = {
          ...req.body,
          userId // Ensure userId cannot be changed
        };

        // If setting as default, unset other defaults
        if (updateData.isDefault) {
          await Resume.updateMany(
            { userId, isDefault: true },
            { $set: { isDefault: false } }
          );
        }

        const updatedResume = await Resume.findOneAndUpdate(
          { _id: id, userId },
          updateData,
          { new: true, runValidators: true }
        ).select('-__v');

        if (!updatedResume) {
          return res.status(404).json({
            success: false,
            error: 'Resume not found'
          });
        }

        return res.status(200).json({
          success: true,
          data: updatedResume
        });

      case 'DELETE':
        // Delete a resume
        const deletedResume = await Resume.findOneAndDelete({
          _id: id,
          userId
        });

        if (!deletedResume) {
          return res.status(404).json({
            success: false,
            error: 'Resume not found'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Resume deleted successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error: any) {
    console.error('Error in resume API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

