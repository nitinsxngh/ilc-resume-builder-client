import React, { Fragment, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Input as AntInput, Button, Space, Divider, Modal, List, Spin, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
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

const CertificationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  padding: 12px;
  background: #1f1f1f;
  border-radius: 6px;
  border: 1px solid #333;
`;

const CertificationInput = styled(AntInput)`
  border: 1px solid #333;
  height: 2.5rem;
  padding: 0.625rem;
  background: #2a2a2a;
  color: #fff;
  border-radius: 4px;
  flex: 1;
  
  &:focus {
    border-color: #1890ff;
  }
`;

const UploadIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  border: 1px dashed #555;
  border-radius: 4px;
  background: #2a2a2a;
  color: #ccc;
  transition: all 0.3s;
  flex: 1;
  
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
  
  .upload-icon {
    font-size: 20px;
    margin-right: 8px;
  }
  
  .upload-text {
    font-size: 14px;
  }
`;

const AddMoreButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
  border: 1px dashed #555;
  color: #ccc;
  background: transparent;
  
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
    background: rgba(24, 144, 255, 0.1);
  }
`;

const DeleteButton = styled(Button)`
  color: #ff4d4f;
  border-color: #ff4d4f;
  padding: 4px 8px;
  min-width: auto;
  
  &:hover {
    color: #ff7875;
    border-color: #ff7875;
  }
`;

const ErrorText = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const CertificateModal = styled(Modal)`
  .ant-modal-content {
    background: #2a2a2a;
    color: #fff;
  }
  
  .ant-modal-header {
    background: #2a2a2a;
    border-bottom: 1px solid #333;
    
    .ant-modal-title {
      color: #fff;
    }
  }
  
  .ant-modal-body {
    background: #2a2a2a;
    color: #fff;
  }
  
  .ant-list-item {
    border: 1px solid #333;
    border-radius: 6px;
    margin-bottom: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #333;
      border-color: #1890ff;
    }
  }
  
  .ant-list-item-meta-title {
    color: #fff;
  }
  
  .ant-list-item-meta-description {
    color: #ccc;
  }
