import type { NextApiRequest, NextApiResponse } from 'next';

interface UserInfoRequest {
  accessToken: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken } = req.body as UserInfoRequest;

    if (!accessToken) {
      return res.status(400).json({ error: 'Missing access token' });
    }

    const userinfoUrl = process.env.MERIPAHACHAN_USERINFO_URL || 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/userinfo';

    console.log('Fetching user profile server-side from:', userinfoUrl);

    // Fetch userinfo from server (avoids CORS if userinfo endpoint blocks browsers)
    const response = await fetch(userinfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Userinfo fetch failed:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to fetch user profile',
        error_description: errorText 
      });
    }

    const profileData = await response.json();
    console.log('User profile fetched successfully');

    res.status(200).json(profileData);
  } catch (error: any) {
    console.error('Error in userinfo API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      error_description: error.message 
    });
  }
}

