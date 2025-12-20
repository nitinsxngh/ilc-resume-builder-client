'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  padding: 2rem;
`;

const BackgroundGrid = styled.div`
  position: fixed;
  inset: 0;
  background-image: radial-gradient(rgba(164, 124, 56, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
  z-index: 1;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: #a47c38;
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: #888;
    font-size: 1.2rem;
    margin: 0;
  }
`;

const UserInfo = styled.div`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(164, 124, 56, 0.3);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  
  .user-avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    font-size: 2rem;
    color: white;
    font-weight: 700;
  }
  
  .user-email {
    color: #f0f0f0;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  .user-status {
    color: #51cf66;
    font-size: 0.9rem;
    background: rgba(81, 207, 102, 0.1);
    border: 1px solid rgba(81, 207, 102, 0.3);
    border-radius: 20px;
    padding: 0.25rem 1rem;
    display: inline-block;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const DashboardCard = styled.div`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(164, 124, 56, 0.3);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #a47c38;
    box-shadow: 0 20px 40px rgba(164, 124, 56, 0.2);
  }
  
  h3 {
    color: #a47c38;
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: #888;
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
  }
  
  .card-actions {
    display: flex;
    gap: 1rem;
  }
`;

const Button = styled(Link)<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'secondary' ? `
    background: transparent;
    border: 1px solid rgba(164, 124, 56, 0.5);
    color: #a47c38;
    
    &:hover {
      background: rgba(164, 124, 56, 0.1);
      border-color: #a47c38;
    }
  ` : `
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(164, 124, 56, 0.3);
    }
  `}
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(164, 124, 56, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #a47c38;
    transform: translateY(-2px);
  }
  
  .stat-number {
    color: #a47c38;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }
  
  .stat-label {
    color: #888;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - ILC Blockchain Resume Builder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container>
        <BackgroundGrid />
        
        <Content>
          <Header>
            <h1>Welcome Back!</h1>
            <p>Manage your blockchain-powered resumes and professional credentials</p>
          </Header>
          
          <UserInfo>
            <div className="user-avatar">
              {getUserInitials(currentUser?.email || '')}
            </div>
            <div className="user-email">{currentUser?.email}</div>
            <div className="user-status">✓ Verified Account</div>
          </UserInfo>
          
          <StatsGrid>
            <StatCard>
              <div className="stat-number">3</div>
              <div className="stat-label">Active Resumes</div>
            </StatCard>
            <StatCard>
              <div className="stat-number">12</div>
              <div className="stat-label">Templates Used</div>
            </StatCard>
            <StatCard>
              <div className="stat-number">5</div>
              <div className="stat-label">Downloads</div>
            </StatCard>
            <StatCard>
              <div className="stat-number">100%</div>
              <div className="stat-label">Blockchain Verified</div>
            </StatCard>
          </StatsGrid>
          
          <DashboardGrid>
            <DashboardCard>
              <h3>
                🚀 Resume Builder
              </h3>
              <p>
                Create and edit your professional resume using our blockchain-powered builder. 
                Choose from multiple templates and customize every section.
              </p>
              <div className="card-actions">
                <Button href="/editor">Launch Builder</Button>
                <Button href="/templates" variant="secondary">View Templates</Button>
              </div>
            </DashboardCard>
            
            <DashboardCard>
              <h3>
                📊 Analytics
              </h3>
              <p>
                Track your resume performance, view download statistics, and monitor 
                blockchain verification status for your credentials.
              </p>
              <div className="card-actions">
                <Button href="/analytics">View Analytics</Button>
                <Button href="/reports" variant="secondary">Download Reports</Button>
              </div>
            </DashboardCard>
            
            <DashboardCard>
              <h3>
                🔐 Security
              </h3>
              <p>
                Manage your account security, enable two-factor authentication, 
                and review blockchain verification logs for your credentials.
              </p>
              <div className="card-actions">
                <Button href="/security">Security Settings</Button>
                <Button href="/verification" variant="secondary">Verification Logs</Button>
              </div>
            </DashboardCard>
            
            <DashboardCard>
              <h3>
                💼 Portfolio
              </h3>
              <p>
                Showcase your professional achievements, certifications, and 
                blockchain-verified credentials in your digital portfolio.
              </p>
              <div className="card-actions">
                <Button href="/portfolio">View Portfolio</Button>
                <Button href="/customize" variant="secondary">Customize</Button>
              </div>
            </DashboardCard>
          </DashboardGrid>
        </Content>
      </Container>
    </ProtectedRoute>
  );
};

export default Dashboard;
