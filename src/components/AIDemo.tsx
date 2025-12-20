import React, { useState } from 'react';
import styled from 'styled-components';
import { useAIResume } from '../hooks/useAIResume';

const DemoContainer = styled.div`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 350px;
  background: #1a1a1a;
  border-radius: 20px;
  padding: 20px;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(164, 124, 56, 0.3);
  z-index: 999;
`;

const Title = styled.h3`
  color: #a47c38;
  margin: 0 0 16px 0;
  text-align: center;
`;

const DemoButton = styled.button`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(164, 124, 56, 0.4);
  }

  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
  }
`;

const Status = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 8px 12px;
  margin: 8px 0;
  border-radius: 6px;
  font-size: 12px;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return 'background: rgba(76, 175, 80, 0.2); color: #4caf50; border: 1px solid rgba(76, 175, 80, 0.3);';
      case 'error':
        return 'background: rgba(244, 67, 54, 0.2); color: #f44336; border: 1px solid rgba(244, 67, 54, 0.3);';
      case 'info':
        return 'background: rgba(33, 150, 243, 0.2); color: #2196f3; border: 1px solid rgba(33, 150, 243, 0.3);';
    }
  }}
`;

const Info = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  line-height: 1.4;
`;

export const AIDemo: React.FC = () => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const {
    isLoading,
    error,
    generateSummary,
    generateSkills,
    getResumeAdvice,
    currentSummary,
    currentSkills
  } = useAIResume();

  const showStatus = (type: 'success' | 'error' | 'info', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 5000);
  };

  const handleGenerateSummary = async () => {
    try {
      await generateSummary('Software Developer', '3 years', ['JavaScript', 'React', 'Node.js']);
      showStatus('success', 'Professional summary generated and added to your resume!');
    } catch (err) {
      showStatus('error', 'Failed to generate summary. Please try again.');
    }
  };

  const handleGenerateSkills = async () => {
    try {
      const skills = await generateSkills('Software Developer', '3 years', 'technologies');
      showStatus('success', `Added ${skills.length} new skills to your resume!`);
    } catch (err) {
      showStatus('error', 'Failed to generate skills. Please try again.');
    }
  };

  const handleGetAdvice = async () => {
    try {
      const advice = await getResumeAdvice('writing professional summaries');
      showStatus('info', 'Resume advice received! Check the AI chat for details.');
    } catch (err) {
      showStatus('error', 'Failed to get resume advice. Please try again.');
    }
  };

  return (
    <DemoContainer>
      <Title>🤖 AI Demo</Title>
      
      <DemoButton onClick={handleGenerateSummary} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Professional Summary'}
      </DemoButton>
      
      <DemoButton onClick={handleGenerateSkills} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Suggest Skills'}
      </DemoButton>
      
      <DemoButton onClick={handleGetAdvice} disabled={isLoading}>
        {isLoading ? 'Getting...' : 'Get Resume Tips'}
      </DemoButton>

      {status && (
        <Status type={status.type}>
          {status.message}
        </Status>
      )}

      {error && (
        <Status type="error">
          Error: {error}
        </Status>
      )}

      <Info>
        <strong>Current Status:</strong><br />
        • Summary: {currentSummary ? '✅ Set' : '❌ Not set'}<br />
        • Skills: {Object.values(currentSkills).flat().length} total skills<br />
        • Use the AI Chat on the right for more features
      </Info>
    </DemoContainer>
  );
};
