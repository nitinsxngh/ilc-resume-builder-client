import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTemplates, useZoom } from 'src/stores/settings.store';
import { useThemes } from 'src/stores/theme.store';
import { ThemeProvider } from 'styled-components';
import { resumeApiService } from 'src/services/resumeApi';

const ResumeContainer: any = styled.div`
  width: 210mm;
  height: 296mm;
  margin: auto;
  background-color: white;
  border: 1px solid ${(props) => props.theme.fontColor};
  margin: 6mm;
  transform-origin: top;
  transform: ${({ zoom }: any) => `scale(${1 + zoom})`};
  margin-bottom: ${({ zoom }: any) => {
    if (zoom < 0) return 260 * zoom;
    if (zoom > 0) return 320 * zoom;
    return 6;
  }}mm;

  @media print {
    border: none;
    overflow: inherit;
    margin: 0;
    transform: none;
  }
`;

export function Resume() {
  const Template = useTemplates((state: any) => state.template);
  const zoom = useZoom((state: any) => state.zoom);
  const theme = useThemes((state: any) => state.theme);
  const [verificationData, setVerificationData] = useState<any>(null);

  // Load verification data from backend on mount
  useEffect(() => {
    const loadVerificationData = async () => {
      try {
        const defaultResume = await resumeApiService.getDefaultResume();
        if (defaultResume && defaultResume._id && defaultResume.verification) {
          setVerificationData(defaultResume.verification);
          // Store in window for templates to access
          if (typeof window !== 'undefined') {
            (window as any).__verificationData__ = defaultResume.verification;
            // Dispatch custom event to notify templates
            window.dispatchEvent(new CustomEvent('verificationDataUpdated', { 
              detail: defaultResume.verification 
            }));
          }
        } else {
          // Clear verification data if not found
          if (typeof window !== 'undefined') {
            (window as any).__verificationData__ = null;
          }
        }
      } catch (error: any) {
        // Only log if it's not a network error (expected when backend is down)
        if (!error?.message?.includes('Failed to fetch') && !error?.message?.includes('NetworkError')) {
          console.error('Error loading verification data in Resume component:', error);
        }
        // Clear verification data on error
        if (typeof window !== 'undefined') {
          (window as any).__verificationData__ = null;
        }
      }
    };

    loadVerificationData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ResumeContainer className="resume" zoom={zoom}>
        <Template />
      </ResumeContainer>
    </ThemeProvider>
  );
}