`;

interface Certification {
  id: string;
  label: string;
  details: string;
  verified: boolean;
  file?: File | null;
  error?: string;
}

export function IntroEdit({ METADATA, state, update }: any) {
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [availableCertificates, setAvailableCertificates] = useState<any[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: '10th', label: '10th', details: '', verified: false, file: null },
    { id: '12th', label: '12th', details: '', verified: false, file: null }
  ]);
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

  // Function to compare names - matches if first name matches or all words match exactly
  const compareNames = (name1: string | null | undefined, name2: string | null | undefined): boolean => {
    const normalized1 = normalizeString(name1);
    const normalized2 = normalizeString(name2);
    if (!normalized1 || !normalized2) return false;
    
    // Exact match
    if (normalized1 === normalized2) return true;
    
    // Split into words
    const words1 = normalized1.split(/\s+/).filter(w => w.length > 0);
    const words2 = normalized2.split(/\s+/).filter(w => w.length > 0);
    
    // If either name is empty after splitting, return false
    if (words1.length === 0 || words2.length === 0) return false;
    
    // Check if first name (first word) matches
    if (words1[0] === words2[0]) return true;
    
    // Check if all words match exactly (order doesn't matter)
    if (words1.length === words2.length) {
      const sorted1 = [...words1].sort();
      const sorted2 = [...words2].sort();
      return sorted1.every((word, index) => word === sorted2[index]);
    }
    
    // If one name is shorter, check if all words from shorter exist exactly in longer
    const shorter = words1.length <= words2.length ? words1 : words2;
    const longer = words1.length > words2.length ? words1 : words2;
    
    // Match if all words from shorter name exist exactly in longer name (exact word match, not substring)
    return shorter.every(word => longer.includes(word));
  };

  // Function to compare phone numbers (remove spaces, dashes, parentheses)
  const comparePhoneNumbers = (phone1: string | null | undefined, phone2: string | null | undefined): boolean => {
    if (!phone1 || !phone2) return false;
    const normalizePhone = (phone: string) => phone.replace(/[\s\-\(\)\+]/g, '');
    return normalizePhone(phone1) === normalizePhone(phone2);
  };

  // Fetch DigiLocker certificates
  const fetchDigiLockerCertificates = useCallback(async () => {
    setLoadingCertificates(true);
    try {
      // Check if user has DigiLocker access token stored
      // Try multiple possible storage keys
      const digiLockerToken = sessionStorage.getItem('digilocker_access_token') ||
                              sessionStorage.getItem('meripahachan_access_token') ||
                              (window as any).__digilockerToken__ ||
                              null;
      
      if (!digiLockerToken) {
        message.warning('Please verify your identity with DigiLocker first to access certificates. The certificate list will show common certificates.');
      }

      // Fetch certificates from DigiLocker API
      const response = await fetch('/api/digilocker/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accessToken: digiLockerToken })
      });

      if (response.ok) {
        const data = await response.json();
        // Filter only educational certificates and exclude 10th and 12th
        const educationalCertificates = [
          { name: 'Degree Certificate', type: 'degree', description: 'Graduation Degree Certificate' },
          { name: 'Diploma Certificate', type: 'diploma', description: 'Diploma Certificate' },
          { name: 'ITI Certificate', type: 'iti', description: 'ITI Certificate' },
          { name: 'Post Graduate Certificate', type: 'pg', description: 'Post Graduate Certificate' },
          { name: 'Master Degree Certificate', type: 'masters', description: 'Master Degree Certificate' },
          { name: 'PhD Certificate', type: 'phd', description: 'PhD Certificate' },
          { name: 'Professional Certificate', type: 'professional', description: 'Professional Certificate' },
          { name: 'Technical Certificate', type: 'technical', description: 'Technical Certificate' }
        ];
        
        // Filter DigiLocker documents to only include educational ones and exclude 10th/12th
        const digiLockerDocs = (data.documents || []).filter((doc: any) => {
          const docName = (doc.name || doc.title || '').toLowerCase();
          const docType = (doc.type || doc.doctype || '').toLowerCase();
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
        
        setAvailableCertificates([...educationalCertificates, ...digiLockerDocs]);
      } else {
        // Fallback to educational certificates only if API fails
        const educationalCertificates = [
          { name: 'Degree Certificate', type: 'degree', description: 'Graduation Degree Certificate' },
          { name: 'Diploma Certificate', type: 'diploma', description: 'Diploma Certificate' },
          { name: 'ITI Certificate', type: 'iti', description: 'ITI Certificate' },
          { name: 'Post Graduate Certificate', type: 'pg', description: 'Post Graduate Certificate' },
          { name: 'Master Degree Certificate', type: 'masters', description: 'Master Degree Certificate' },
          { name: 'PhD Certificate', type: 'phd', description: 'PhD Certificate' },
          { name: 'Professional Certificate', type: 'professional', description: 'Professional Certificate' },
          { name: 'Technical Certificate', type: 'technical', description: 'Technical Certificate' }
        ];
        setAvailableCertificates(educationalCertificates);
      }
    } catch (error) {
      console.error('Error fetching DigiLocker certificates:', error);
      // Fallback to educational certificates only
      const educationalCertificates = [
        { name: 'Degree Certificate', type: 'degree', description: 'Graduation Degree Certificate' },
        { name: 'Diploma Certificate', type: 'diploma', description: 'Diploma Certificate' },
        { name: 'ITI Certificate', type: 'iti', description: 'ITI Certificate' },
        { name: 'Post Graduate Certificate', type: 'pg', description: 'Post Graduate Certificate' },
        { name: 'Master Degree Certificate', type: 'masters', description: 'Master Degree Certificate' },
        { name: 'PhD Certificate', type: 'phd', description: 'PhD Certificate' },
        { name: 'Professional Certificate', type: 'professional', description: 'Professional Certificate' },
        { name: 'Technical Certificate', type: 'technical', description: 'Technical Certificate' }
      ];
      setAvailableCertificates(educationalCertificates);
    } finally {
      setLoadingCertificates(false);
    }
  }, []);

  // Handle certificate selection
  const handleCertificateSelect = (certificate: any) => {
    // Don't allow adding 10th or 12th as they're already shown by default
    const certName = certificate.name.toLowerCase();
    if (certName.includes('10th') || certName.includes('12th')) {
      message.warning('10th and 12th certificates are already shown by default');
      return;
    }

    // Check if certificate already exists
    const exists = certifications.some(cert => cert.label.toLowerCase() === certificate.name.toLowerCase());
    if (exists) {
      message.warning('This certificate is already added');
      return;
    }

    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      label: certificate.name,
      details: '',
      verified: false,
      file: null
    };
    setCertifications([...certifications, newCert]);
    setShowCertificateModal(false);
    message.success(`${certificate.name} added successfully`);
  };

  // Handle "Add More" button click
  const handleAddMoreClick = () => {
    setShowCertificateModal(true);
    fetchDigiLockerCertificates();
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

      <VerificationSection>
        <VerificationHeader>
          <VerificationTitle>Certification Verification</VerificationTitle>
        </VerificationHeader>
        
        <VerificationDescription>
          Verify your educational certifications to add credibility to your resume.
        </VerificationDescription>
        
        <div>
          {certifications.map((cert, index) => {
            const handleFileChange = (file: File | null) => {
              const updated = [...certifications];
              let error = '';
              
              // Validation
              if (file) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                  error = 'File size must be less than 5MB';
                }
                // Check file type (only PDF, JPG, PNG)
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(file.type)) {
                  error = 'Only PDF, JPG, and PNG files are allowed';
                }
              }
              
              updated[index] = { 
                ...updated[index], 
                file: error ? null : file,
                error: error || undefined
              };
              setCertifications(updated);
            };

            return (
              <div key={cert.id}>
                <CertificationItem>
                  <FieldLabel style={{ minWidth: '100px' }}>
                    {cert.id === '10th' || cert.id === '12th' ? (
                      <>
                        {cert.label}:
                      </>
                    ) : (
                      <CertificationInput
                        placeholder="Certification name"
                        value={cert.label}
                        onChange={(e) => {
                          const updated = [...certifications];
                          const label = e.target.value;
                          let error = '';
                          
                          // Validation for label
                          if (!label.trim()) {
                            error = 'Certification name is required';
                          }
                          
                          updated[index] = { 
                            ...updated[index], 
                            label,
                            error: error || undefined
                          };
                          setCertifications(updated);
                        }}
                        style={{ width: '150px', marginRight: '8px' }}
                      />
                    )}
                  </FieldLabel>
                  <UploadIconWrapper
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.jpg,.jpeg,.png';
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0] || null;
                        handleFileChange(file);
                      };
                      input.click();
                    }}
                  >
                    <UploadOutlined className="upload-icon" />
                    <span className="upload-text">
                      {cert.file ? cert.file.name : 'Upload Certificate'}
                    </span>
                  </UploadIconWrapper>
                  {cert.id !== '10th' && cert.id !== '12th' && (
                    <DeleteButton
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setCertifications(certifications.filter((_, i) => i !== index));
                      }}
                    />
                  )}
                </CertificationItem>
                {cert.error && <ErrorText>{cert.error}</ErrorText>}
              </div>
            );
          })}
          
          <AddMoreButton
            icon={<PlusOutlined />}
            onClick={handleAddMoreClick}
          >
            Add More Certification
          </AddMoreButton>
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

      <CertificateModal
        title="Select Certificate from DigiLocker"
        visible={showCertificateModal}
        onCancel={() => setShowCertificateModal(false)}
        footer={null}
        width={600}
      >
        {loadingCertificates ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <p style={{ color: '#ccc', marginTop: '16px' }}>Loading certificates from DigiLocker...</p>
          </div>
        ) : (
          <List
            dataSource={availableCertificates}
            renderItem={(certificate) => (
              <List.Item
                onClick={() => handleCertificateSelect(certificate)}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  title={<span style={{ color: '#fff' }}>{certificate.name}</span>}
                  description={<span style={{ color: '#ccc' }}>{certificate.description || certificate.type}</span>}
                />
              </List.Item>
            )}
          />
        )}
      </CertificateModal>
    </>
  );
}
