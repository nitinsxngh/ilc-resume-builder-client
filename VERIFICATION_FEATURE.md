# Identity Verification Feature

This document describes the identity verification feature added to the ILC Blockchain Resume Builder. The feature allows users to verify their personal information using third-party services like DigiLocker, PAN verification, and document upload.

## Features

### 1. Verification Popup Component
- **File**: `src/components/VerificationPopup.tsx`
- **Purpose**: Main verification interface with step-by-step process
- **Features**:
  - Service selection (DigiLocker, PAN, Bank, Document Upload)
  - Real-time verification status
  - Progress tracking with steps
  - Confirmation and review

### 2. Verification Service
- **File**: `src/services/verificationService.ts`
- **Purpose**: Handles API integrations with third-party verification services
- **Supported Services**:
  - DigiLocker API integration
  - PAN verification service
  - Bank account verification
  - Document upload and OCR verification

### 3. Verification Hook
- **File**: `src/hooks/useVerification.ts`
- **Purpose**: React hook for managing verification state and operations
- **Features**:
  - State management for verification status
  - API call handlers for different verification methods
  - Error handling and loading states

### 4. Verification Badge Component
- **File**: `src/components/VerificationBadge.tsx`
- **Purpose**: Displays verification status with visual indicators
- **Variants**:
  - Compact version for forms
  - Detailed version for status pages
  - Interactive badges with actions

### 5. Verification Status Page
- **File**: `src/components/VerificationStatusPage.tsx`
- **Purpose**: Comprehensive verification status dashboard
- **Features**:
  - Verification statistics and metrics
  - Timeline of verification events
  - Detailed verification information
  - Re-verification options

## Integration Points

### 1. IntroEdit Component
The verification feature is integrated into the `IntroEdit` component (`src/core/components/editor/IntroEdit.tsx`):
- Added verification section below personal information fields
- Integrated verification badge and popup
- Real-time verification status display

### 2. Environment Configuration
Added verification service configuration to `env.example`:
```env
# DigiLocker API Configuration
NEXT_PUBLIC_DIGILOCKER_CLIENT_ID=your_digilocker_client_id
NEXT_PUBLIC_DIGILOCKER_CLIENT_SECRET=your_digilocker_client_secret
NEXT_PUBLIC_DIGILOCKER_REDIRECT_URI=http://localhost:3000/auth/digilocker/callback

# PAN Verification API Configuration
NEXT_PUBLIC_PAN_API_KEY=your_pan_verification_api_key
NEXT_PUBLIC_PAN_API_URL=https://api.income-tax.gov.in

# Other verification services...
```

## Usage

### Basic Integration
```tsx
import { VerificationPopup } from 'src/components/VerificationPopup';
import { VerificationBadge } from 'src/components/VerificationBadge';
import { useVerification } from 'src/hooks/useVerification';

function MyComponent() {
  const { verificationState, verifyWithDigiLocker } = useVerification();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <VerificationBadge
        status={verificationState.isVerified ? 'verified' : 'unverified'}
        onVerify={() => setShowPopup(true)}
      />
      
      <VerificationPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onVerificationComplete={(data) => console.log(data)}
        userData={{
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210'
        }}
      />
    </div>
  );
}
```

### Verification Service Usage
```tsx
import { verificationService } from 'src/services/verificationService';

// DigiLocker verification
const result = await verificationService.verifyWithDigiLocker({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  aadhaar: '123456789012'
});

// PAN verification
const panResult = await verificationService.verifyPAN({
  name: 'John Doe',
  pan: 'ABCDE1234F'
});
```

## API Integration

### DigiLocker Integration
1. **OAuth Flow**: Users are redirected to DigiLocker for authentication
2. **Document Access**: After authentication, access user's stored documents
3. **Data Verification**: Compare user-provided data with DigiLocker documents

### PAN Verification
1. **API Call**: Direct API call to PAN verification service
2. **Data Validation**: Validate PAN format and cross-reference with name
3. **Response Processing**: Handle verification results and confidence scores

### Document Upload
1. **File Upload**: Accept various document formats (PDF, JPEG, PNG)
2. **OCR Processing**: Extract text from uploaded documents
3. **Data Extraction**: Parse and verify extracted information

## Security Considerations

1. **Data Encryption**: All verification data is encrypted in transit and at rest
2. **API Security**: Secure API key management and rate limiting
3. **User Privacy**: Minimal data collection and secure storage
4. **Audit Trail**: Complete logging of verification attempts and results

## Configuration

### Environment Variables
Set up the following environment variables for full functionality:

```env
# DigiLocker
NEXT_PUBLIC_DIGILOCKER_CLIENT_ID=your_client_id
NEXT_PUBLIC_DIGILOCKER_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_DIGILOCKER_REDIRECT_URI=your_redirect_uri

# PAN Verification
NEXT_PUBLIC_PAN_API_KEY=your_pan_api_key

# Other services...
NEXT_PUBLIC_VERIFICATION_ENABLED=true
```

### Service Configuration
Each verification service can be configured in `verificationService.ts`:

```typescript
const digiLockerConfig: DigiLockerConfig = {
  clientId: process.env.NEXT_PUBLIC_DIGILOCKER_CLIENT_ID || '',
  clientSecret: process.env.NEXT_PUBLIC_DIGILOCKER_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_DIGILOCKER_REDIRECT_URI || '',
  baseUrl: 'https://api.digilocker.gov.in'
};
```

## Testing

### Mock Services
The verification service includes mock implementations for testing:
- Simulated API delays
- Mock verification responses
- Error simulation for testing error handling

### Test Scenarios
1. **Successful Verification**: Test with valid data
2. **Failed Verification**: Test with invalid data
3. **Network Errors**: Test API failure scenarios
4. **User Cancellation**: Test user-initiated cancellation

## Future Enhancements

1. **Additional Services**: Integration with more verification providers
2. **Blockchain Integration**: Store verification results on blockchain
3. **Advanced OCR**: Enhanced document processing capabilities
4. **Biometric Verification**: Face recognition and fingerprint verification
5. **Real-time Verification**: Live verification during form filling

## Troubleshooting

### Common Issues
1. **API Key Errors**: Verify environment variables are set correctly
2. **Network Timeouts**: Check API endpoint availability
3. **Verification Failures**: Ensure data format matches service requirements
4. **UI Issues**: Check component imports and styling

### Debug Mode
Enable debug logging by setting:
```env
NEXT_PUBLIC_VERIFICATION_DEBUG=true
```

## Support

For issues or questions regarding the verification feature:
1. Check the console for error messages
2. Verify environment configuration
3. Test with mock data first
4. Review API documentation for specific services
