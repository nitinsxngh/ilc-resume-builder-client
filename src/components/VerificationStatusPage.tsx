import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Button, Timeline, Alert, Statistic, Row, Col, Divider, Typography, Space } from 'antd';

const { Item: TimelineItem } = Timeline;
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useVerification } from '../hooks/useVerification';
import { VerificationBadge } from './VerificationBadge';
import { VerificationPopup } from './VerificationPopup';

const { Title, Text, Paragraph } = Typography;

const StatusPageContainer = styled.div`
  padding: 24px;
  background: #1a1a1a;
  min-height: 100vh;
  
  .verification-card {
    background: #2a2a2a;
    border: 1px solid #333;
    border-radius: 12px;
    margin-bottom: 24px;
    
    .ant-card-head {
      background: #2a2a2a;
      border-bottom: 1px solid #333;
      
      .ant-card-head-title {
        color: #fff;
      }
    }
    
    .ant-card-body {
      color: #fff;
    }
  }
  
  .statistics-card {
    background: #2a2a2a;
    border: 1px solid #333;
    border-radius: 12px;
    text-align: center;
    
    .ant-statistic-title {
      color: #ccc;
    }
    
    .ant-statistic-content {
      color: #fff;
    }
  }
  
  .timeline-item {
    .ant-timeline-item-content {
      color: #fff;
    }
  }
`;

const VerificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .header-title {
    color: #fff;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
  }
