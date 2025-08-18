import type { NextPage } from 'next';
import styled from 'styled-components';
import { 
  Link, 
  CheckCircle, 
  Shield, 
  Palette, 
  Zap, 
  Globe,
  Lock,
  FileText,
  Database,
  Network,
  Eye,
  Clock
} from 'lucide-react';

const FeaturesContainer = styled.div`
  padding: 6rem 2rem;
  background: #0f0f0f;
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
      radial-gradient(circle at 10% 90%, rgba(164, 124, 56, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 10%, rgba(164, 124, 56, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #a0a0a0;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const FeatureCard = styled.div`
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(164, 124, 56, 0.1);
  border-radius: 20px;
  text-align: center;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
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
    animation: shimmer 3s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(164, 124, 56, 0.3);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: rgba(164, 124, 56, 0.1);
    border-radius: 20px;
    color: #a47c38;
    transition: all 0.3s ease;
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
    margin-bottom: 1.5rem;
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .tech-tag {
    padding: 0.25rem 0.75rem;
    background: rgba(164, 124, 56, 0.1);
    border: 1px solid rgba(164, 124, 56, 0.2);
    border-radius: 20px;
    color: #a47c38;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const BlockchainStats = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  margin-top: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  min-width: 150px;

  .number {
    font-size: 3rem;
    font-weight: 700;
    color: #a47c38;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .label {
    color: #a0a0a0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }
`;

const Features: NextPage = () => {
  return (
    <FeaturesContainer>
      <SectionHeader>
        <h2>Why Choose ILC Blockchain Resume Builder?</h2>
        <p>
          Experience the future of professional credential management with blockchain technology. 
          Build resumes that are secure, verifiable, and truly yours.
        </p>
      </SectionHeader>

      <FeaturesGrid>
        <FeatureCard>
          <div className="icon">
            <Link size={40} />
          </div>
          <h3>Blockchain Integration</h3>
          <p>
            Your resume data is stored on the ILC blockchain network, ensuring complete ownership 
            and control over your professional information.
          </p>
          <div className="tech-stack">
            <span className="tech-tag">ILC Network</span>
            <span className="tech-tag">Smart Contracts</span>
            <span className="tech-tag">IPFS</span>
          </div>
        </FeatureCard>

        <FeatureCard>
          <div className="icon">
            <CheckCircle size={40} />
          </div>
          <h3>Instant Verification</h3>
          <p>
            Employers can verify your credentials instantly through blockchain verification, 
            eliminating the need for time-consuming background checks and reference calls.
          </p>
          <div className="tech-stack">
            <span className="tech-tag">Zero-Knowledge Proofs</span>
            <span className="tech-tag">Digital Signatures</span>
            <span className="tech-tag">Verification APIs</span>
          </div>
        </FeatureCard>

        <FeatureCard>
          <div className="icon">
            <Shield size={40} />
          </div>
          <h3>Privacy & Security</h3>
          <p>
            Advanced encryption and privacy-preserving technologies ensure your data remains 
            secure while maintaining verifiability and authenticity.
          </p>
          <div className="tech-stack">
            <span className="tech-tag">End-to-End Encryption</span>
            <span className="tech-tag">Privacy Controls</span>
            <span className="tech-tag">Secure Sharing</span>
          </div>
        </FeatureCard>

        <FeatureCard>
          <div className="icon">
            <Palette size={40} />
          </div>
          <h3>Professional Templates</h3>
          <p>
            Choose from multiple professionally designed templates that automatically adapt 
            to your blockchain-verified data and industry requirements.
          </p>
          <div className="tech-stack">
            <span className="tech-tag">Responsive Design</span>
            <span className="tech-tag">Custom Themes</span>
            <span className="tech-tag">Export Options</span>
          </div>
        </FeatureCard>

        <FeatureCard>
          <div className="icon">
            <Zap size={40} />
          </div>
          <h3>Real-time Updates</h3>
          <p>
            Update your resume in real-time with instant blockchain synchronization. 
            Changes are immediately reflected and verifiable across the network.
          </p>
          <div className="tech-stack">
            <span className="tech-tag">Live Updates</span>
            <span className="tech-tag">Version Control</span>
            <span className="tech-tag">Change History</span>
          </div>
        </FeatureCard>

        <FeatureCard>
          <div className="icon">
            <Globe size={40} />
          </div>
          <h3>Global Accessibility</h3>
          <p>
            Access your blockchain resume from anywhere in the world. 
            Decentralized storage ensures your data is always available and secure.
          </p>
          <div className="tech-stack">
            <span className="tech-tag">24/7 Access</span>
            <span className="tech-tag">Cross-Platform</span>
            <span className="tech-tag">Offline Support</span>
          </div>
        </FeatureCard>
      </FeaturesGrid>

      <BlockchainStats>
        <StatCard>
          <div className="number">100%</div>
          <div className="label">Data Ownership</div>
        </StatCard>
        <StatCard>
          <div className="number">0</div>
          <div className="label">Downtime</div>
        </StatCard>
        <StatCard>
          <div className="number">∞</div>
          <div className="label">Storage</div>
        </StatCard>
        <StatCard>
          <div className="number">
            <Zap size={32} style={{ color: '#a47c38' }} />
          </div>
          <div className="label">Instant Verification</div>
        </StatCard>
      </BlockchainStats>
    </FeaturesContainer>
  );
};

export default Features;
