import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL ? 'true' : 'false',
    },
    connection: {
      status: 'testing',
      duration: null,
    },
  };

  try {
    await connectDB();
    const duration = Date.now() - startTime;
    diagnostics.connection = {
      status: 'success',
      duration: `${duration}ms`,
    };
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      diagnostics,
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    diagnostics.connection = {
      status: 'failed',
      duration: `${duration}ms`,
      error: error.message,
    };
    
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      diagnostics,
    });
  }
}

