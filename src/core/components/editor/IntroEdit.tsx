import React, { Fragment, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Input as AntInput, Button, Space, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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

const MatchIndicator = styled.span<{ matched: boolean }>`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  color: ${props => props.matched ? '#52c41a' : '#ff4d4f'};
  font-size: 16px;
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
    verifiedData: null as {
      name?: string;
      email?: string;
      phone?: string;
      aadhaar?: string;
      pan?: string;
      address?: string;
    } | null,
    isLoading: false,
    error: null as string | null
  });

  // Load verification data from backend
  const loadVerificationData = useCallback(async () => {
    try {
      const defaultResume = await resumeApiService.getDefaultResume();
      if (defaultResume && defaultResume._id && defaultResume.verification) {
        setVerificationState({
          isVerified: defaultResume.verification.isVerified || false,
          verifiedBy: defaultResume.verification.verifiedBy || null,
          verificationDate: defaultResume.verification.verificationDate || null,
          verifiedFields: defaultResume.verification.verifiedFields || [],
          confidence: defaultResume.verification.confidence || 0,
          verifiedData: defaultResume.verification.verifiedData || null,
          isLoading: false,
          error: null
        });
        // Store in window for templates to access
        if (typeof window !== 'undefined') {
          (window as any).__verificationData__ = defaultResume.verification;
          // Dispatch custom event to notify templates
          window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
            detail: defaultResume.verification 
          }));
        }
      }
    } catch (error: any) {
      console.error('Error loading verification data from backend:', error);
      // If backend is unavailable, try to use sessionStorage data as fallback
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
              verifiedData: result.verifiedData || null,
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
            console.log('Using verification data from sessionStorage as fallback');
          } catch (parseError) {
            console.error('Error parsing sessionStorage verification data:', parseError);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    loadVerificationData();
  }, [loadVerificationData]);

  // Reload verification data when window regains focus (e.g., returning from callback)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleFocus = () => {
        // Small delay to ensure backend has processed the verification
        setTimeout(() => {
          loadVerificationData();
        }, 500);
      };

      window.addEventListener('focus', handleFocus);
      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [loadVerificationData]);

  // Check for verification results from callback and reload from backend
  useEffect(() => {
    const checkAndReloadVerification = async () => {
      if (typeof window !== 'undefined') {
        const storedResult = sessionStorage.getItem('verification_result');
        if (storedResult) {
          try {
            const result = JSON.parse(storedResult);
            // Update local state immediately
            setVerificationState({
              isVerified: result.verifiedFields?.length > 0 || false,
              verifiedBy: result.verifiedBy || null,
              verificationDate: result.verificationDate || null,
              verifiedFields: result.verifiedFields || [],
              confidence: result.confidence || 0,
              verifiedData: result.verifiedData || null,
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
            
            // Reload verification data from backend to ensure sync
            try {
              const defaultResume = await resumeApiService.getDefaultResume();
              if (defaultResume && defaultResume._id && defaultResume.verification) {
                setVerificationState({
                  isVerified: defaultResume.verification.isVerified || false,
                  verifiedBy: defaultResume.verification.verifiedBy || null,
                  verificationDate: defaultResume.verification.verificationDate || null,
                  verifiedFields: defaultResume.verification.verifiedFields || [],
                  confidence: defaultResume.verification.confidence || 0,
                  verifiedData: defaultResume.verification.verifiedData || null,
                  isLoading: false,
                  error: null
                });
                // Update window object with backend data
                (window as any).__verificationData__ = defaultResume.verification;
                // Dispatch custom event to notify templates
                window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
                  detail: defaultResume.verification 
                }));
              }
            } catch (error) {
              console.error('Error reloading verification data from backend:', error);
            }
          } catch (error) {
            console.error('Error parsing verification result:', error);
          }
        } else {
          // Even if no stored result, reload from backend to ensure we have latest data
          try {
            const defaultResume = await resumeApiService.getDefaultResume();
            if (defaultResume && defaultResume._id && defaultResume.verification) {
              setVerificationState({
                isVerified: defaultResume.verification.isVerified || false,
                verifiedBy: defaultResume.verification.verifiedBy || null,
                verificationDate: defaultResume.verification.verificationDate || null,
                verifiedFields: defaultResume.verification.verifiedFields || [],
                confidence: defaultResume.verification.confidence || 0,
                verifiedData: defaultResume.verification.verifiedData || null,
                isLoading: false,
                error: null
              });
              // Update window object with backend data
              (window as any).__verificationData__ = defaultResume.verification;
              // Dispatch custom event to notify templates
              window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
                detail: defaultResume.verification 
              }));
            }
          } catch (error) {
            console.error('Error loading verification data from backend:', error);
          }
        }
      }
    };

    checkAndReloadVerification();
  }, []);

  const handleVerifyClick = () => {
    setShowVerificationPopup(true);
  };

  const handleVerificationComplete = async (verifiedData: any) => {
    setShowVerificationPopup(false);
    if (verifiedData) {
      const newState = {
        isVerified: verifiedData.verifiedFields?.length > 0 || false,
        verifiedBy: verifiedData.verifiedBy || null,
        verificationDate: verifiedData.verificationDate || null,
        verifiedFields: verifiedData.verifiedFields || [],
        confidence: verifiedData.confidence || 0,
        verifiedData: verifiedData.verifiedData || null,
        isLoading: false,
        error: null
      };
      setVerificationState(newState);
      
      // Store in window for templates to access
      if (typeof window !== 'undefined') {
        const verificationData = {
          isVerified: newState.isVerified,
          verifiedBy: newState.verifiedBy,
          verificationDate: newState.verificationDate,
          verifiedFields: newState.verifiedFields,
          confidence: newState.confidence
        };
        (window as any).__verificationData__ = verificationData;
        // Dispatch custom event to notify templates
        window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
          detail: verificationData 
        }));
      }
      
      // Reload verification data from backend to ensure sync
      try {
        const defaultResume = await resumeApiService.getDefaultResume();
        if (defaultResume && defaultResume._id && defaultResume.verification) {
          (window as any).__verificationData__ = defaultResume.verification;
          // Dispatch custom event to notify templates
          window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
            detail: defaultResume.verification 
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

  // Function to normalize strings for comparison (remove spaces, convert to lowercase)
  const normalizeString = (str: string | null | undefined): string => {
    if (!str) return '';
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
  };

  // Function to compare two strings (case-insensitive, space-insensitive)
  const compareStrings = (str1: string | null | undefined, str2: string | null | undefined): boolean => {
    const normalized1 = normalizeString(str1);
    const normalized2 = normalizeString(str2);
    if (!normalized1 || !normalized2) return false;
    return normalized1 === normalized2;
  };

  // Function to compare names - matches if either name contains the other (for partial matching)
  const compareNames = (name1: string | null | undefined, name2: string | null | undefined): boolean => {
    const normalized1 = normalizeString(name1);
    const normalized2 = normalizeString(name2);
    if (!normalized1 || !normalized2) return false;
    
    // Exact match
    if (normalized1 === normalized2) return true;
    
    // Split into words for partial matching
    const words1 = normalized1.split(/\s+/).filter(w => w.length > 0);
    const words2 = normalized2.split(/\s+/).filter(w => w.length > 0);
    
    // If either name is empty after splitting, return false
    if (words1.length === 0 || words2.length === 0) return false;
    
    // Check if all words from the shorter name exist in the longer name
    const shorter = words1.length <= words2.length ? words1 : words2;
    const longer = words1.length > words2.length ? words1 : words2;
    
    // Match if all words from shorter name are found in longer name
    return shorter.every(word => longer.some(longWord => longWord.includes(word) || word.includes(longWord)));
  };

  // Function to compare phone numbers (remove spaces, dashes, parentheses)
  const comparePhoneNumbers = (phone1: string | null | undefined, phone2: string | null | undefined): boolean => {
    if (!phone1 || !phone2) return false;
    const normalizePhone = (phone: string) => phone.replace(/[\s\-\(\)\+]/g, '');
    return normalizePhone(phone1) === normalizePhone(phone2);
  };

  // Check if fields match with verified data
  const checkFieldMatch = (field: 'name' | 'email' | 'phone'): boolean => {
    if (!verificationState.verifiedData) return false;
    
    const verifiedValue = verificationState.verifiedData[field];
    const resumeValue = field === 'name' ? state.name : field === 'email' ? state.email : state.phone;
    
    if (!verifiedValue || !resumeValue) return false;
    
    if (field === 'phone') {
      return comparePhoneNumbers(resumeValue, verifiedValue);
    } else if (field === 'name') {
      return compareNames(resumeValue, verifiedValue);
    } else {
      return compareStrings(resumeValue, verifiedValue);
    }
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
            <FieldValue>
              {state.name || 'Not provided'}
              {verificationState.verifiedData && (
                <MatchIndicator matched={checkFieldMatch('name')}>
                  {checkFieldMatch('name') ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )}
                </MatchIndicator>
              )}
            </FieldValue>
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel>Email:</FieldLabel>
            <FieldValue>
              {state.email || 'Not provided'}
              {verificationState.verifiedData && (
                <MatchIndicator matched={checkFieldMatch('email')}>
                  {checkFieldMatch('email') ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )}
                </MatchIndicator>
              )}
            </FieldValue>
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel>Phone:</FieldLabel>
            <FieldValue>
              {state.phone || 'Not provided'}
              {verificationState.verifiedData && (
                <MatchIndicator matched={checkFieldMatch('phone')}>
                  {checkFieldMatch('phone') ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )}
                </MatchIndicator>
              )}
            </FieldValue>
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
