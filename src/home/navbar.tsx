import type { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  position: absolute;
  width: 90%;
  z-index: 1000;
  padding: 0.5rem 2rem;
  max-width: 1200px;
  left: 50%;
  transform: translateX(-50%);

  @media (min-width: 768px) {
    position: static;
    width: 100%;
    padding: 1rem 4rem;
    max-width: 1400px;
    margin: 0 auto;
    left: auto;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    width: 95%;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    
    .highlight {
      background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
`;

const RightItemsContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 2rem;

  .nav-item {
    color: #a0a0a0;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      color: #ffffff;
      background: rgba(164, 124, 56, 0.1);
    }

    &.active {
      color: #a47c38;
      background: rgba(164, 124, 56, 0.1);
    }
  }

  .cta-button {
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(164, 124, 56, 0.3);
    }
  }
`;

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthButton = styled(Link)`
  color: #a0a0a0;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(164, 124, 56, 0.3);

  &:hover {
    color: #a47c38;
    background: rgba(164, 124, 56, 0.1);
    border-color: #a47c38;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .user-email {
    color: #a0a0a0;
    font-size: 0.9rem;
  }
  
  .logout-button {
    background: rgba(164, 124, 56, 0.1);
    border: 1px solid rgba(164, 124, 56, 0.3);
    color: #a47c38;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      background: rgba(164, 124, 56, 0.2);
      border-color: #a47c38;
    }
  }
`;

const NavBar: NextPage = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Nav>
      <Link href="/">
        <LogoContainer>
          <img src="https://www.ilc.limited/logo.svg" alt="ILC Logo" height="40" width="40" />
          <div className="logo-text">
            ILC <span className="highlight">Blockchain</span>
          </div>
        </LogoContainer>
      </Link>
      
      <RightItemsContainer>
        <a href="#templates" className="nav-item">Templates</a>
        <a href="#features" className="nav-item">Features</a>
        <a href="#about" className="nav-item">About</a>
        
        {currentUser ? (
          <UserMenu>
            <span className="user-email">{currentUser.email}</span>
            <Link href="/dashboard">
              <div className="nav-item">Dashboard</div>
            </Link>
            <Link href="/editor">
              <div className="cta-button">Launch Builder</div>
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </UserMenu>
        ) : (
          <AuthContainer>
            <AuthButton href="/login">Sign In</AuthButton>
            <Link href="/register">
              <div className="cta-button">Get Started</div>
            </Link>
          </AuthContainer>
        )}
      </RightItemsContainer>
    </Nav>
  );
};

export default NavBar;