`;

const VerificationOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const VerificationDetails = styled.div`
  .detail-section {
    margin-bottom: 24px;
  }
  
  .detail-title {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .detail-content {
    color: #ccc;
  }
`;

interface VerificationStatusPageProps {
  userId?: string;
}

export const VerificationStatusPage: React.FC<VerificationStatusPageProps> = ({ userId }) => {
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const { 
    verificationState, 
    getVerificationStatus, 
    revokeVerification,
    clearError 
  } = useVerification();

  useEffect(() => {
    if (userId) {
      getVerificationStatus(userId);
    }
  }, [userId, getVerificationStatus]);

  const handleVerifyClick = () => {
    setShowVerificationPopup(true);
  };

  const handleVerificationComplete = (verifiedData: any) => {
    console.log('Verification completed:', verifiedData);
    setShowVerificationPopup(false);
    // Refresh verification status
    if (userId) {
      getVerificationStatus(userId);
    }
  };

  const handleRevokeVerification = async () => {
    if (userId) {
      await revokeVerification(userId);
    }
  };

  const getVerificationTimeline = () => {
    const timeline: any[] = [];
    
    if (verificationState.verificationDate) {
      timeline.push({
        color: 'green' as const,
        children: (
          <div>
            <Text strong style={{ color: '#fff' }}>Verification Completed</Text>
            <br />
            <Text style={{ color: '#ccc' }}>
              Verified by {verificationState.verifiedBy} on{' '}
              {new Date(verificationState.verificationDate).toLocaleDateString()}
            </Text>
          </div>
        )
      });
    }
    
    timeline.push({
      color: 'blue' as const,
      children: (
        <div>
          <Text strong style={{ color: '#fff' }}>Profile Created</Text>
          <br />
          <Text style={{ color: '#ccc' }}>
            User profile was created and is ready for verification
          </Text>
        </div>
      )
    });
    
    return timeline;
  };

  const getVerificationStats = () => {
    const totalFields = 4; // name, email, phone, address
    const verifiedFields = verificationState.verifiedFields?.length || 0;
    const verificationPercentage = Math.round((verifiedFields / totalFields) * 100);
    
    return {
      totalFields,
      verifiedFields,
      verificationPercentage,
      confidence: Math.round((verificationState.confidence || 0) * 100)
    };
  };

  const stats = getVerificationStats();

  return (
    <StatusPageContainer>
      <VerificationHeader>
        <Title level={2} className="header-title">
          Identity Verification Status
        </Title>
        <div className="header-actions">
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => userId && getVerificationStatus(userId)}
            loading={verificationState.isLoading}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<SafetyCertificateOutlined />}
            onClick={handleVerifyClick}
          >
            {verificationState.isVerified ? 'Re-verify' : 'Verify Now'}
          </Button>
        </div>
      </VerificationHeader>

      {verificationState.error && (
        <Alert
          message="Verification Error"
          description={verificationState.error}
          type="error"
          showIcon
          closable
          onClose={clearError}
          style={{ marginBottom: '24px' }}
        />
      )}

      <VerificationOverview>
        <Card className="statistics-card">
          <Statistic
            title="Verification Status"
            value={verificationState.isVerified ? 'Verified' : 'Not Verified'}
            prefix={verificationState.isVerified ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
            valueStyle={{ 
              color: verificationState.isVerified ? '#52c41a' : '#ff4d4f',
              fontSize: '1.2rem'
            }}
          />
        </Card>

        <Card className="statistics-card">
          <Statistic
            title="Verified Fields"
            value={`${stats.verifiedFields}/${stats.totalFields}`}
            suffix="fields"
            valueStyle={{ color: '#1890ff', fontSize: '1.2rem' }}
          />
        </Card>

        <Card className="statistics-card">
          <Statistic
            title="Verification Percentage"
            value={stats.verificationPercentage}
            suffix="%"
            valueStyle={{ color: '#52c41a', fontSize: '1.2rem' }}
          />
        </Card>

        <Card className="statistics-card">
          <Statistic
            title="Confidence Level"
            value={stats.confidence}
            suffix="%"
            valueStyle={{ color: '#fa8c16', fontSize: '1.2rem' }}
          />
        </Card>
      </VerificationOverview>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Verification Details" className="verification-card">
            <VerificationDetails>
              <div className="detail-section">
                <div className="detail-title">Current Status</div>
                <div className="detail-content">
                  <VerificationBadge
                    status={verificationState.isVerified ? 'verified' : 'unverified'}
                    verifiedBy={verificationState.verifiedBy || undefined}
                    verificationDate={verificationState.verificationDate || undefined}
                    verifiedFields={verificationState.verifiedFields}
                    confidence={verificationState.confidence}
                    onVerify={handleVerifyClick}
                    onRevoke={verificationState.isVerified ? handleRevokeVerification : undefined}
                  />
                </div>
              </div>

              {verificationState.verifiedBy && (
                <div className="detail-section">
                  <div className="detail-title">Verification Service</div>
                  <div className="detail-content">
                    <Space>
                      <SafetyCertificateOutlined />
                      <Text>{verificationState.verifiedBy}</Text>
                    </Space>
                  </div>
                </div>
              )}

              {verificationState.verificationDate && (
                <div className="detail-section">
                  <div className="detail-title">Verification Date</div>
                  <div className="detail-content">
                    <Text>
                      {new Date(verificationState.verificationDate).toLocaleString()}
                    </Text>
                  </div>
                </div>
              )}

              {verificationState.verifiedFields && verificationState.verifiedFields.length > 0 && (
                <div className="detail-section">
                  <div className="detail-title">Verified Fields</div>
                  <div className="detail-content">
                    <Space wrap>
                      {verificationState.verifiedFields.map((field, index) => (
                        <Button key={index} size="small" type="primary" ghost>
                          {field}
                        </Button>
                      ))}
                    </Space>
                  </div>
                </div>
              )}
            </VerificationDetails>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Verification Timeline" className="verification-card">
            <Timeline className="timeline-item">
              {getVerificationTimeline().map((item, index) => (
                <TimelineItem key={index} color={item.color}>
                  {item.children}
                </TimelineItem>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      <Card title="Why Verify Your Identity?" className="verification-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: '2rem', color: '#52c41a', marginBottom: '8px' }} />
              <Title level={5} style={{ color: '#fff' }}>Build Trust</Title>
              <Paragraph style={{ color: '#ccc' }}>
                Verified profiles are more likely to be trusted by employers and recruiters.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <SafetyCertificateOutlined style={{ fontSize: '2rem', color: '#1890ff', marginBottom: '8px' }} />
              <Title level={5} style={{ color: '#fff' }}>Stand Out</Title>
              <Paragraph style={{ color: '#ccc' }}>
                Verified candidates often get priority in job applications and interviews.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <InfoCircleOutlined style={{ fontSize: '2rem', color: '#fa8c16', marginBottom: '8px' }} />
              <Title level={5} style={{ color: '#fff' }}>Secure Process</Title>
              <Paragraph style={{ color: '#ccc' }}>
                Your data is encrypted and processed securely using government-approved services.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>

      <VerificationPopup
        visible={showVerificationPopup}
        onClose={() => setShowVerificationPopup(false)}
        onVerificationComplete={handleVerificationComplete}
        userData={{
          name: 'John Doe', // This would come from user profile
          email: 'john.doe@example.com',
          phone: '+91 9876543210',
          address: '123 Main Street, City, State'
        }}
      />
    </StatusPageContainer>
  );
};
