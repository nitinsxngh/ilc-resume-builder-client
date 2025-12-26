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

    // When openid is enabled, try OpenID protocol endpoint (oauth2/2) first, fallback to oauth2/1
    const userinfoUrlV2 = process.env.MERIPAHACHAN_USERINFO_URL || 'https://digilocker.meripehchaan.gov.in/public/oauth2/2/userinfo';
    const userinfoUrlV1 = 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/userinfo';
    
    console.log('Fetching user profile server-side:', {
      userinfoUrlV2,
      hasAccessToken: !!accessToken,
      accessTokenPrefix: accessToken ? accessToken.substring(0, 20) + '...' : 'missing'
    });

    // Try OpenID endpoint first (oauth2/2)
    let response = await fetch(userinfoUrlV2, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    // If 404, try the regular OAuth endpoint (oauth2/1) as fallback
    if (response.status === 404) {
      console.log('OpenID userinfo endpoint returned 404, trying OAuth endpoint (oauth2/1)...');
      response = await fetch(userinfoUrlV1, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Userinfo fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        triedUrls: [userinfoUrlV2, userinfoUrlV1],
        errorText: errorText.substring(0, 500) // First 500 chars
      });
      
      return res.status(response.status).json({ 
        error: 'Failed to fetch user profile',
        error_description: errorText.substring(0, 500)
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

