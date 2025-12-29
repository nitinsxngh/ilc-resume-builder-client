// Verification Service for integrating with third-party verification APIs
// This service handles DigiLocker, PAN verification, and other document verification services

export interface VerificationRequest {
  name: string;
  email: string;
  phone: string;
  aadhaar?: string;
  pan?: string;
  address?: string;
  documentType?: string;
  documentNumber?: string;
}

export interface VerificationResponse {
  success: boolean;
  data?: {
    verifiedBy: string;
    verificationDate: string;
    verifiedFields: string[];
    confidence: number;
    rawData?: any;
  };
  error?: string;
  message?: string;
}

export interface DigiLockerConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl: string;
}

export interface MeriPahachanConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  userinfoUrl: string;
  scopes: string[];
}

export interface PANVerificationConfig {
  apiKey: string;
  baseUrl: string;
}

class VerificationService {
  private digiLockerConfig: DigiLockerConfig | null = null;
  private panConfig: PANVerificationConfig | null = null;
  private meriPahachanConfig: MeriPahachanConfig | null = null;

  constructor() {
    this.initializeConfigs();
  }

  private initializeConfigs() {
    // Initialize configuration from environment variables
    this.digiLockerConfig = {
      clientId: process.env.NEXT_PUBLIC_DIGILOCKER_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_DIGILOCKER_CLIENT_SECRET || '',
      redirectUri: process.env.NEXT_PUBLIC_DIGILOCKER_REDIRECT_URI || '',
      baseUrl: 'https://api.digilocker.gov.in'
    };

    this.panConfig = {
      apiKey: process.env.NEXT_PUBLIC_PAN_API_KEY || '',
      baseUrl: 'https://api.income-tax.gov.in'
    };

    // MeriPahachan (DigiLocker OIDC) configuration
    // When openid is enabled, use OpenID protocol endpoints (oauth2/2) for auth and token
    // Note: OpenID Connect returns user info in id_token JWT (no separate userinfo endpoint)
    // Regular OAuth userinfo endpoint is at /oauth2/1/user (used as fallback)
    const baseUrl = 'https://digilocker.meripehchaan.gov.in/public/oauth2/2';
    const oauth1BaseUrl = 'https://digilocker.meripehchaan.gov.in/public/oauth2/1';
    
    // IMPORTANT: Redirect URI must EXACTLY match what's registered in MeriPehchaan dashboard
    // Default to production URL, but allow override via environment variable
    const defaultRedirectUri = 'https://resumebuilder.ilc.limited/digilocker/callback';
    const redirectUri = process.env.NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI || defaultRedirectUri;
    
    this.meriPahachanConfig = {
      clientId: process.env.NEXT_PUBLIC_MERIPAHACHAN_CLIENT_ID || 'DT9A677087',
      clientSecret: process.env.NEXT_PUBLIC_MERIPAHACHAN_CLIENT_SECRET || process.env.MERIPAHACHAN_CLIENT_SECRET || '',
      redirectUri: redirectUri, // Must match exactly what's registered in MeriPehchaan
      authUrl: process.env.NEXT_PUBLIC_MERIPAHACHAN_AUTH_URL || `${baseUrl}/authorize`,
      tokenUrl: process.env.MERIPAHACHAN_TOKEN_URL || `${baseUrl}/token`,
      userinfoUrl: process.env.MERIPAHACHAN_USERINFO_URL || `${oauth1BaseUrl}/user`,
      scopes: [
        'userdetails'
      ]
    };
    
    console.log('MeriPahachan config initialized:', {
      clientId: this.meriPahachanConfig.clientId,
      redirectUri: this.meriPahachanConfig.redirectUri,
      authUrl: this.meriPahachanConfig.authUrl,
      scopes: this.meriPahachanConfig.scopes,
      hasScopes: this.meriPahachanConfig.scopes.length > 0
    });
    
    // Warn if redirect URI might not match
    if (typeof window !== 'undefined' && window.location.origin !== 'https://resumebuilder.ilc.limited' && !process.env.NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI) {
      console.warn('⚠️ Redirect URI mismatch warning:');
      console.warn(`Current origin: ${window.location.origin}`);
      console.warn(`Using redirect URI: ${redirectUri}`);
      console.warn('Make sure this redirect URI is registered in MeriPehchaan dashboard!');
    }
  }

