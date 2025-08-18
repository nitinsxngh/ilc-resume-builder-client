'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box;
`;

const BackgroundGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(164, 124, 56, 0.08) 1px, transparent 0);
  background-size: 30px 30px;
  z-index: 1;
`;

const RegisterCard = styled.div`
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(164, 124, 56, 0.2);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  z-index: 10;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #a47c38;
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: #888;
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #f0f0f0;
  font-size: 0.85rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(164, 124, 56, 0.2);
  border-radius: 10px;
  color: #f0f0f0;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    outline: none;
    border-color: #a47c38;
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 2px rgba(164, 124, 56, 0.1);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.variant === 'secondary' ? `
    background: transparent;
    border: 1px solid rgba(164, 124, 56, 0.3);
    color: #a47c38;
    
    &:hover {
      background: rgba(164, 124, 56, 0.08);
      border-color: #a47c38;
    }
  ` : `
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(164, 124, 56, 0.25);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.25rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(164, 124, 56, 0.2);
  }
  
  span {
    padding: 0 0.75rem;
    color: #666;
    font-size: 0.8rem;
  }
`;

const Message = styled.div<{ type: 'error' | 'success' }>`
  color: ${props => props.type === 'error' ? '#ff6b6b' : '#51cf66'};
  background: ${props => props.type === 'error' ? 'rgba(255, 107, 107, 0.08)' : 'rgba(81, 207, 102, 0.08)'};
  border: 1px solid ${props => props.type === 'error' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(81, 207, 102, 0.2)'};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.85rem;
  text-align: center;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  
  p {
    color: #666;
    margin: 0;
    font-size: 0.85rem;
    
    a {
      color: #a47c38;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      setSuccess('Google registration successful! Redirecting...');
      setTimeout(() => {
        router.push('/editor');
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to register with Google');
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(password);

  return (
    <>
      <Head>
        <title>Register - ILC Blockchain Resume Builder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container>
        <BackgroundGrid />
        
        <RegisterCard>
          <Logo>
            <h1>ILC Resume Builder</h1>
            <p>Create your blockchain-powered resume</p>
          </Logo>
          
          <Form onSubmit={handleSubmit}>
            {error && <Message type="error">{error}</Message>}
            {success && <Message type="success">{success}</Message>}
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <Divider>
              <span>or</span>
            </Divider>
            
            <Button type="button" variant="secondary" onClick={handleGoogleRegister} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Creating Account...' : 'Continue with Google'}
            </Button>
          </Form>
          
          <Footer>
            <p>
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </Footer>
        </RegisterCard>
      </Container>
    </>
  );
};

export default Register;
