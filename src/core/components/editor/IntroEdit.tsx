import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input as AntInput, Button, Space, Divider } from 'antd';
import { MarkDownField } from 'src/core/widgets/MarkdownField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { VerificationPopup } from 'src/components/VerificationPopup';
import { VerificationBadge } from 'src/components/VerificationBadge';
import { resumeApiService } from 'src/services/resumeApi';
// import { useVerification } from 'src/hooks/useVerification';
const Wrapper = styled.div`
  margin: 8px 0;
`;

const Topic = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 7px;
`;

const Input = styled(AntInput)`
  border: 1px solid #222;
  height: 2.625rem;
  padding: 0.625rem;
  max-width: 100%;
  background: #424242;
  color: #fff;
  border-radius: 2px;
  margin-bottom: 5px;
`;

const VerificationSection = styled.div`
  margin: 16px 0;
  padding: 16px;
  background: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #333;
`;

const VerificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const VerificationTitle = styled.h4`
  color: #fff;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const VerificationDescription = styled.p`
  color: #ccc;
  margin: 8px 0 16px 0;
  font-size: 0.875rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
`;

const FieldLabel = styled.span`
  color: #fff;
  font-weight: 500;
  min-width: 80px;
`;

const FieldValue = styled.span`
  color: #ccc;
  flex: 1;
`;

const VerificationButton = styled(Button)`
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
  
  &:hover {
    background: #40a9ff;
    border-color: #40a9ff;
    color: #fff;
  }
