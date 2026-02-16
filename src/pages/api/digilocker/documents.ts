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

    // DigiLocker API endpoint for fetching documents (MeriPehchaan)
    const documentsUrl = 'https://digilocker.meripehchaan.gov.in/public/oauth2/2/files';

    console.log('Fetching documents from DigiLocker:', {
      documentsUrl,
      hasAccessToken: !!accessToken
    });

    const fetchWithRetry = async (attempts: number) => {
      let lastErrorText = '';
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const response = await fetch(documentsUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          return { response };
        }

        lastErrorText = await response.text();
        console.error('Documents fetch failed:', response.status, lastErrorText);

        // Retry only on transient upstream errors
        if (![502, 503, 504].includes(response.status) || attempt === attempts) {
          return { response, errorText: lastErrorText };
        }

        // Backoff before retrying
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }

      return { response: null, errorText: lastErrorText };
    };

    // Fetch documents from DigiLocker API (retry on 5xx)
    const { response, errorText } = await fetchWithRetry(3);

    if (!response || !response.ok) {
      const status = response?.status || 503;
      return res.status(status).json({ 
        error: 'Documents fetch failed',
        status,
        details: errorText || 'Upstream error'
      });
    }

    const documentsData = await response.json();
    console.log('Documents fetched successfully:', documentsData);

    // Transform DigiLocker documents to our format (check)
    // Filter to only include educational certificates (including 10th/12th marksheets)
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
        // Exclude non-educational documents
        return !docName.includes('driving') &&
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
    res.status(500).json({ 
      error: 'Documents fetch failed',
      details: error.message 
    });
  }
}

