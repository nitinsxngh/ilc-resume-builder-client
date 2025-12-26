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

    // When openid is enabled, use OpenID protocol endpoint (oauth2/2) instead of regular OAuth (oauth2/1)
    const userinfoUrl = process.env.MERIPAHACHAN_USERINFO_URL || 'https://digilocker.meripehchaan.gov.in/public/oauth2/2/userinfo';

    console.log('Fetching user profile server-side:', {
      userinfoUrl,
      hasAccessToken: !!accessToken,
      accessTokenPrefix: accessToken ? accessToken.substring(0, 20) + '...' : 'missing'
    });

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
      console.error('Userinfo fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        url: userinfoUrl,
        errorText: errorText.substring(0, 500) // First 500 chars
      });
      
      // If 404, the endpoint might be wrong - try to provide helpful error
      if (response.status === 404) {
        return res.status(404).json({ 
          error: 'Userinfo endpoint not found',
          error_description: `The userinfo endpoint ${userinfoUrl} returned 404. Please verify the correct OpenID userinfo endpoint URL.`
        });
      }
      
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

