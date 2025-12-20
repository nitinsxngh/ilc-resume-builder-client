import type { NextPage } from 'next';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { Shield, Zap, Globe, Rocket } from 'lucide-react';

// Floating animation for particles
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
`;

// Gradient movement animation
const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Pulse animation for glow effects
const pulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

// Rotate animation for geometric shapes
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const HeroContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(-45deg, #0a0a0a, #1a1a1a, #0f0f0f, #151515, #0a0a0a);
  background-size: 400% 400%;
  animation: ${gradientMove} 15s ease infinite;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(164, 124, 56, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(164, 124, 56, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(164, 124, 56, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 60% 60%, rgba(164, 124, 56, 0.08) 0%, transparent 50%);
    pointer-events: none;
    animation: ${pulse} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 0%, rgba(164, 124, 56, 0.03) 50%, transparent 100%),
      linear-gradient(0deg, transparent 0%, rgba(164, 124, 56, 0.03) 50%, transparent 100%);
    animation: ${gradientMove} 12s ease-in-out infinite;
    pointer-events: none;
  }
`;

const GridBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: transparent;
  background-image: 
    linear-gradient(rgba(164, 124, 56, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(164, 124, 56, 0.08) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.8;
  animation: ${gradientMove} 25s linear infinite;
`;

// Enhanced floating particles with better visibility
const FloatingParticle = styled.div<{ delay: number; duration: number; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle, rgba(164, 124, 56, 0.3) 0%, rgba(164, 124, 56, 0.1) 70%, transparent 100%);
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 1;
  box-shadow: 0 0 20px rgba(164, 124, 56, 0.2);
`;

// Enhanced geometric shapes with better visibility
const GeometricShape = styled.div<{ delay: number; duration: number; size: number; rotation: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 3px solid rgba(164, 124, 56, 0.2);
  border-radius: 8px;
  animation: ${rotate} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 1;
  box-shadow: 0 0 30px rgba(164, 124, 56, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 1px solid rgba(164, 124, 56, 0.1);
    border-radius: 10px;
    animation: ${pulse} ${props => props.duration * 0.5}s ease-in-out infinite;
  }
`;

// Enhanced glowing orb effect
const GlowingOrb = styled.div<{ delay: number; duration: number; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle, rgba(164, 124, 56, 0.4) 0%, rgba(164, 124, 56, 0.1) 50%, transparent 100%);
  border-radius: 50%;
  animation: ${pulse} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 1;
  filter: blur(2px);
  box-shadow: 
    0 0 40px rgba(164, 124, 56, 0.3),
    0 0 80px rgba(164, 124, 56, 0.1);
`;

// New animated lines effect
const AnimatedLine = styled.div<{ delay: number; duration: number; width: number; height: number }>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: linear-gradient(90deg, transparent, rgba(164, 124, 56, 0.2), transparent);
  animation: ${gradientMove} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 1;
  border-radius: 2px;
`;

// New floating dots effect
const FloatingDot = styled.div<{ delay: number; duration: number; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(164, 124, 56, 0.4);
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 1;
  box-shadow: 0 0 15px rgba(164, 124, 56, 0.3);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(164, 124, 56, 0.1);
  border: 1px solid rgba(164, 124, 56, 0.3);
  border-radius: 50px;
  color: #a47c38;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  animation: ${pulse} 3s ease-in-out infinite;
`;

const MainTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  
  .highlight {
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${gradientMove} 8s ease infinite;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  color: #a0a0a0;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(164, 124, 56, 0.3);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(164, 124, 56, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BlockchainFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
  max-width: 1000px;
  width: 100%;
  justify-items: center;
`;

const FeatureCard = styled.div`
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(164, 124, 56, 0.1);
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #a47c38, #c49c58, #a47c38);
    background-size: 200% 100%;
    animation: ${gradientMove} 3s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(164, 124, 56, 0.3);
    background: rgba(255, 255, 255, 0.05);
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 120px;
    margin: 0 auto 1.5rem;
    background: rgba(164, 124, 56, 0.1);
    border-radius: 20px;
    color: #a47c38;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(164, 124, 56, 0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s;
    }

    &:hover::before {
      transform: translateX(100%);
    }
  }

  &:hover .icon {
    background: rgba(164, 124, 56, 0.2);
    transform: scale(1.1);
  }

  h3 {
    color: #ffffff;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    color: #a0a0a0;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }
`;

const Hero: NextPage = () => {
  return (
    <HeroContainer>
      <GridBackground />
      
      {/* Animated floating particles */}
      <FloatingParticle delay={0} duration={6} size={8} style={{ top: '20%', left: '15%' }} />
      <FloatingParticle delay={2} duration={8} size={12} style={{ top: '30%', right: '20%' }} />
      <FloatingParticle delay={4} duration={7} size={6} style={{ bottom: '25%', left: '25%' }} />
      <FloatingParticle delay={1} duration={9} size={10} style={{ bottom: '35%', right: '15%' }} />
      
      {/* Animated geometric shapes */}
      <GeometricShape delay={0} duration={20} size={40} rotation={0} style={{ top: '15%', right: '10%' }} />
      <GeometricShape delay={5} duration={25} size={30} rotation={45} style={{ bottom: '20%', left: '10%' }} />
      
      {/* Glowing orbs */}
      <GlowingOrb delay={0} duration={4} size={60} style={{ top: '40%', left: '5%' }} />
      <GlowingOrb delay={2} duration={6} size={80} style={{ bottom: '15%', right: '5%' }} />
      
      {/* New animated lines */}
      <AnimatedLine delay={0} duration={10} width={100} height={1} style={{ top: '50%', left: '20%' }} />
      <AnimatedLine delay={3} duration={12} width={150} height={1} style={{ bottom: '40%', right: '20%' }} />
      <AnimatedLine delay={1} duration={15} width={200} height={1} style={{ top: '70%', left: '50%' }} />
      <AnimatedLine delay={4} duration={10} width={120} height={1} style={{ bottom: '60%', right: '50%' }} />

      {/* New floating dots */}
      <FloatingDot delay={0} duration={5} size={10} style={{ top: '10%', left: '70%' }} />
      <FloatingDot delay={2} duration={6} size={15} style={{ bottom: '20%', right: '80%' }} />
      <FloatingDot delay={1} duration={7} size={12} style={{ top: '30%', left: '90%' }} />
      <FloatingDot delay={3} duration={8} size={10} style={{ bottom: '40%', right: '95%' }} />
      
      <ContentWrapper>
        <Badge>
          <Globe size={16} />
          Blockchain-Powered • Decentralized • Secure
        </Badge>
        
        <MainTitle>
          Build Your <span className="highlight">Blockchain Resume</span><br />
          on the ILC Network
        </MainTitle>
        
        <Subtitle>
          Create, verify, and store your professional credentials on the blockchain. 
          Immutable, tamper-proof resumes that you truly own and control.
        </Subtitle>
        
        <Link href="/editor">
          <CTAButton>
            <Rocket size={20} />
            Launch Resume Builder
          </CTAButton>
        </Link>

        <BlockchainFeatures>
          <FeatureCard>
            <div className="icon">
              <Shield size={90} />
            </div>
            <h3>Immutable Records</h3>
            <p>Your resume data is stored on the blockchain, ensuring it can never be altered or deleted without your permission.</p>
          </FeatureCard>
          
          <FeatureCard>
            <div className="icon">
              <Zap size={90} />
            </div>
            <h3>Instant Verification</h3>
            <p>Employers can instantly verify your credentials through blockchain verification, eliminating the need for background checks.</p>
          </FeatureCard>
          
          <FeatureCard>
            <div className="icon">
              <Globe size={90} />
            </div>
            <h3>Decentralized Storage</h3>
            <p>Your data is distributed across the ILC network, ensuring high availability and resistance to censorship.</p>
          </FeatureCard>
        </BlockchainFeatures>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default Hero;
