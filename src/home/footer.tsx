import type { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import { Globe, Shield, Zap, Mail, Github, Linkedin } from 'lucide-react';

const FooterContainer = styled.footer`
  background: #0a0a0a;
  border-top: 1px solid rgba(164, 124, 56, 0.2);
  padding: 4rem 2rem 2rem;
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
      radial-gradient(circle at 20% 80%, rgba(164, 124, 56, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(164, 124, 56, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
`;

const FooterSection = styled.div`
  h3 {
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
      color: #a47c38;
    }
  }

  p {
    color: #a0a0a0;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: #a0a0a0;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 1.05rem;

    &:hover {
      color: #a47c38;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(164, 124, 56, 0.1);
    border: 1px solid rgba(164, 124, 56, 0.2);
    border-radius: 8px;
    color: #a47c38;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(164, 124, 56, 0.2);
      transform: translateY(-2px);
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(164, 124, 56, 0.1);
  padding-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 1.1rem;

  .highlight {
    color: #a47c38;
    font-weight: 500;
  }
`;

const Footer: NextPage = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>
              <Globe className="icon" size={20} />
              ILC Blockchain
            </h3>
            <p>
              Building the future of professional credential management with blockchain technology. 
              Secure, verifiable, and truly owned by you.
            </p>
            <SocialLinks>
              <a href="mailto:info@ilc.limited" title="Email">
                <Mail size={18} />
              </a>
              <a href="https://github.com/ilc-limited" target="_blank" rel="noopener noreferrer" title="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com/company/ilc-limited" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <Linkedin size={18} />
              </a>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>
              <Shield className="icon" size={20} />
              Features
            </h3>
            <ul>
              <li><a href="#blockchain">Blockchain Integration</a></li>
              <li><a href="#verification">Instant Verification</a></li>
              <li><a href="#security">Privacy & Security</a></li>
              <li><a href="#templates">Professional Templates</a></li>
              <li><a href="#updates">Real-time Updates</a></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>
              <Zap className="icon" size={20} />
              Quick Links
            </h3>
            <ul>
              <li><Link href="/editor">Resume Builder</Link></li>
              <li><a href="#templates">Templates</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Contact Info</h3>
            <p>
              Ready to build your blockchain resume? 
              Get started today and join the future of professional credentials.
            </p>
            <Link href="/editor">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #a47c38 0%, #c49c58 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <Zap size={16} />
                Get Started
              </div>
            </Link>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <p>
            © 2024 <span className="highlight">ILC Blockchain</span>. All rights reserved. 
            Built with blockchain technology for a decentralized future.
          </p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
