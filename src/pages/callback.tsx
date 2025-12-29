import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin, message } from 'antd';
import styled from 'styled-components';
import { verificationService } from 'src/services/verificationService';
import { resumeApiService } from 'src/services/resumeApi';

const CallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
`;

const CallbackContent = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #fff;
  margin-bottom: 1rem;
`;

const StatusText = styled.p`
  color: #ccc;
  margin-top: 1rem;
`;

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [messageText, setMessageText] = useState('Processing verification...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code, state, error } = router.query;
        
        const codeValue = Array.isArray(code) ? code[0] : code;
        const stateValue = Array.isArray(state) ? state[0] : state;
        const errorValue = Array.isArray(error) ? error[0] : error;

        if (errorValue) {
          setStatus('error');
          setMessageText(`Verification failed: ${errorValue}`);
          message.error('Verification was cancelled or failed');
          
          // Redirect back to editor after 3 seconds
          setTimeout(() => {
            router.push('/editor');
          }, 3000);
          return;
        }

        if (!codeValue) {
          setStatus('error');
          setMessageText('No authorization code received');
          message.error('Verification failed: No authorization code');
          
          setTimeout(() => {
            router.push('/editor');
          }, 3000);
          return;
        }

        // Verify state
        const storedState = typeof window !== 'undefined' 
          ? sessionStorage.getItem('oauth_state') 
          : null;
        
        if (stateValue !== storedState) {
          setStatus('error');
          setMessageText('Invalid state parameter');
          message.error('Security verification failed');
          
          setTimeout(() => {
            router.push('/editor');
          }, 3000);
          return;
        }

        // Handle the callback
        const result = await verificationService.handleMeriPahachanCallback(codeValue, stateValue || '');

        // Save raw data regardless of verification success/failure
        const saveRawData = async () => {
          try {
            const defaultResume = await resumeApiService.getDefaultResume();
            let resumeId: string;
            
            const verificationData = result.data || null;
            const rawData = verificationData?.rawData || {};
            
            // If no default resume exists, create one first
            if (!defaultResume || !defaultResume._id) {
              console.log('No default resume found, creating new resume for verification data');
              const newResume = await resumeApiService.createResume({
                title: 'My Resume',
                template: 'professional',
                theme: 'default',
                isDefault: true,
                basics: {
                  name: (rawData as any)?.verifiedName || '',
                  email: (rawData as any)?.verifiedEmail || '',
                  phone: (rawData as any)?.verifiedPhone || '',
                  label: '',
                  image: '',
                  url: '',
                  summary: '',
                  location: {
                    address: (rawData as any)?.verifiedAddress || '',
                    postalCode: '',
                    city: '',
                    countryCode: '',
                    region: ''
                  },
                  relExp: '',
                  totalExp: '',
                  objective: '',
                  profiles: []
                },
                skills: {
                  languages: [],
                  frameworks: [],
                  libraries: [],
                  databases: [],
                  technologies: [],
                  practices: [],
                  tools: []
                },
                work: [],
                education: [],
                activities: {
                  involvements: '',
                  achievements: ''
                },
                volunteer: [],
                awards: [],
                labels: { labels: [] },
                isPublic: false
              });
              resumeId = newResume._id!;
            } else {
              resumeId = defaultResume._id;
            }
            
            // Save verification data with raw data (whether verified or not)
            await resumeApiService.saveVerificationData(resumeId, {
              isVerified: result.success && (verificationData?.verifiedFields?.length || 0) > 0,
              verifiedBy: verificationData?.verifiedBy || (result.success ? 'MeriPahachan (DigiLocker)' : undefined),
              verificationDate: verificationData?.verificationDate || new Date().toISOString(),
              verifiedFields: verificationData?.verifiedFields || [],
              confidence: verificationData?.confidence || 0,
              verifiedData: {
                name: (rawData as any)?.verifiedName || '',
                email: (rawData as any)?.verifiedEmail || '',
                phone: (rawData as any)?.verifiedPhone || '',
                aadhaar: (rawData as any)?.verifiedAadhaar || '',
                pan: (rawData as any)?.verifiedPan || '',
                address: (rawData as any)?.verifiedAddress || ''
              },
              rawData: rawData // Store complete raw data
            });
            
            console.log('DigiLocker raw data saved to backend successfully');
          } catch (error) {
            console.error('Error saving DigiLocker raw data to backend:', error);
            // Don't fail the verification if backend save fails
          }
        };

        if (result.success && result.data) {
          const verificationData = result.data;
          setStatus('success');
          setMessageText(result.message || 'Verification completed successfully!');
          message.success('Identity verified successfully!');
          
          // Store verification result in sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('verification_result', JSON.stringify(verificationData));
          }
          
          // Save verification data to backend (non-blocking - don't wait for it)
          saveRawData();
          
          // Redirect to editor immediately (reduced delay for better UX)
          setTimeout(() => {
            router.push('/editor');
          }, 1000);
        } else {
          setStatus('error');
          setMessageText(result.error || result.message || 'Verification failed');
          message.error(result.error || 'Verification failed');
          
          // Save raw data even if verification failed
          if (result.data) {
            saveRawData();
          }
          
          setTimeout(() => {
            router.push('/editor');
          }, 3000);
        }
      } catch (error: any) {
        setStatus('error');
        setMessageText(`Error: ${error.message || 'Unknown error occurred'}`);
        message.error('Verification process failed');
        
        setTimeout(() => {
          router.push('/editor');
        }, 3000);
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <CallbackContainer>
      <CallbackContent>
        <Title>Verifying Your Identity</Title>
        {status === 'processing' && (
          <>
            <Spin size="large" />
            <StatusText>{messageText}</StatusText>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
            <StatusText style={{ color: '#52c41a' }}>{messageText}</StatusText>
            <StatusText>Redirecting to editor...</StatusText>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff4d4f' }}>✗</div>
            <StatusText style={{ color: '#ff4d4f' }}>{messageText}</StatusText>
            <StatusText>Redirecting to editor...</StatusText>
          </>
        )}
      </CallbackContent>
    </CallbackContainer>
  );
}

