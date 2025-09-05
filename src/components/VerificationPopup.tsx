import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Button, Steps, Card, Typography, Alert, Spin, message, Form, Input, Select, Upload } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  IdcardOutlined, 
  SafetyCertificateOutlined,
  BankOutlined,
  FileTextOutlined,
  LoadingOutlined,
  UploadOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

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

const DocumentUpload = styled.div`
  .upload-area {
    border: 2px dashed #555;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    background: #2a2a2a;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #1890ff;
      background: #333;
    }
  }
  
  .upload-text {
    color: #ccc;
    margin-top: 8px;
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
  },
  {
    id: 'manual-verification',
    name: 'Manual Verification',
    icon: <FileTextOutlined />,
    description: 'Upload documents for manual verification',
    apiEndpoint: 'internal',
    supportedDocuments: ['Any Government ID', 'Educational Certificates'],
    isAvailable: true
  },
  {
    id: 'phone-verification',
    name: 'Phone Verification',
    icon: <PhoneOutlined />,
    description: 'Verify phone number with OTP',
    apiEndpoint: 'internal',
    supportedDocuments: ['Phone Number'],
    isAvailable: true
  },
  {
    id: 'email-verification',
    name: 'Email Verification',
    icon: <MailOutlined />,
    description: 'Verify email address with OTP',
    apiEndpoint: 'internal',
    supportedDocuments: ['Email Address'],
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

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
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
    if (!selectedService || !verificationData) return;

    setIsLoading(true);
    setVerificationStatus('verifying');

    try {
      // Simulate API call based on selected service
      const result = await simulateVerification(selectedService, verificationData);
      
      if (result.success) {
        setVerificationStatus('verified');
        setVerificationResults(result.data);
        setCurrentStep(3);
        message.success('Verification completed successfully!');
      } else {
        setVerificationStatus('failed');
        message.error('Verification failed. Please try again.');
      }
    } catch (error) {
      setVerificationStatus('failed');
      message.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateVerification = async (serviceId: string, data: VerificationData): Promise<any> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock verification logic based on service
    switch (serviceId) {
      case 'digilocker':
        return {
          success: true,
          data: {
            ...data,
            verifiedBy: 'DigiLocker',
            verificationDate: new Date().toISOString(),
            verifiedFields: ['name', 'email', 'phone', 'aadhaar'],
            confidence: 0.95
          }
        };
      case 'manual-verification':
        return {
          success: true,
          data: {
            ...data,
            verifiedBy: 'Manual Verification',
            verificationDate: new Date().toISOString(),
            verifiedFields: ['name', 'email', 'document'],
            confidence: 0.85
          }
        };
      case 'phone-verification':
        return {
          success: true,
          data: {
            ...data,
            verifiedBy: 'Phone OTP Verification',
            verificationDate: new Date().toISOString(),
            verifiedFields: ['name', 'phone'],
            confidence: 0.90
          }
        };
      case 'email-verification':
        return {
          success: true,
          data: {
            ...data,
            verifiedBy: 'Email Verification',
            verificationDate: new Date().toISOString(),
            verifiedFields: ['name', 'email'],
            confidence: 0.88
          }
        };
      default:
        return { success: false, error: 'Service not available' };
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

          {selectedService === 'manual-verification' && (
            <FormSection>
              <div className="section-title">
                <FileTextOutlined />
                Document Upload
              </div>
              
              <Form.Item
                label="Document Type"
                name="documentType"
                rules={[{ required: true, message: 'Please select document type' }]}
              >
                <Select placeholder="Select document type">
                  <Option value="aadhaar">Aadhaar Card</Option>
                  <Option value="pan">PAN Card</Option>
                  <Option value="passport">Passport</Option>
                  <Option value="driving_license">Driving License</Option>
                  <Option value="voter_id">Voter ID</Option>
                  <Option value="other">Other Government ID</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Upload Document"
                name="document"
                rules={[{ required: true, message: 'Please upload a document' }]}
              >
                <DocumentUpload>
                  <Upload.Dragger
                    name="document"
                    multiple={false}
                    beforeUpload={() => false}
                    accept=".pdf,.jpg,.jpeg,.png"
                    showUploadList={false}
                  >
                    <div className="upload-area">
                      <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                      <div className="upload-text">
                        <p>Click or drag file to this area to upload</p>
                        <p>Support for PDF, JPG, PNG files</p>
                      </div>
                    </div>
                  </Upload.Dragger>
                </DocumentUpload>
              </Form.Item>
            </FormSection>
          )}

          {selectedService === 'phone-verification' && (
            <FormSection>
              <div className="section-title">
                <PhoneOutlined />
                Phone Verification
              </div>
              
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: 'Please enter your phone number' },
                  { pattern: /^[6-9]\d{9}$/, message: 'Please enter a valid 10-digit phone number' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Enter your 10-digit phone number" 
                  maxLength={10}
                />
              </Form.Item>
              
              <div style={{ 
                padding: '12px', 
                background: '#333', 
                borderRadius: '6px', 
                marginBottom: '16px',
                color: '#ccc',
                fontSize: '14px'
              }}>
                <strong>How it works:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li>We'll send an OTP to your phone number</li>
                  <li>Enter the OTP to verify your phone number</li>
                  <li>This helps confirm your identity</li>
                </ul>
              </div>
            </FormSection>
          )}

          {selectedService === 'email-verification' && (
            <FormSection>
              <div className="section-title">
                <MailOutlined />
                Email Verification
              </div>
              
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Enter your email address" 
                />
              </Form.Item>
              
              <div style={{ 
                padding: '12px', 
                background: '#333', 
                borderRadius: '6px', 
                marginBottom: '16px',
                color: '#ccc',
                fontSize: '14px'
              }}>
                <strong>How it works:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li>We'll send a verification link to your email</li>
                  <li>Click the link to verify your email address</li>
                  <li>This helps confirm your identity</li>
                </ul>
              </div>
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
          {verificationData?.documentType && (
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ color: '#fff' }}>Document Type:</Text> {verificationData.documentType}
            </div>
          )}
          {selectedService === 'phone-verification' && (
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ color: '#fff' }}>Verification Method:</Text> Phone OTP
            </div>
          )}
          {selectedService === 'email-verification' && (
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ color: '#fff' }}>Verification Method:</Text> Email Link
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
          {verificationData.documentType && (
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#fff' }}>Document Type:</Text> {verificationData.documentType}
            </div>
          )}
          {selectedService === 'phone-verification' && (
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#fff' }}>Verification Method:</Text> Phone OTP Verification
            </div>
          )}
          {selectedService === 'email-verification' && (
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#fff' }}>Verification Method:</Text> Email Link Verification
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
                  onClick={() => handleServiceSelect(service.id)}
                  disabled={!service.isAvailable}
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
                    cursor: 'pointer',
                    padding: '0 16px'
                  }}
                >
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>{service.icon}</span>
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
