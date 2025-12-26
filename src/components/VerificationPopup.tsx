import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button, Steps, Card, Typography, Alert, Spin, message, Form, Input } from 'antd';
import { resumeApiService } from 'src/services/resumeApi';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SafetyCertificateOutlined,
  LoadingOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

const VerificationContainer = styled.div`
  .verification-popup {
    .ant-modal-content {
      background: #1a1a1a;
      border-radius: 12px;
    }
    
    .ant-modal-header {
      background: #1a1a1a;
      border-bottom: 1px solid #333;
      
      .ant-modal-title {
        color: #fff;
        font-size: 1.5rem;
        font-weight: 600;
      }
    }
    
    .ant-modal-body {
      padding: 24px;
    }
    
    .ant-modal-footer {
      background: #1a1a1a;
      border-top: 1px solid #333;
    }
  }
  
  .ant-modal {
    z-index: 9999 !important;
  }
  
  .ant-modal-mask {
    z-index: 9998 !important;
  }
`;

const VerificationCard = styled(Card)`
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  margin: 16px 0;
  
  .ant-card-head {
    border-bottom: 1px solid #333;
    
    .ant-card-head-title {
      color: #fff;
    }
  }
  
  .ant-card-body {
    color: #fff;
  }
`;

const ServiceButton = styled(Button)`
  width: 100%;
  height: 60px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #333;
  border: 1px solid #555;
  color: #fff;
  
  &:hover {
    background: #444;
    border-color: #666;
    color: #fff;
  }
  
  &.active {
    background: #1890ff;
    border-color: #1890ff;
  }
  
  .anticon {
    font-size: 24px;
    margin-right: 12px;
  }
`;

const VerificationForm = styled(Form)`
  .ant-form-item-label > label {
    color: #fff;
    font-weight: 500;
  }
  
  .ant-input {
    background: #424242;
    border: 1px solid #555;
    color: #fff;
    
    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
  
  .ant-select-selector {
    background: #424242 !important;
    border: 1px solid #555 !important;
    color: #fff !important;
  }
  
  .ant-select-selection-item {
    color: #fff !important;
  }
  
  .ant-upload {
    .ant-upload-btn {
      background: #424242;
      border: 1px solid #555;
      color: #fff;
      
      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }
    }
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  
  .section-title {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;


const StatusIndicator = styled.div<{ status: 'pending' | 'verifying' | 'verified' | 'failed' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 6px;
  background: ${props => {
    switch (props.status) {
      case 'verified': return '#f6ffed';
      case 'failed': return '#fff2f0';
      case 'verifying': return '#fff7e6';
      default: return '#f5f5f5';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'verified': return '#b7eb8f';
      case 'failed': return '#ffccc7';
      case 'verifying': return '#ffd591';
      default: return '#d9d9d9';
    }
  }};
  
  .status-text {
    color: ${props => {
      switch (props.status) {
        case 'verified': return '#52c41a';
        case 'failed': return '#ff4d4f';
        case 'verifying': return '#fa8c16';
        default: return '#666';
      }
    }};
    font-weight: 500;
  }
`;

interface VerificationService {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  apiEndpoint: string;
  supportedDocuments: string[];
  isAvailable: boolean;
}

interface VerificationData {
  name: string;
  email: string;
  phone: string;
  aadhaar?: string;
  pan?: string;
  address?: string;
}

interface VerificationPopupProps {
  visible: boolean;
  onClose: () => void;
  onVerificationComplete: (verifiedData: VerificationData) => void;
  userData: VerificationData;
}

const verificationServices: VerificationService[] = [
  {
    id: 'digilocker',
    name: 'DigiLocker',
    icon: <SafetyCertificateOutlined />,
    description: 'Verify using Aadhaar and government documents',
    apiEndpoint: 'https://api.digilocker.gov.in',
    supportedDocuments: ['Aadhaar', 'PAN', 'Driving License', 'Voter ID'],
    isAvailable: true
  }
];

