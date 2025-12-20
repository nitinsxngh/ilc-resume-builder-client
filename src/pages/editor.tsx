'use client';

import type { NextPage } from 'next';
import Head from 'next/head';
import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';

import { Resume } from 'src/core/containers/Resume';
import { Sidebar } from 'src/core/containers/Sidebar';
import { LeftNav } from 'src/core/containers/LeftNav';
import { AIChat } from '../components/AIChat';

import { FlexHC } from 'src/styles/styles';
import ProtectedRoute from '../components/ProtectedRoute';

// Blockchain loader animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Loader container
const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.5s ease-out;
`;

// Main loader content
const LoaderContent = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out 0.3s both;
`;

// Blockchain logo loader
const BlockchainLogo = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  position: relative;
  animation: ${float} 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(164, 124, 56, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
    z-index: 3;
  }

  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
    border-radius: 50%;
    animation: ${rotate} 4s linear infinite;
    z-index: 1;
  }
`;

const LogoImage = styled.img`
  width: 60px;
  height: 60px;
  position: relative;
  z-index: 2;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
`;

// Loading text
const LoadingText = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoadingSubtext = styled.p`
  color: #a0a0a0;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 400px;
  line-height: 1.6;
`;

// Progress bar
const ProgressContainer = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #a47c38, #c49c58, #a47c38);
  background-size: 200% 100%;
  border-radius: 2px;
  width: ${props => props.progress}%;
  animation: ${shimmer} 2s ease-in-out infinite;
  transition: width 0.3s ease;
`;

// Loading steps
const LoadingSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  animation: ${fadeIn} 1s ease-out 0.6s both;
  align-items: center;
  text-align: center;
`;

const LoadingStep = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.completed ? '#a47c38' : props.active ? '#ffffff' : '#666'};
  font-size: 0.9rem;
  transition: all 0.3s ease;

  .step-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.completed ? '#a47c38' : props.active ? '#a47c38' : '#333'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
    animation: ${props => props.active ? pulse : 'none'} 1.5s ease-in-out infinite;
  }
`;

// Blockchain particles
const BlockchainParticle = styled.div<{ delay: number; duration: number; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(164, 124, 56, 0.2);
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
`;

//
// 🎯 Static Dot Grid Background
//
const BackgroundGrid = styled.div`
  position: fixed;
  inset: 0;
  z-index: -10;
  background-color: #f9f9f9;
  background-image: radial-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 0);
  background-size: 20px 20px;
`;

//
// 📦 Light Static Border (like Figma editor frame)
//
const StaticBorder = styled.div`
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: -5;
  border: 2px solid rgba(90, 158, 255, 0.15);
  box-sizing: border-box;
`;



//
// 🧱 Main Editor Page
//
const Editor: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    'Initializing blockchain network...',
    'Loading resume templates...',
    'Setting up secure environment...',
    'Ready to build your resume!'
  ];

  useEffect(() => {
    // Simulate loading process
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Update loading steps based on progress
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <LoaderContainer>
        {/* Background particles */}
        <BlockchainParticle delay={0} duration={4} size={8} style={{ top: '20%', left: '15%' }} />
        <BlockchainParticle delay={2} duration={6} size={12} style={{ top: '30%', right: '20%' }} />
        <BlockchainParticle delay={4} duration={5} size={10} style={{ bottom: '25%', left: '25%' }} />
        <BlockchainParticle delay={1} duration={7} size={6} style={{ bottom: '35%', right: '15%' }} />
        
        <LoaderContent>
          <BlockchainLogo>
            <LogoImage src="https://www.ilc.limited/logo.svg" alt="ILC Logo" />
          </BlockchainLogo>
          <LoadingText>Building Your Blockchain Resume</LoadingText>
          <LoadingSubtext>
            Connecting to the ILC network and preparing your secure resume builder environment
          </LoadingSubtext>
          
          <ProgressContainer>
            <ProgressBar progress={progress} />
          </ProgressContainer>
          
          <LoadingSteps>
            {loadingSteps.map((step, index) => (
              <LoadingStep 
                key={index}
                active={index === currentStep}
                completed={index < currentStep}
              >
                <div className="step-icon">
                  {index < currentStep ? '✓' : index === currentStep ? '●' : '○'}
                </div>
                {step}
              </LoadingStep>
            ))}
          </LoadingSteps>
        </LoaderContent>
      </LoaderContainer>
    );
  }

  return (
    <ProtectedRoute>
      <FlexHC>
        <Head>
          <title>ILC Blockchain Resume Builder</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <BackgroundGrid />
        <StaticBorder />

        <LeftNav />
        <Resume />
        <AIChat />
        <Sidebar />


      </FlexHC>
    </ProtectedRoute>
  );
};

export default Editor;