`;

export function IntroEdit({ METADATA, state, update }: any) {
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationState, setVerificationState] = useState({
    isVerified: false,
    verifiedBy: null as string | null,
    verificationDate: null as string | null,
    verifiedFields: [] as string[],
    confidence: 0,
    isLoading: false,
    error: null as string | null
  });

  // Load verification data from backend
  useEffect(() => {
    const loadVerificationData = async () => {
      try {
        const defaultResume = await resumeApiService.getDefaultResume();
        if (defaultResume && defaultResume._id && defaultResume.verification) {
          const verification = defaultResume.verification;
          console.log('Loaded verification data from backend:', verification);
          
          const newState = {
            isVerified: verification.isVerified || false,
            verifiedBy: verification.verifiedBy || null,
            verificationDate: verification.verificationDate || null,
            verifiedFields: verification.verifiedFields || [],
            confidence: verification.confidence || 0,
            isLoading: false,
            error: null
          };
          
          console.log('Setting verification state from backend:', newState);
          setVerificationState(newState);
          
          // Store in window for templates to access
          if (typeof window !== 'undefined') {
            (window as any).__verificationData__ = verification;
            // Dispatch custom event to notify templates
            window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
              detail: verification 
            }));
          }
        } else {
          console.log('No verification data found in resume');
          // Ensure state is set to unverified if no data
          setVerificationState({
            isVerified: false,
            verifiedBy: null,
            verificationDate: null,
            verifiedFields: [],
            confidence: 0,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error loading verification data:', error);
        // Set to unverified on error
        setVerificationState({
          isVerified: false,
          verifiedBy: null,
          verificationDate: null,
          verifiedFields: [],
          confidence: 0,
          isLoading: false,
          error: null
        });
      }
    };

    loadVerificationData();
  }, []);

  // Check for verification results from callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResult = sessionStorage.getItem('verification_result');
      if (storedResult) {
        try {
          const result = JSON.parse(storedResult);
          setVerificationState({
            isVerified: result.verifiedFields?.length > 0 || false,
            verifiedBy: result.verifiedBy || null,
            verificationDate: result.verificationDate || null,
            verifiedFields: result.verifiedFields || [],
            confidence: result.confidence || 0,
            isLoading: false,
            error: null
          });
          // Store in window for templates to access
          (window as any).__verificationData__ = {
            isVerified: result.verifiedFields?.length > 0 || false,
            verifiedBy: result.verifiedBy,
            verificationDate: result.verificationDate,
            verifiedFields: result.verifiedFields || [],
            confidence: result.confidence
          };
          // Clear the stored result after reading
          sessionStorage.removeItem('verification_result');
        } catch (error) {
          console.error('Error parsing verification result:', error);
        }
      }
    }
  }, []);

  const handleVerifyClick = () => {
    setShowVerificationPopup(true);
  };

  const handleVerificationComplete = async (verifiedData: any) => {
    setShowVerificationPopup(false);
    console.log('handleVerificationComplete called with:', verifiedData);
    
    if (verifiedData) {
      // Handle both direct data and nested data structure
      const data = verifiedData.data || verifiedData;
      const verifiedFields = data.verifiedFields || [];
      const isVerified = verifiedFields.length > 0;
      
      const newState = {
        isVerified: isVerified,
        verifiedBy: data.verifiedBy || null,
        verificationDate: data.verificationDate || null,
        verifiedFields: verifiedFields,
        confidence: data.confidence || 0,
        isLoading: false,
        error: null
      };
      
      console.log('Setting verification state:', newState);
      setVerificationState(newState);
      
      // Store in window for templates to access
      if (typeof window !== 'undefined') {
        const verificationDataForWindow = {
          isVerified: newState.isVerified,
          verifiedBy: newState.verifiedBy,
          verificationDate: newState.verificationDate,
          verifiedFields: newState.verifiedFields,
          confidence: newState.confidence
        };
        (window as any).__verificationData__ = verificationDataForWindow;
        // Dispatch custom event to notify templates
        window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
          detail: verificationDataForWindow 
        }));
      }
      
      // Reload verification data from backend to ensure sync
      try {
        const defaultResume = await resumeApiService.getDefaultResume();
        if (defaultResume && defaultResume._id && defaultResume.verification) {
          const backendVerification = defaultResume.verification;
          console.log('Reloaded verification from backend:', backendVerification);
          
          // Update state with backend data
          setVerificationState({
            isVerified: backendVerification.isVerified || false,
            verifiedBy: backendVerification.verifiedBy || null,
            verificationDate: backendVerification.verificationDate || null,
            verifiedFields: backendVerification.verifiedFields || [],
            confidence: backendVerification.confidence || 0,
            isLoading: false,
            error: null
          });
          
          (window as any).__verificationData__ = backendVerification;
          // Dispatch custom event to notify templates
          window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
            detail: backendVerification 
          }));
        }
      } catch (error) {
        console.error('Error reloading verification data:', error);
      }
    }
  };

  const getVerificationStatus = () => {
    if (verificationState.isLoading) return 'loading';
    if (verificationState.isVerified) return 'verified';
    return 'unverified';
  };

  return (
    <>
      <VerificationSection>
        <VerificationHeader>
          <VerificationTitle>Identity Verification</VerificationTitle>
          <VerificationBadge
            status={getVerificationStatus()}
            verifiedBy={verificationState.verifiedBy || undefined}
            verificationDate={verificationState.verificationDate || undefined}
            verifiedFields={verificationState.verifiedFields}
            confidence={verificationState.confidence}
            onVerify={handleVerifyClick}
          />
        </VerificationHeader>
        
        <VerificationDescription>
          Verify your personal information to add credibility to your resume. This helps employers trust your profile.
        </VerificationDescription>
        
        <div>
          <FieldWrapper>
            <FieldLabel>Name:</FieldLabel>
            <FieldValue>{state.name || 'Not provided'}</FieldValue>
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel>Email:</FieldLabel>
            <FieldValue>{state.email || 'Not provided'}</FieldValue>
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel>Phone:</FieldLabel>
            <FieldValue>{state.phone || 'Not provided'}</FieldValue>
          </FieldWrapper>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <VerificationButton 
            onClick={handleVerifyClick}
          >
            {verificationState.isVerified ? 'Re-verify Information' : 'Verify Information'}
          </VerificationButton>
        </div>
        
      </VerificationSection>
      
      <Divider style={{ background: '#333', margin: '24px 0' }} />
      
      {METADATA.map((metadata) => (
        <Wrapper key={metadata.label}>
          <Topic>{metadata.label}</Topic>
          {metadata.type === 'Input' ? (
            <Input
              value={
                metadata.value.includes('.')
                  ? state[metadata.value.split('.')[0]][metadata.value.split('.')[1]]
                  : state[metadata.value]
              }
              data-label={metadata.value}
              onChange={(event) => update(event.target.dataset.label, event.target.value)}
            />
          ) : (
            <MarkDownField
              value={state[metadata.value]}
              setValue={(text) => update(metadata.value, text)}
            />
          )}
        </Wrapper>
      ))}
      
      <FormControlLabel control={<Switch defaultChecked />} label="Display Image" />
      

      <VerificationPopup
        visible={showVerificationPopup}
        onClose={() => setShowVerificationPopup(false)}
        onVerificationComplete={handleVerificationComplete}
        userData={{
          name: state.name || '',
          email: state.email || '',
          phone: state.phone || '',
          address: state.location?.address || ''
        }}
      />
    </>
  );
}
