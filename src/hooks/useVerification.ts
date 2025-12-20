import { useState, useCallback } from 'react';
import { verificationService, VerificationRequest, VerificationResponse } from '../services/verificationService';

export interface VerificationState {
  isVerified: boolean;
  verifiedBy: string | null;
  verificationDate: string | null;
  verifiedFields: string[];
  confidence: number;
  isLoading: boolean;
  error: string | null;
}

export interface UseVerificationReturn {
  verificationState: VerificationState;
  verifyWithDigiLocker: (request: VerificationRequest) => Promise<VerificationResponse>;
  verifyWithPAN: (request: VerificationRequest) => Promise<VerificationResponse>;
  verifyWithBank: (request: VerificationRequest) => Promise<VerificationResponse>;
  verifyWithDocument: (file: File, request: VerificationRequest) => Promise<VerificationResponse>;
  getVerificationStatus: (userId: string) => Promise<VerificationResponse>;
  revokeVerification: (userId: string) => Promise<VerificationResponse>;
  clearError: () => void;
  resetVerification: () => void;
}

const initialVerificationState: VerificationState = {
  isVerified: false,
  verifiedBy: null,
  verificationDate: null,
  verifiedFields: [],
  confidence: 0,
  isLoading: false,
  error: null
};

export const useVerification = (): UseVerificationReturn => {
  const [verificationState, setVerificationState] = useState<VerificationState>(initialVerificationState);

  const setLoading = useCallback((isLoading: boolean) => {
    setVerificationState(prev => ({ ...prev, isLoading, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setVerificationState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setVerificationData = useCallback((data: VerificationResponse['data']) => {
    if (data) {
      setVerificationState(prev => ({
        ...prev,
        isVerified: true,
        verifiedBy: data.verifiedBy,
        verificationDate: data.verificationDate,
        verifiedFields: data.verifiedFields,
        confidence: data.confidence,
        isLoading: false,
        error: null
      }));
    }
  }, []);

  const verifyWithDigiLocker = useCallback(async (request: VerificationRequest): Promise<VerificationResponse> => {
    setLoading(true);
    
    try {
      const response = await verificationService.verifyWithDigiLocker(request);
      
      if (response.success && response.data) {
        setVerificationData(response.data);
      } else {
        setError(response.error || 'DigiLocker verification failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError, setVerificationData]);

  const verifyWithPAN = useCallback(async (request: VerificationRequest): Promise<VerificationResponse> => {
    setLoading(true);
    
    try {
      const response = await verificationService.verifyPAN(request);
      
      if (response.success && response.data) {
        setVerificationData(response.data);
      } else {
        setError(response.error || 'PAN verification failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError, setVerificationData]);

  const verifyWithBank = useCallback(async (request: VerificationRequest): Promise<VerificationResponse> => {
    setLoading(true);
    
    try {
      const response = await verificationService.verifyBankAccount(request);
      
      if (response.success && response.data) {
        setVerificationData(response.data);
      } else {
        setError(response.error || 'Bank verification failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError, setVerificationData]);

  const verifyWithDocument = useCallback(async (file: File, request: VerificationRequest): Promise<VerificationResponse> => {
    setLoading(true);
    
    try {
      const response = await verificationService.verifyUploadedDocument(file, request);
      
      if (response.success && response.data) {
        setVerificationData(response.data);
      } else {
        setError(response.error || 'Document verification failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError, setVerificationData]);

  const getVerificationStatus = useCallback(async (userId: string): Promise<VerificationResponse> => {
    setLoading(true);
    
    try {
      const response = await verificationService.getVerificationStatus(userId);
      
      if (response.success && response.data) {
        setVerificationData(response.data);
      } else {
        setError(response.error || 'Failed to get verification status');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError, setVerificationData]);

  const revokeVerification = useCallback(async (userId: string): Promise<VerificationResponse> => {
    setLoading(true);
    
    try {
      const response = await verificationService.revokeVerification(userId);
      
      if (response.success) {
        setVerificationState(prev => ({
          ...prev,
          isVerified: false,
          verifiedBy: null,
          verificationDate: null,
          verifiedFields: [],
          confidence: 0,
          isLoading: false,
          error: null
        }));
      } else {
        setError(response.error || 'Failed to revoke verification');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [setLoading, setError]);

  const clearError = useCallback(() => {
    setVerificationState(prev => ({ ...prev, error: null }));
  }, []);

  const resetVerification = useCallback(() => {
    setVerificationState(initialVerificationState);
  }, []);

  return {
    verificationState,
    verifyWithDigiLocker,
    verifyWithPAN,
    verifyWithBank,
    verifyWithDocument,
    getVerificationStatus,
    revokeVerification,
    clearError,
    resetVerification
  };
};
