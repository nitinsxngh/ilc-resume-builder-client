import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Input as AntInput, Button, Space, Divider } from 'antd';
import { MarkDownField } from 'src/core/widgets/MarkdownField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { VerificationPopup } from 'src/components/VerificationPopup';
import { VerificationBadge } from 'src/components/VerificationBadge';
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
  // const { verificationState, verifyWithDigiLocker, verifyWithPAN, verifyWithDocument } = useVerification();
  
  // Mock verification state for testing
  const verificationState = {
    isVerified: false,
    verifiedBy: null,
    verificationDate: null,
    verifiedFields: [],
    confidence: 0,
    isLoading: false,
    error: null
  };

  const handleVerifyClick = () => {
    setShowVerificationPopup(true);
  };

  const handleVerificationComplete = (verifiedData: any) => {
    setShowVerificationPopup(false);
  };

  const getVerificationStatus = () => {
    if (verificationState.isLoading) return 'loading';
    if (verificationState.isVerified) return 'verified';
    return 'unverified';
  };

  return (
    <>
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
      
      <Divider style={{ background: '#333', margin: '24px 0' }} />
      
      <VerificationSection>
        <VerificationHeader>
          <VerificationTitle>Identity Verification</VerificationTitle>
          <VerificationBadge
            status={getVerificationStatus()}
            verifiedBy={verificationState.verifiedBy}
            verificationDate={verificationState.verificationDate}
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
            type="button"
          >
            {verificationState.isVerified ? 'Re-verify Information' : 'Verify Information'}
          </VerificationButton>
        </div>
        
      </VerificationSection>
      
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
