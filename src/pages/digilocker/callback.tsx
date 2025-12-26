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

export default function DigiLockerCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [messageText, setMessageText] = useState('Processing verification...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code, state, error, error_description } = router.query;
        
        const codeValue = Array.isArray(code) ? code[0] : code;
        const stateValue = Array.isArray(state) ? state[0] : state;
        const errorValue = Array.isArray(error) ? error[0] : error;
        const errorDescription = Array.isArray(error_description) ? error_description[0] : error_description;

        if (errorValue) {
          setStatus('error');
          const errorMsg = errorDescription 
            ? `${errorValue}: ${decodeURIComponent(errorDescription as string)}`
            : errorValue;
          setMessageText(`Verification failed: ${errorMsg}`);
          message.error(errorDescription || 'Verification was cancelled or failed');
          
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
        console.log('Processing callback with code and state:', { code: codeValue?.substring(0, 10) + '...', state: stateValue });
        const result = await verificationService.handleMeriPahachanCallback(codeValue, stateValue || '');
        console.log('Callback result:', result);

        if (result.success && result.data) {
          setStatus('success');
          setMessageText(result.message || 'Verification completed successfully!');
          message.success('Identity verified successfully!');
          
          // Store verification result in sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('verification_result', JSON.stringify(result.data));
          }
          
          // Save verification data to backend
          try {
            const defaultResume = await resumeApiService.getDefaultResume();
            if (defaultResume && defaultResume._id) {
              await resumeApiService.saveVerificationData(defaultResume._id, {
                isVerified: true,
                verifiedBy: result.data.verifiedBy,
                verificationDate: result.data.verificationDate,
                verifiedFields: result.data.verifiedFields || [],
                confidence: result.data.confidence,
                verifiedData: {
                  name: result.data.rawData?.verifiedName || '',
                  email: result.data.rawData?.verifiedEmail || '',
                  phone: result.data.rawData?.verifiedPhone || '',
                  aadhaar: result.data.rawData?.verifiedAadhaar || '',
                  pan: result.data.rawData?.verifiedPan || '',
                  address: result.data.rawData?.verifiedAddress || ''
                }
              });
              console.log('Verification data saved to backend successfully');
            }
          } catch (error) {
            console.error('Error saving verification data to backend:', error);
            // Don't fail the verification if backend save fails, but log the error
          }
          
          // Redirect to editor after 2 seconds
          setTimeout(() => {
            router.push('/editor');
          }, 2000);
        } else {
          setStatus('error');
          const errorMsg = result.error || result.message || 'Verification failed';
          setMessageText(errorMsg);
          console.error('Verification failed:', errorMsg, result);
          message.error(errorMsg);
          
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

