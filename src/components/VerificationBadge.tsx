import React from 'react';
import styled from 'styled-components';
import { Tooltip, Badge, Button } from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const VerificationBadgeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  .verification-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &.verified {
      background: #f6ffed;
      color: #52c41a;
      border: 1px solid #b7eb8f;
    }
    
    &.pending {
      background: #fff7e6;
      color: #fa8c16;
      border: 1px solid #ffd591;
    }
    
    &.failed {
      background: #fff2f0;
      color: #ff4d4f;
      border: 1px solid #ffccc7;
    }
    
    &.loading {
      background: #f0f0f0;
      color: #666;
      border: 1px solid #d9d9d9;
    }
  }
  
  .verification-icon {
    font-size: 14px;
  }
  
  .verification-actions {
    display: flex;
    gap: 4px;
  }
`;

interface VerificationBadgeProps {
  status: 'verified' | 'pending' | 'failed' | 'loading' | 'unverified';
  verifiedBy?: string;
  verificationDate?: string;
  verifiedFields?: string[];
  confidence?: number;
  onVerify?: () => void;
  onRevoke?: () => void;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  verifiedBy,
  verificationDate,
  verifiedFields = [],
  confidence,
  onVerify,
  onRevoke,
  showDetails = false,
  size = 'medium'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircleOutlined className="verification-icon" />,
          text: 'Verified',
          className: 'verified'
        };
      case 'pending':
        return {
          icon: <ClockCircleOutlined className="verification-icon" />,
          text: 'Pending',
          className: 'pending'
        };
      case 'failed':
        return {
          icon: <ExclamationCircleOutlined className="verification-icon" />,
          text: 'Failed',
          className: 'failed'
        };
      case 'loading':
        return {
          icon: <ClockCircleOutlined className="verification-icon" />,
          text: 'Verifying...',
          className: 'loading'
        };
      default:
        return {
          icon: <InfoCircleOutlined className="verification-icon" />,
          text: 'Not Verified',
          className: 'unverified'
        };
    }
  };

  const getTooltipContent = () => {
    if (status === 'verified' && showDetails) {
      return (
        <div>
          <div><strong>Verified by:</strong> {verifiedBy}</div>
          {verificationDate && (
            <div><strong>Date:</strong> {new Date(verificationDate).toLocaleDateString()}</div>
          )}
          {verifiedFields.length > 0 && (
            <div><strong>Fields:</strong> {verifiedFields.join(', ')}</div>
          )}
          {confidence && (
            <div><strong>Confidence:</strong> {Math.round(confidence * 100)}%</div>
          )}
        </div>
      );
    }
    
    if (status === 'unverified') {
      return 'Click to verify your information';
    }
    
    return getStatusConfig().text;
  };

  const statusConfig = getStatusConfig();

  return (
    <VerificationBadgeContainer>
      <Tooltip title={getTooltipContent()}>
        <div className={`verification-badge ${statusConfig.className}`}>
          {statusConfig.icon}
          <span>{statusConfig.text}</span>
          {status === 'verified' && confidence && (
            <Badge 
              count={`${Math.round(confidence * 100)}%`} 
              style={{ backgroundColor: '#52c41a' }}
            />
          )}
        </div>
      </Tooltip>
      
      {status === 'unverified' && onVerify && (
        <Button 
          type="link" 
          size="small" 
          onClick={onVerify}
          style={{ padding: 0, height: 'auto' }}
        >
          Verify
        </Button>
      )}
      
      {status === 'verified' && onRevoke && (
        <Button 
          type="link" 
          size="small" 
          onClick={onRevoke}
          style={{ padding: 0, height: 'auto', color: '#ff4d4f' }}
        >
          Revoke
        </Button>
      )}
    </VerificationBadgeContainer>
  );
};

// Compact version for use in forms
export const CompactVerificationBadge: React.FC<Omit<VerificationBadgeProps, 'showDetails' | 'size'>> = (props) => {
  return (
    <VerificationBadge 
      {...props} 
      showDetails={false} 
      size="small" 
    />
  );
};

// Detailed version for verification status pages
export const DetailedVerificationBadge: React.FC<VerificationBadgeProps> = (props) => {
  return (
    <VerificationBadge 
      {...props} 
      showDetails={true} 
      size="large" 
    />
  );
};
