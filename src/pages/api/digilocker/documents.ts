import type { NextApiRequest, NextApiResponse } from 'next';

interface DocumentsRequest {
  accessToken: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get access token from header or body
    const accessToken = req.headers.authorization?.replace('Bearer ', '') || 
                       (req.method === 'POST' ? (req.body as DocumentsRequest)?.accessToken : null);

    if (!accessToken) {
      return res.status(400).json({ error: 'Missing access token' });
    }

    // DigiLocker API endpoint for fetching documents
    // Note: This endpoint may vary based on DigiLocker API version
    // Common endpoints:
    // - /api/v1/files/list (for listing all files)
    // - /api/v1/files/search (for searching files)
    const documentsUrl = 'https://api.digilocker.gov.in/api/v1/files/list';

    console.log('Fetching documents from DigiLocker:', {
      documentsUrl,
      hasAccessToken: !!accessToken
    });

    // Fetch documents from DigiLocker API
    const response = await fetch(documentsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Documents fetch failed:', response.status, errorText);
      
      // Return empty array if API fails (will use fallback certificates)
      return res.status(200).json({ 
        documents: [],
        message: 'Using default certificate list'
      });
    }

    const documentsData = await response.json();
    console.log('Documents fetched successfully');

    // Transform DigiLocker documents to our format
    // Filter to only include educational certificates and exclude 10th, 12th, and non-educational documents
    const documents = (documentsData.files || documentsData.documents || [])
      .map((file: any) => ({
        name: file.name || file.title || file.doctype || 'Certificate',
        type: file.doctype || file.type || 'certificate',
        description: file.description || `${file.doctype || 'Certificate'} from DigiLocker`,
        id: file.id || file.fileid,
        uri: file.uri || file.url
      }))
      .filter((doc: any) => {
        const docName = doc.name.toLowerCase();
        const docType = doc.type.toLowerCase();
        // Exclude 10th, 12th, and non-educational documents
        return !docName.includes('10th') && 
               !docName.includes('12th') && 
               !docName.includes('driving') &&
               !docName.includes('aadhaar') &&
               !docName.includes('pan') &&
               !docName.includes('voter') &&
               !docName.includes('birth') &&
               (docName.includes('degree') || 
                docName.includes('diploma') || 
                docName.includes('certificate') ||
                docName.includes('education') ||
                docName.includes('marksheet') ||
                docType.includes('education') ||
                docType.includes('degree'));
      });

    res.status(200).json({ documents });
  } catch (error: any) {
    console.error('Error in documents API:', error);
    // Return empty array on error (will use fallback certificates)
    res.status(200).json({ 
      documents: [],
      message: 'Using default certificate list',
      error: error.message 
    });
  }
}