export const VerificationPopup: React.FC<VerificationPopupProps> = ({
  visible,
  onClose,
  onVerificationComplete,
  userData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'verified' | 'failed'>('pending');
  const [verificationResults, setVerificationResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [verificationData, setVerificationData] = useState<any>(null);


  const steps = [
    {
      title: 'Select Service',
      description: 'Choose verification method'
    },
    {
      title: 'Enter Details',
      description: 'Provide verification information'
    },
    {
      title: 'Verify Data',
      description: 'Complete verification process'
    },
    {
      title: 'Confirmation',
      description: 'Review verified information'
    }
  ];

  const handleServiceSelect = async (serviceId: string) => {
    setSelectedService(serviceId);
    
    // For DigiLocker, redirect immediately to OAuth
    if (serviceId === 'digilocker') {
      try {
        setIsLoading(true);
        message.info('Redirecting to DigiLocker for authentication...', 2);
        
        const { verificationService } = await import('src/services/verificationService');
        
        const request = {
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || ''
        };
        
        console.log('Starting DigiLocker verification with:', request);
        const result = await verificationService.verifyWithMeriPahachan(request);
        
        if (result.error && result.error.includes('Redirecting')) {
          // Redirect is happening, don't do anything else
          // The redirect will happen via window.location.href
          return;
        } else {
          setIsLoading(false);
          message.error(result.error || 'Failed to start verification. The DigiLocker API may be temporarily unavailable (HTTP 503). Please try again later or contact support.');
        }
      } catch (error: any) {
        console.error('Error starting DigiLocker verification:', error);
        setIsLoading(false);
        message.error(`Failed to start verification: ${error.message || 'Unknown error'}. If you see HTTP 503, the DigiLocker API may be temporarily down.`);
      }
      return;
    }
    
    // For other services, show the form
    setCurrentStep(1);
    // Pre-fill form with user data
    form.setFieldsValue({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address
    });
  };

  const handleFormSubmit = (values: any) => {
    setVerificationData(values);
    setCurrentStep(2);
  };

  const handleVerification = async () => {
    if (!selectedService) return;

    // For DigiLocker, we can use userData directly if verificationData is not available
    const dataToUse = verificationData || userData;
    if (!dataToUse) return;

    setIsLoading(true);
    setVerificationStatus('verifying');

    try {
      // Import verification service
      const { verificationService } = await import('src/services/verificationService');
      
      // For DigiLocker/MeriPahachan, initiate OAuth flow
      if (selectedService === 'digilocker') {
        const request = {
          name: dataToUse.name || userData.name || '',
          email: dataToUse.email || userData.email || '',
          phone: dataToUse.phone || userData.phone || '',
          address: dataToUse.address || userData.address || ''
        };
        
        console.log('Initiating MeriPahachan verification with:', request);
        
        const result = await verificationService.verifyWithMeriPahachan(request);
        
        // If redirecting, the callback page will handle the rest
        if (result.error && result.error.includes('Redirecting')) {
          // The redirect will happen automatically via window.location.href
          console.log('Redirecting to MeriPahachan OAuth...');
          // Don't set loading to false, let the redirect happen
          return;
        }
        
        if (result.success && result.data) {
          setVerificationStatus('verified');
          setVerificationResults(result.data);
          setCurrentStep(3);
          message.success('Verification completed successfully!');
          // Merge verification metadata with user data to create complete VerificationData
          const completeVerificationData: VerificationData = {
            name: dataToUse.name || userData.name || '',
            email: dataToUse.email || userData.email || '',
            phone: dataToUse.phone || userData.phone || '',
            aadhaar: dataToUse.aadhaar || userData.aadhaar,
            pan: dataToUse.pan || userData.pan,
            address: dataToUse.address || userData.address
          };
          // Add verification metadata (callbacks accept any, so this is safe)
          Object.assign(completeVerificationData, result.data);
          
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
                  name: completeVerificationData.name,
                  email: completeVerificationData.email,
                  phone: completeVerificationData.phone,
                  aadhaar: completeVerificationData.aadhaar,
                  pan: completeVerificationData.pan,
                  address: completeVerificationData.address
                }
              });
              console.log('Verification data saved to backend');
            }
          } catch (error) {
            console.error('Error saving verification data to backend:', error);
            // Don't fail the verification if backend save fails
          }
          
          onVerificationComplete(completeVerificationData as any);
          setIsLoading(false);
        } else {
          setVerificationStatus('failed');
          message.error(result.error || 'Verification failed. Please try again.');
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationStatus('failed');
      message.error(error.message || 'Verification failed. Please try again.');
      setIsLoading(false);
    }
  };


  const handleConfirmVerification = () => {
    if (verificationResults) {
      onVerificationComplete(verificationResults);
      onClose();
    }
  };

  const resetPopup = () => {
    setCurrentStep(0);
    setSelectedService(null);
    setVerificationStatus('pending');
    setVerificationResults(null);
    setIsLoading(false);
    setVerificationData(null);
  };

  useEffect(() => {
    if (visible) {
      resetPopup();
    }
  }, [visible]);

  // Reset form when modal opens and form is available
  useEffect(() => {
    if (visible && currentStep === 1) {
      // Reset form when we reach the form step
      setTimeout(() => {
        if (form && form.resetFields) {
          form.resetFields();
        }
      }, 0);
    }
  }, [visible, currentStep, form]);

  const renderServiceSelection = () => (
    <div>
      <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>
        Choose Verification Method
      </Title>
      <Paragraph style={{ color: '#ccc', marginBottom: '24px' }}>
        Select a verification service to verify your personal information. This helps ensure the accuracy of your resume data.
      </Paragraph>
      
      {verificationServices.map((service) => (
        <ServiceButton
          key={service.id}
          onClick={() => handleServiceSelect(service.id)}
          disabled={!service.isAvailable}
          className={selectedService === service.id ? 'active' : ''}
        >
          {service.icon}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{service.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{service.description}</div>
          </div>
        </ServiceButton>
      ))}
    </div>
  );

  const renderVerificationForm = () => {
    const service = verificationServices.find(s => s.id === selectedService);
    
    return (
      <div>
        <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>
          Enter Verification Details
        </Title>
        <Paragraph style={{ color: '#ccc', marginBottom: '24px' }}>
          Please provide the required information for {service?.name} verification.
        </Paragraph>

        <VerificationForm
          key={`verification-form-${selectedService}`}
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address
          }}
        >
          <FormSection>
            <div className="section-title">
              <UserOutlined />
              Personal Information
            </div>
            
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input placeholder="Enter your full name as per official documents" />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email address' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email address" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please enter your address' }]}
            >
              <Input prefix={<HomeOutlined />} placeholder="Enter your complete address" />
            </Form.Item>
          </FormSection>

          {selectedService === 'digilocker' && (
            <FormSection>
              <div className="section-title">
                <SafetyCertificateOutlined />
                Aadhaar Information
              </div>
              
              <Form.Item
                label="Aadhaar Number"
                name="aadhaar"
                rules={[
                  { required: true, message: 'Please enter your Aadhaar number' },
                  { pattern: /^[0-9]{12}$/, message: 'Aadhaar number must be 12 digits' }
                ]}
              >
                <Input placeholder="Enter 12-digit Aadhaar number" maxLength={12} />
              </Form.Item>
            </FormSection>
          )}


          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button onClick={() => setCurrentStep(0)} style={{ flex: 1 }}>
              Back
            </Button>
            <Button type="primary" htmlType="submit" style={{ flex: 1 }}>
              Continue to Verification
            </Button>
          </div>
        </VerificationForm>
      </div>
    );
  };

  const renderVerificationProcess = () => {
    const service = verificationServices.find(s => s.id === selectedService);
    
    return (
      <div>
        <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>
          Verifying with {service?.name}
        </Title>
        
        <VerificationCard title="Data to be Verified">
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ color: '#fff' }}>Name:</Text> {verificationData?.name || userData.name}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ color: '#fff' }}>Email:</Text> {verificationData?.email || userData.email}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ color: '#fff' }}>Phone:</Text> {verificationData?.phone || userData.phone}
          </div>
          {verificationData?.aadhaar && (
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ color: '#fff' }}>Aadhaar:</Text> {verificationData.aadhaar}
            </div>
          )}
        </VerificationCard>

        <StatusIndicator status={verificationStatus}>
          {verificationStatus === 'verifying' && <LoadingOutlined />}
          {verificationStatus === 'verified' && <CheckCircleOutlined />}
          {verificationStatus === 'failed' && <CloseCircleOutlined />}
          <span className="status-text">
            {verificationStatus === 'pending' && 'Ready to verify'}
            {verificationStatus === 'verifying' && 'Verifying your information...'}
            {verificationStatus === 'verified' && 'Verification successful!'}
            {verificationStatus === 'failed' && 'Verification failed'}
          </span>
        </StatusIndicator>

        {verificationStatus === 'pending' && (
          <Button 
            type="primary" 
            size="large" 
            onClick={handleVerification}
            style={{ marginTop: '16px', width: '100%' }}
          >
            Start Verification
          </Button>
        )}

        {verificationStatus === 'verifying' && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', color: '#fff' }}>
              Please wait while we verify your information...
            </div>
          </div>
        )}

        {verificationStatus === 'failed' && (
          <Button 
            type="primary" 
            size="large" 
            onClick={handleVerification}
            style={{ marginTop: '16px', width: '100%' }}
          >
            Try Again
          </Button>
        )}
      </div>
    );
  };

  const renderConfirmation = () => (
    <div>
      <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>
        Verification Complete
      </Title>
      
      <Alert
        message="Verification Successful"
        description="Your information has been successfully verified and will be marked as verified in your resume."
        type="success"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <VerificationCard title="Verified Information">
        {verificationResults && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#fff' }}>Verified by:</Text> {verificationResults.verifiedBy}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#fff' }}>Verification Date:</Text> {new Date(verificationResults.verificationDate).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#fff' }}>Verified Fields:</Text> {verificationResults.verifiedFields.join(', ')}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#fff' }}>Confidence Level:</Text> {Math.round((verificationResults.confidence || 0) * 100)}%
            </div>
          </div>
        )}
      </VerificationCard>

      {verificationData && (
        <VerificationCard title="Submitted Information">
          <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ color: '#fff' }}>Name:</Text> {verificationData.name}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ color: '#fff' }}>Email:</Text> {verificationData.email}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ color: '#fff' }}>Phone:</Text> {verificationData.phone}
          </div>
          {verificationData.aadhaar && (
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#fff' }}>Aadhaar:</Text> {verificationData.aadhaar}
            </div>
          )}
        </VerificationCard>
      )}

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <Button 
          onClick={() => setCurrentStep(0)}
          style={{ flex: 1 }}
        >
          Verify Another Service
        </Button>
        <Button 
          type="primary" 
          onClick={handleConfirmVerification}
          style={{ flex: 1 }}
        >
          Confirm & Save
        </Button>
      </div>
    </div>
  );


  return (
    <VerificationContainer>
      {visible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#1a1a1a',
            padding: '24px',
            borderRadius: '12px',
            color: '#fff',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#fff' }}>Verify Your Information</h2>
              <button 
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#fff', marginBottom: '16px' }}>Choose Verification Method</h3>
              <p style={{ color: '#ccc', marginBottom: '24px' }}>
                Select a verification service to verify your personal information.
              </p>
              
              {verificationServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    console.log('Service selected:', service.id);
                    handleServiceSelect(service.id);
                  }}
                  disabled={!service.isAvailable || isLoading}
                  style={{
                    width: '100%',
                    height: '60px',
                    margin: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    background: selectedService === service.id ? '#1890ff' : '#333',
                    border: '1px solid #555',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: (!service.isAvailable || isLoading) ? 'not-allowed' : 'pointer',
                    padding: '0 16px',
                    opacity: (!service.isAvailable || isLoading) ? 0.6 : 1
                  }}
                >
                  {isLoading && service.id === selectedService ? (
                    <LoadingOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
                  ) : (
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>{service.icon}</span>
                  )}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{service.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>{service.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <Modal
        title="Verify Your Information"
        visible={false} // Disable Antd Modal for now
        onCancel={onClose}
        width={600}
        className="verification-popup"
        footer={null}
        destroyOnClose={true}
        forceRender={false}
        zIndex={9999}
        maskClosable={true}
        centered={true}
      >
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map((step, index) => (
            <Step 
              key={index} 
              title={step.title} 
              description={step.description}
            />
          ))}
        </Steps>

        {currentStep === 0 && renderServiceSelection()}
        {currentStep === 1 && renderVerificationForm()}
        {currentStep === 2 && renderVerificationProcess()}
        {currentStep === 3 && renderConfirmation()}
      </Modal>
    </VerificationContainer>
  );
};