  /**
   * Verify user data using DigiLocker
   */
  async verifyWithDigiLocker(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      if (!this.digiLockerConfig?.clientId) {
        return {
          success: false,
          error: 'DigiLocker configuration not available'
        };
      }

      // Step 1: Get authorization URL
      const authUrl = this.getDigiLockerAuthUrl();
      
      // For demo purposes, we'll simulate the verification process
      // In a real implementation, you would:
      // 1. Redirect user to DigiLocker for authentication
      // 2. Handle the callback with authorization code
      // 3. Exchange code for access token
      // 4. Use access token to fetch user documents
      // 5. Verify the provided data against DigiLocker documents

      return await this.simulateDigiLockerVerification(request);
    } catch (error) {
      return {
        success: false,
        error: `DigiLocker verification failed: ${error}`
      };
    }
  }

  /**
   * Verify PAN card details
   */
  async verifyPAN(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      if (!request.pan) {
        return {
          success: false,
          error: 'PAN number is required for verification'
        };
      }

      if (!this.panConfig?.apiKey) {
        return {
          success: false,
          error: 'PAN verification configuration not available'
        };
      }

      // Simulate PAN verification API call
      return await this.simulatePANVerification(request);
    } catch (error) {
      return {
        success: false,
        error: `PAN verification failed: ${error}`
      };
    }
  }

  /**
   * Verify bank account details
   */
  async verifyBankAccount(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      // This would integrate with bank verification APIs
      // For now, we'll simulate the process
      return await this.simulateBankVerification(request);
    } catch (error) {
      return {
        success: false,
        error: `Bank verification failed: ${error}`
      };
    }
  }

  /**
   * Verify uploaded documents
   */
  async verifyUploadedDocument(file: File, request: VerificationRequest): Promise<VerificationResponse> {
    try {
      // This would integrate with OCR and document verification services
      // For now, we'll simulate the process
      return await this.simulateDocumentVerification(file, request);
    } catch (error) {
      return {
        success: false,
        error: `Document verification failed: ${error}`
      };
    }
  }

  /**
   * Verify user data using MeriPahachan (DigiLocker)
   */
  async verifyWithMeriPahachan(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      // Ensure config is initialized
      if (!this.meriPahachanConfig) {
        this.initializeConfigs();
      }

      if (!this.meriPahachanConfig?.clientId) {
        console.error('MeriPahachan clientId not available');
        return {
          success: false,
          error: 'MeriPahachan configuration not available. Please check your environment variables.'
        };
      }

      // Get authorization URL for OAuth flow with PKCE
      let authUrl: string;
      try {
        const authData = await this.getMeriPahachanAuthUrl();
        authUrl = authData.url;
        console.log('MeriPahachan auth URL:', authUrl);
      } catch (error: any) {
        console.error('Error generating auth URL:', error);
        return {
          success: false,
          error: `Failed to generate authorization URL: ${error.message}`
        };
      }
      
      // Store the request data in sessionStorage for comparison after callback
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('verification_request', JSON.stringify({
            name: request.name,
            email: request.email,
            phone: request.phone
          }));
          sessionStorage.setItem('verification_state', 'meripahachan');
          console.log('Stored verification request:', { name: request.name, email: request.email });
        } catch (storageError) {
          console.error('Error storing verification request:', storageError);
        }
      }

      // Redirect to MeriPahachan for authentication
      if (typeof window !== 'undefined') {
        console.log('Redirecting to MeriPehchaan OIDC:', authUrl);
        console.log('Full URL breakdown:', {
          authUrl: this.meriPahachanConfig.authUrl,
          clientId: this.meriPahachanConfig.clientId,
          redirectUri: this.meriPahachanConfig.redirectUri,
          scopes: this.meriPahachanConfig.scopes
        });
        
        // Redirect immediately
        window.location.href = authUrl;
        // Return immediately as redirect is happening
        return {
          success: false,
          error: 'Redirecting to MeriPahachan for authentication'
        };
      }

      // This will be handled by the callback
      return {
        success: false,
        error: 'Redirecting to MeriPahachan for authentication'
      };
    } catch (error: any) {
      console.error('MeriPahachan verification error:', error);
      return {
        success: false,
        error: `MeriPahachan verification failed: ${error.message || error}`
      };
    }
  }

  /**
   * Handle MeriPahachan OAuth callback
   */
  async handleMeriPahachanCallback(code: string, state: string): Promise<VerificationResponse> {
    try {
      console.log('handleMeriPahachanCallback called with:', { code: code?.substring(0, 10) + '...', state });
      
      if (!this.meriPahachanConfig) {
        console.error('MeriPahachan config not available');
        return {
          success: false,
          error: 'MeriPahachan configuration not available'
        };
      }

      // Exchange authorization code for access token
      console.log('Exchanging code for token...');
      const tokenResponse = await this.exchangeCodeForToken(code);
      console.log('Token response received:', { 
        hasAccessToken: !!tokenResponse.access_token,
        hasIdToken: !!(tokenResponse as any).id_token 
      });
      
      if (!tokenResponse.access_token) {
        console.error('No access token in response:', tokenResponse);
        return {
          success: false,
          error: 'Failed to obtain access token'
        };
      }

      // For OpenID Connect, user info is in id_token JWT (per MeriPehchaan API spec v2.3)
      // For regular OAuth, we need to call userinfo endpoint
      let profileData: any = null;
      
      if ((tokenResponse as any).id_token) {
        console.log('id_token present, decoding JWT for user info (OpenID Connect)...');
        try {
          // Decode JWT id_token (base64url decode the payload) - browser compatible
          const idToken = (tokenResponse as any).id_token;
          const parts = idToken.split('.');
          if (parts.length === 3) {
            // Base64URL decode (replace - with +, _ with /, add padding if needed)
            let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
              base64 += '=';
            }
            const payload = JSON.parse(atob(base64));
            console.log('Decoded id_token payload:', payload);
            profileData = payload;
          } else {
            console.warn('Invalid id_token format, expected 3 parts separated by dots');
          }
        } catch (error) {
          console.error('Failed to decode id_token, will try userinfo endpoint:', error);
        }
      }
      
      // If no profile data from id_token, fetch from userinfo endpoint (regular OAuth)
      if (!profileData) {
        console.log('No id_token or decode failed, fetching user profile from userinfo endpoint...');
        profileData = await this.fetchUserProfile(tokenResponse.access_token);
        console.log('Profile data received from userinfo endpoint:', profileData);
      }
      
      // Get stored verification request
      let storedRequest: VerificationRequest | null = null;
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('verification_request');
        if (stored) {
          storedRequest = JSON.parse(stored);
        }
      }

      // Extract name from profile
      // JWT id_token format (OpenID Connect): given_name, preferred_username
      // Userinfo endpoint format: name, given_name, family_name, full_name
      const verifiedName = profileData.name 
        || (profileData.given_name && profileData.family_name 
            ? `${profileData.given_name} ${profileData.family_name}` 
            : '')
        || profileData.given_name 
        || profileData.full_name 
        || profileData.preferred_username
        || '';
      
      // Extract email (JWT: email, Userinfo: email or email_address)
      const verifiedEmail = profileData.email || profileData.email_address || '';
      
      // Extract phone (JWT: phone_number, Userinfo: phone or phone_number)
      const verifiedPhone = profileData.phone_number || profileData.phone || '';
      
      // Extract PAN (JWT: pan_number)
      const verifiedPan = profileData.pan_number || profileData.pan || '';
      
      // Extract Aadhaar (JWT: masked_aadhaar)
      const verifiedAadhaar = profileData.masked_aadhaar || profileData.aadhaar || '';
      
      // Extract address (Userinfo endpoint format)
      const verifiedAddress = profileData.address 
        || (profileData.address_line1 && profileData.address_line2 
            ? `${profileData.address_line1}, ${profileData.address_line2}` 
            : profileData.address_line1)
        || '';
      
      console.log('Extracted profile data:', {
        verifiedName,
        verifiedEmail,
        verifiedPhone,
        verifiedPan,
        verifiedAadhaar,
        verifiedAddress,
        fullProfile: profileData
      });
      
      // Compare with resume name if stored request exists
      const resumeName = storedRequest?.name || '';
      const nameMatch = resumeName ? this.compareNames(verifiedName, resumeName) : true; // If no stored request, consider it a match

      const verifiedFields: string[] = [];
      if (verifiedName) {
        verifiedFields.push('name');
      }
      if (verifiedEmail) {
        verifiedFields.push('email');
      }
      if (verifiedPhone) {
        verifiedFields.push('phone');
      }
      if (verifiedPan) {
        verifiedFields.push('pan');
      }
      if (verifiedAadhaar) {
        verifiedFields.push('aadhaar');
      }
      if (verifiedAddress) {
        verifiedFields.push('address');
      }

      // If we have profile data, consider verification successful
      const isSuccessful = verifiedName || verifiedFields.length > 0;

      // Clear stored data
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('verification_request');
        sessionStorage.removeItem('verification_state');
      }

      // Ensure complete profile data is preserved in rawData
      const completeRawData = {
        verifiedName,
        verifiedEmail,
        verifiedPhone,
        verifiedPan,
        verifiedAadhaar,
        verifiedAddress,
        resumeName,
        nameMatch: resumeName ? nameMatch : true,
        // Store complete DigiLocker profile data
        profileData: profileData || {},
        // Also store individual fields for easy access
        digilockerid: profileData?.digilockerid || profileData?.sub || '',
        dob: profileData?.dob || '',
        gender: profileData?.gender || '',
        eaadhaar: profileData?.eaadhaar || '',
        reference_key: profileData?.reference_key || '',
        // Store the complete raw profile response
        fullProfile: profileData || {}
      };

      return {
        success: isSuccessful,
        data: {
          verifiedBy: 'MeriPahachan (DigiLocker)',
          verificationDate: new Date().toISOString(),
          verifiedFields,
          confidence: nameMatch && verifiedName ? 0.95 : 0.85,
          rawData: completeRawData
        },
        message: verifiedName 
          ? `Verification successful! Name: ${verifiedName}` 
          : 'Verification completed with available profile data'
      };
    } catch (error) {
      return {
        success: false,
        error: `MeriPahachan callback failed: ${error}`
      };
    }
  }

  /**
   * Generate PKCE code verifier and challenge
   */
  private async generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    // Generate a random code verifier (43-128 characters)
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for Node.js environment
      try {
        const crypto = require('crypto');
        crypto.randomFillSync(array);
      } catch (e) {
        // Ultimate fallback - use Math.random (less secure but works)
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
      }
    }
    
    const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Generate code challenge using SHA256
    let codeChallenge: string;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      // Browser environment
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      codeChallenge = btoa(String.fromCharCode.apply(null, hashArray))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    } else {
      // Node.js environment
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64');
      codeChallenge = hash
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }
    
    return { codeVerifier, codeChallenge };
  }

  /**
   * Get MeriPahachan authorization URL with PKCE
   */
  private async getMeriPahachanAuthUrl(): Promise<{ url: string; codeVerifier: string }> {
    if (!this.meriPahachanConfig) {
      throw new Error('MeriPahachan configuration not available');
    }

    // Generate PKCE
    const { codeVerifier, codeChallenge } = await this.generatePKCE();
    
    // OAuth scopes should be space-separated
    const scopes = this.meriPahachanConfig.scopes.join(' ');
    const state = Math.random().toString(36).substring(7);

    // Store state and code_verifier for verification
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('pkce_code_verifier', codeVerifier);
      console.log('Stored OAuth state:', state);
      console.log('Stored PKCE code verifier');
    }

    // Validate redirect URI
    if (!this.meriPahachanConfig.redirectUri) {
      throw new Error('Redirect URI is required. Please set NEXT_PUBLIC_MERIPAHACHAN_REDIRECT_URI environment variable.');
    }

    // Build URL with proper encoding - using MeriPehchaan OIDC endpoint
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', this.meriPahachanConfig.clientId);
    // IMPORTANT: redirect_uri must match EXACTLY what's registered in MeriPehchaan dashboard
    params.append('redirect_uri', this.meriPahachanConfig.redirectUri);
    params.append('scope', scopes);
    params.append('state', state);
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', 'S256');
    params.append('acr', 'aadhaar'); // Aadhaar authentication context

    const authUrl = `${this.meriPahachanConfig.authUrl}?${params.toString()}`;
    
    console.log('=== MeriPehchaan OAuth Configuration ===');
    console.log('Auth URL:', this.meriPahachanConfig.authUrl);
    console.log('Client ID:', this.meriPahachanConfig.clientId);
    console.log('Redirect URI:', this.meriPahachanConfig.redirectUri);
    console.log('Scopes:', scopes);
    console.log('State:', state);
    console.log('Full Auth URL:', authUrl);
    console.log('========================================');
    
    // Validate redirect URI format
    try {
      const redirectUrl = new URL(this.meriPahachanConfig.redirectUri);
      console.log('Redirect URI validation:', {
        protocol: redirectUrl.protocol,
        host: redirectUrl.host,
        pathname: redirectUrl.pathname,
        full: redirectUrl.href
      });
    } catch (e) {
      console.error('Invalid redirect URI format:', this.meriPahachanConfig.redirectUri);
      throw new Error(`Invalid redirect URI format: ${this.meriPahachanConfig.redirectUri}`);
    }
    
    return { url: authUrl, codeVerifier };
  }

  /**
   * Exchange authorization code for access token with PKCE
   * Uses server-side API route to avoid CORS issues
   */
  private async exchangeCodeForToken(code: string): Promise<any> {
    if (!this.meriPahachanConfig) {
      throw new Error('MeriPahachan configuration not available');
    }

    // Get code_verifier from sessionStorage
    let codeVerifier: string | null = null;
    if (typeof window !== 'undefined') {
      codeVerifier = sessionStorage.getItem('pkce_code_verifier');
    }

    if (!codeVerifier) {
      throw new Error('PKCE code verifier not found. Please restart the verification process.');
    }

    console.log('Exchanging code for token via API route');
    console.log('Using code_verifier:', codeVerifier ? '***' : 'not found');

    // Call our server-side API route instead of directly calling token endpoint
    // This avoids CORS issues since DigiLocker doesn't allow browser-to-server token exchange
    const response = await fetch('/api/digilocker/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        codeVerifier
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Token exchange failed:', response.status, errorData);
      throw new Error(errorData.error_description || errorData.error || `Token exchange failed: ${response.status}`);
    }

    const tokenData = await response.json();
    console.log('Token exchange successful');
    
    // Clear code_verifier after use
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pkce_code_verifier');
    }

    return tokenData;
  }

  /**
   * Fetch user profile from MeriPahachan using userinfo endpoint
   * Uses server-side API route to avoid potential CORS issues
   */
  private async fetchUserProfile(accessToken: string): Promise<any> {
    if (!this.meriPahachanConfig) {
      throw new Error('MeriPahachan configuration not available');
    }

    console.log('Fetching user profile via API route');
    
    // Call our server-side API route to avoid CORS issues
    const response = await fetch('/api/digilocker/userinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Userinfo fetch failed:', response.status, errorData);
      throw new Error(errorData.error_description || errorData.error || `Profile fetch failed: ${response.status}`);
    }

    const profileData = await response.json();
    console.log('User profile fetched successfully:', profileData);
    
    return profileData;
  }

  /**
   * Compare names (case-insensitive, handles variations)
   */
  private compareNames(name1: string, name2: string): boolean {
    if (!name1 || !name2) return false;
    
    // Normalize names: trim, lowercase, remove extra spaces
    const normalize = (name: string) => 
      name.trim().toLowerCase().replace(/\s+/g, ' ');
    
    const normalized1 = normalize(name1);
    const normalized2 = normalize(name2);
    
    // Exact match
    if (normalized1 === normalized2) return true;
    
    // Check if one contains the other (for partial matches)
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return true;
    }
    
    // Split into words and check if all words from shorter name exist in longer name
    const words1 = normalized1.split(' ');
    const words2 = normalized2.split(' ');
    const shorter = words1.length <= words2.length ? words1 : words2;
    const longer = words1.length > words2.length ? words1 : words2;
    
    return shorter.every(word => longer.some(lword => lword.includes(word) || word.includes(lword)));
  }

  /**
   * Get DigiLocker authorization URL
   */
  private getDigiLockerAuthUrl(): string {
    if (!this.digiLockerConfig) {
      throw new Error('DigiLocker configuration not available');
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.digiLockerConfig.clientId,
      redirect_uri: this.digiLockerConfig.redirectUri,
      scope: 'read',
      state: 'verification_state'
    });

    return `${this.digiLockerConfig.baseUrl}/oauth/authorize?${params.toString()}`;
  }

  /**
   * Simulate DigiLocker verification (for demo purposes)
   */
  private async simulateDigiLockerVerification(request: VerificationRequest): Promise<VerificationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock verification logic
    const verifiedFields: string[] = [];
    
    if (request.name) verifiedFields.push('name');
    if (request.email) verifiedFields.push('email');
    if (request.phone) verifiedFields.push('phone');
    if (request.aadhaar) verifiedFields.push('aadhaar');

    return {
      success: true,
      data: {
        verifiedBy: 'DigiLocker',
        verificationDate: new Date().toISOString(),
        verifiedFields,
        confidence: 0.95,
        rawData: {
          aadhaarVerified: !!request.aadhaar,
          nameMatch: true,
          documentType: 'Aadhaar Card'
        }
      }
    };
  }

  /**
   * Simulate PAN verification (for demo purposes)
   */
  private async simulatePANVerification(request: VerificationRequest): Promise<VerificationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock PAN verification logic
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const isValidPAN = panRegex.test(request.pan || '');

    if (!isValidPAN) {
      return {
        success: false,
        error: 'Invalid PAN format'
      };
    }

    return {
      success: true,
      data: {
        verifiedBy: 'PAN Verification Service',
        verificationDate: new Date().toISOString(),
        verifiedFields: ['name', 'pan'],
        confidence: 0.98,
        rawData: {
          panStatus: 'Valid',
          nameMatch: true,
          panType: 'Individual'
        }
      }
    };
  }

  /**
   * Simulate bank verification (for demo purposes)
   */
  private async simulateBankVerification(request: VerificationRequest): Promise<VerificationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      success: true,
      data: {
        verifiedBy: 'Bank Verification Service',
        verificationDate: new Date().toISOString(),
        verifiedFields: ['name', 'account'],
        confidence: 0.92,
        rawData: {
          accountStatus: 'Active',
          nameMatch: true,
          bankName: 'Sample Bank'
        }
      }
    };
  }

  /**
   * Simulate document verification (for demo purposes)
   */
  private async simulateDocumentVerification(file: File, request: VerificationRequest): Promise<VerificationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Mock document verification logic
    const fileSize = file.size;
    const fileType = file.type;

    if (fileSize > 5 * 1024 * 1024) { // 5MB limit
      return {
        success: false,
        error: 'File size too large. Please upload a file smaller than 5MB.'
      };
    }

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(fileType)) {
      return {
        success: false,
        error: 'Unsupported file type. Please upload JPEG, PNG, or PDF files.'
      };
    }

    return {
      success: true,
      data: {
        verifiedBy: 'Document Upload Service',
        verificationDate: new Date().toISOString(),
        verifiedFields: ['name', 'document'],
        confidence: 0.85,
        rawData: {
          documentType: 'Government ID',
          ocrConfidence: 0.88,
          nameExtracted: request.name,
          fileProcessed: true
        }
      }
    };
  }

  /**
   * Get verification status for a user
   */
  async getVerificationStatus(userId: string): Promise<VerificationResponse> {
    try {
      // This would check the database for existing verification records
      // For now, we'll return a mock response
      return {
        success: true,
        data: {
          verifiedBy: 'System',
          verificationDate: new Date().toISOString(),
          verifiedFields: ['name', 'email'],
          confidence: 1.0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get verification status: ${error}`
      };
    }
  }

  /**
   * Revoke verification for a user
   */
  async revokeVerification(userId: string): Promise<VerificationResponse> {
    try {
      // This would remove verification records from the database
      return {
        success: true,
        message: 'Verification revoked successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to revoke verification: ${error}`
      };
    }
  }
}

// Export singleton instance
export const verificationService = new VerificationService();
