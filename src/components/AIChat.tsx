import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAIResume } from '../hooks/useAIResume';

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// Styled Components
const ChatContainer = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  max-width: 90vw;
  height: 500px;
  background: #1a1a1a;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  animation: ${slideIn} 0.3s ease-out;
  border: 1px solid rgba(164, 124, 56, 0.3);
  
  @media (max-width: 768px) {
    width: 95vw;
    height: 400px;
    bottom: 20px;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
  color: white;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
`;

const AIIcon = styled.div`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const HeaderText = styled.div`
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    opacity: 0.9;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #2a2a2a;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #a47c38;
    border-radius: 3px;
  }
`;

const Message = styled.div<{ isUser: boolean }>`
  display: flex;
  gap: 12px;
  animation: ${fadeIn} 0.3s ease-out;
  
  ${props => props.isUser ? `
    flex-direction: row-reverse;
  ` : ''}
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 280px;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    color: white;
    border-bottom-right-radius: 6px;
  ` : `
    background: #2a2a2a;
    color: #e0e0e0;
    border-bottom-left-radius: 6px;
  `}
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  
  ${props => props.isUser ? `
    background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
    color: white;
  ` : `
    background: #333;
    color: #a47c38;
  `}
`;

const ChatInput = styled.div`
  padding: 20px;
  border-top: 1px solid #333;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 25px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: #888;
  }

  &:focus {
    border-color: #a47c38;
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.disabled ? '#444' : 'linear-gradient(135deg, #a47c38 0%, #c49c58 100%)'};
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 16px;

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const QuickAction = styled.button`
  padding: 8px 16px;
  background: rgba(164, 124, 56, 0.1);
  border: 1px solid rgba(164, 124, 56, 0.3);
  border-radius: 20px;
  color: #a47c38;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(164, 124, 56, 0.2);
    border-color: rgba(164, 124, 56, 0.5);
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Dot = styled.div<{ delay: number }>`
  width: 6px;
  height: 6px;
  background: #a47c38;
  border-radius: 50%;
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(164, 124, 56, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  white-space: nowrap;

  &:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 12px 35px rgba(164, 124, 56, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 14px;
    bottom: 20px;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-left: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ExpandButton = styled.button`
  background: linear-gradient(135deg, #a47c38 0%, #c49c58 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(164, 124, 56, 0.3);
  transition: all 0.3s ease;
  animation: ${bounce} 2s ease-in-out infinite;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 35px rgba(164, 124, 56, 0.4);
  }
`;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickActions = [
  'Generate Summary',
  'Suggest Skills',
  'Write Achievements',
  'Resume Tips',
  'Auto Fill Resume'
];

export const AIChat: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI resume assistant. I can help you improve your resume, suggest skills, write achievements, and provide professional advice. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // AI Resume hook
  const {
    isLoading,
    error,
    generateSummary,
    improveText,
    generateSkills,
    generateAchievements,
    getResumeAdvice,
    autoFillResume,
    customPrompt,
    currentSummary,
    currentSkills,
    currentExperience
  } = useAIResume();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickAction = async (action: string) => {
    setInputText(action);
    await handleSend(action);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim() || isLoading) return;

    addMessage(messageText, true);
    setInputText('');

    try {
      let response = '';
      
      if (messageText.toLowerCase().includes('improve') && messageText.toLowerCase().includes('summary')) {
        if (currentSummary) {
          response = await improveText(currentSummary, 'summary', 'summary');
          response = '✅ Summary improved and updated in your resume!';
        } else {
          response = 'Please add a summary first, then I can help improve it.';
        }
      } else if (messageText.toLowerCase().includes('suggest') && messageText.toLowerCase().includes('skill')) {
        const skills = await generateSkills('Software Developer', '3 years of experience', 'technologies');
        response = `✅ Added ${skills.length} new skills to your resume! Check the Skills section.`;
      } else if (messageText.toLowerCase().includes('write') && messageText.toLowerCase().includes('achievement')) {
        if (currentExperience.length > 0) {
          const achievements = await generateAchievements('Software Developer', 'Project development', 0);
          response = `✅ Added ${achievements.length} achievement statements to your first work experience entry!`;
        } else {
          response = 'Please add some work experience first, then I can help write achievements.';
        }
      } else if (messageText.toLowerCase().includes('resume tip')) {
        response = await getResumeAdvice('general resume best practices');
      } else if (messageText.toLowerCase().includes('auto fill') || messageText.toLowerCase().includes('autofill')) {
        const result = await autoFillResume('Software Developer', 3, ['Web Application Development', 'API Integration']);
        response = result.message;
      } else if (messageText.toLowerCase().includes('generate summary')) {
        const summary = await generateSummary('Software Developer', '3 years of experience', ['JavaScript', 'React', 'Node.js']);
        response = '✅ Professional summary generated and added to your resume!';
      } else {
        response = await customPrompt(messageText);
      }

      addMessage(response, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      addMessage(`❌ ${errorMessage}`, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isVisible) {
    return (
      <ToggleButton onClick={() => setIsVisible(true)}>
        🤖 AI Assistant
      </ToggleButton>
    );
  }

  if (!isExpanded) {
    return (
      <ChatContainer style={{ height: '120px' }}>
        <ChatHeader>
          <AIIcon>🤖</AIIcon>
          <HeaderText>
            <h3>AI Resume Assistant</h3>
            <p>Click to expand</p>
          </HeaderText>
          <CloseButton onClick={() => setIsVisible(false)}>×</CloseButton>
        </ChatHeader>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'calc(100% - 120px)',
          padding: '20px',
          background: 'rgba(164, 124, 56, 0.05)',
          borderRadius: '0 0 20px 20px',
          borderTop: '1px solid rgba(164, 124, 56, 0.1)'
        }}>
          <ExpandButton onClick={() => setIsExpanded(true)}>
            🚀 Expand AI Chat
          </ExpandButton>
          <div style={{
            textAlign: 'center',
            marginTop: '12px',
            fontSize: '12px',
            color: '#a47c38',
            fontWeight: '500'
          }}>
            Click to access AI-powered resume assistance
          </div>
        </div>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <AIIcon>🤖</AIIcon>
        <HeaderText>
          <h3>AI Resume Assistant</h3>
          <p>Powered by Gemini AI</p>
        </HeaderText>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsExpanded(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            −
          </button>
          <CloseButton onClick={() => setIsVisible(false)}>×</CloseButton>
        </div>
      </ChatHeader>

      <ChatBody>
        {error && (
          <Message isUser={false}>
            <Avatar isUser={false}>⚠️</Avatar>
            <MessageBubble isUser={false} style={{ background: '#ff4444', color: 'white' }}>
              {error}
            </MessageBubble>
          </Message>
        )}
        
        <QuickActions>
          {quickActions.map((action, index) => (
            <QuickAction key={index} onClick={() => handleQuickAction(action)}>
              {action}
            </QuickAction>
          ))}
        </QuickActions>

        {messages.map((message) => (
          <Message key={message.id} isUser={message.isUser}>
            <Avatar isUser={message.isUser}>
              {message.isUser ? '👤' : '🤖'}
            </Avatar>
            <MessageBubble isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          </Message>
        ))}

        {isLoading && (
          <Message isUser={false}>
            <Avatar isUser={false}>🤖</Avatar>
            <MessageBubble isUser={false}>
              <LoadingDots>
                <Dot delay={0} />
                <Dot delay={0.2} />
                <Dot delay={0.4} />
              </LoadingDots>
            </MessageBubble>
          </Message>
        )}

        <div ref={messagesEndRef} />
      </ChatBody>

      <ChatInput>
        <InputContainer>
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your resume..."
            disabled={isLoading}
          />
          <SendButton 
            onClick={() => handleSend()} 
            disabled={isLoading || !inputText.trim()}
          >
            ➤
          </SendButton>
        </InputContainer>
      </ChatInput>
    </ChatContainer>
  );
};
