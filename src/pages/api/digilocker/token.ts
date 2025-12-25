import type { NextApiRequest, NextApiResponse } from 'next';

interface TokenRequest {
  code: string;
  codeVerifier: string;
  state?: string;
}

interface TokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenResponse | { error: string; error_description?: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, codeVerifier, state } = req.body as TokenRequest;

    if (!code || !codeVerifier) {
      return res.status(400).json({ error: 'Missing required parameters: code and codeVerifier' });
    }

    // Get MeriPahachan configuration from environment variables
    const clientId = process.env.NEXT_PUBLIC_MERIPAHACHAN_CLIENT_ID || process.env.MERIPAHACHAN_CLIENT_ID;
    const clientSecret = process.env.MERIPAHACHAN_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI || process.env.MERIPAHACHAN_REDIRECT_URI;
    const tokenUrl = process.env.MERIPAHACHAN_TOKEN_URL || 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/token';

    console.log('Token API - Environment check:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRedirectUri: !!redirectUri,
      tokenUrl,
      clientId: clientId || 'MISSING',
      redirectUri: redirectUri || 'MISSING'
    });

    if (!clientId || !redirectUri) {
      console.error('MeriPahachan configuration missing:', { 
        hasClientId: !!clientId, 
        hasRedirectUri: !!redirectUri,
        envKeys: Object.keys(process.env).filter(key => key.includes('MERIPAHACHAN'))
      });
      return res.status(500).json({ 
        error: 'Server configuration error',
        error_description: `Missing: ${!clientId ? 'clientId ' : ''}${!redirectUri ? 'redirectUri' : ''}`
      });
    }

    // Prepare token exchange request
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('client_id', clientId);
    params.append('redirect_uri', redirectUri);
    params.append('code_verifier', codeVerifier);
    // Note: code_challenge_method is only for authorization request, not token exchange

    // Add client_secret if available (for confidential clients)
    if (clientSecret) {
      params.append('client_secret', clientSecret);
    }

    console.log('Exchanging code for token server-side:', {
      tokenUrl,
      clientId,
      redirectUri,
      hasCodeVerifier: !!codeVerifier,
      hasClientSecret: !!clientSecret,
      grantType: 'authorization_code',
      params: {
        grant_type: 'authorization_code',
        code: code.substring(0, 10) + '...',
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier ? '***' : 'missing'
      }
    });

    // Exchange code for token (server-to-server, no CORS issues)
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    const responseText = await response.text();
    console.log('Token exchange response status:', response.status);
    console.log('Token exchange response:', responseText.substring(0, 200)); // Log first 200 chars

    if (!response.ok) {
      console.error('Token exchange failed:', response.status, responseText);
      try {
        const errorData = JSON.parse(responseText);
        return res.status(response.status).json({
          error: errorData.error || 'Token exchange failed',
          error_description: errorData.error_description
        });
      } catch {
        return res.status(response.status).json({
          error: 'Token exchange failed',
          error_description: responseText
        });
      }
    }

    const tokenData: TokenResponse = JSON.parse(responseText);
    console.log('Token exchange successful:', { hasAccessToken: !!tokenData.access_token });

    // Return token data to frontend
    res.status(200).json(tokenData);
  } catch (error: any) {
    console.error('Error in token exchange API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      error_description: error.message 
    });
  }
}

