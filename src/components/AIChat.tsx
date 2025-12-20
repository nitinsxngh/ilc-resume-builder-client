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

  @media print {
    display: none !important;
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

const QuickAction = styled.button<{ isOptimize?: boolean }>`
  padding: 8px 16px;
  background: ${props => props.isOptimize 
    ? 'linear-gradient(135deg, #a47c38 0%, #c49c58 100%)' 
    : 'rgba(164, 124, 56, 0.1)'};
  border: 1px solid ${props => props.isOptimize 
    ? 'transparent' 
    : 'rgba(164, 124, 56, 0.3)'};
  border-radius: 20px;
  color: ${props => props.isOptimize ? 'white' : '#a47c38'};
  font-size: 12px;
  font-weight: ${props => props.isOptimize ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.isOptimize 
    ? '0 4px 15px rgba(164, 124, 56, 0.3)' 
    : 'none'};

  &:hover {
    background: ${props => props.isOptimize 
      ? 'linear-gradient(135deg, #c49c58 0%, #a47c38 100%)' 
      : 'rgba(164, 124, 56, 0.2)'};
    border-color: ${props => props.isOptimize 
      ? 'transparent' 
      : 'rgba(164, 124, 56, 0.5)'};
    transform: ${props => props.isOptimize ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isOptimize 
      ? '0 6px 20px rgba(164, 124, 56, 0.4)' 
      : 'none'};
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

  @media print {
    display: none !important;
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
  '🚀 Optimize my entire resume',
  'My name is Alex',
  'I\'m a passionate developer...',
  'I know React',
  'Add Python to my skills',
  'I\'m a Software Engineer',
  'I have 5 years experience',
  'Help me improve my summary',
  'Generate a professional summary',
  'Show me my resume'
];

export const AIChat: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '👋 Hi there! I\'m your AI resume assistant, and I\'m here to help you create an amazing resume!\n\nI can help you with:\n\n✨ **Building your resume** - Just tell me about yourself!\n🎯 **Improving content** - I\'ll make your text more impactful\n🚀 **Adding skills** - I know what recruiters are looking for\n💡 **Resume tips** - I\'ve got insider knowledge to share\n\n**Try saying things like:**\n• "My name is Sarah"\n• "I\'m a Software Engineer"\n• "I know React and Python"\n• "Help me improve my summary"\n\nOr click one of the quick actions below to get started! 🎉',
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
    updateFormField,
    getCurrentContext,
    addWorkExperience,
    addNewSkill,
    optimizeResume,
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
      
      // Check if it's a form field update command first
      const lowerMessage = messageText.toLowerCase();
      const isFormUpdate = lowerMessage.includes('change') || 
                          lowerMessage.includes('update') || 
                          lowerMessage.includes('set') ||
                          lowerMessage.includes('add') ||
                          lowerMessage.includes('phone') ||
                          lowerMessage.includes('email') ||
                          lowerMessage.includes('location') ||
                          lowerMessage.includes('summary') ||
                          lowerMessage.includes('about me') ||
                          lowerMessage.includes('objective') ||
                          lowerMessage.includes('career objective') ||
                          lowerMessage.includes('technical expertise') ||
                          lowerMessage.includes('skills exposure') ||
                          lowerMessage.includes('methodology approach') ||
                          lowerMessage.includes('tools') ||
                          lowerMessage.includes('skill') ||
                          lowerMessage.includes('role') ||
                          lowerMessage.includes('title') ||
                          lowerMessage.includes('position') ||
                          lowerMessage.includes('relevant experience') ||
                          lowerMessage.includes('total experience') ||
                          lowerMessage.includes('experience') ||
                          lowerMessage.includes('involvement') ||
                          lowerMessage.includes('achievement') ||
                          lowerMessage.includes('name') ||
                          // Check for simple name mentions (single word that could be a name)
                          (messageText.trim().split(' ').length === 1 && /^[A-Za-z]+$/.test(messageText.trim()));
      
      if (isFormUpdate) {
        response = await updateFormField(messageText);
      } else if (messageText.toLowerCase().includes('improve') && messageText.toLowerCase().includes('summary')) {
        if (currentSummary) {
          response = await improveText(currentSummary, 'summary', 'summary');
          response = '✅ Great! I\'ve improved your summary and updated it in your resume. The new version uses stronger action verbs and more impactful language.';
        } else {
          response = 'I\'d be happy to help improve your summary! First, could you add a summary to your resume? You can do this by saying something like "My summary is [your summary text]" or by using the form fields.';
        }
      } else if (messageText.toLowerCase().includes('improve') && messageText.toLowerCase().includes('about me')) {
        if (currentSummary) {
          response = await improveText(currentSummary, 'about me section', 'summary');
          response = '✅ Perfect! I\'ve enhanced your about me section with more professional language and stronger impact statements.';
        } else {
          response = 'I\'d love to help improve your about me section! Could you first add some content? You can say something like "My about me is [your text]" and I\'ll make it shine!';
        }
      } else if (messageText.toLowerCase().includes('optimize') && messageText.toLowerCase().includes('about me')) {
        if (currentSummary) {
          response = await improveText(currentSummary, 'about me section', 'summary');
          response = '✅ Excellent! I\'ve optimized your about me section to be more ATS-friendly and impactful.';
        } else {
          response = 'I\'d be happy to optimize your about me section! First, please add some content by saying something like "My about me is [your text]".';
        }
      } else if (messageText.toLowerCase().includes('suggest') && messageText.toLowerCase().includes('skill')) {
        const skills = await generateSkills('Software Developer', '3 years of experience', 'technologies');
        response = `🎯 Great! I've added ${skills.length} relevant skills to your resume. These are based on current industry trends and should help make your resume more competitive. Check out the Skills section to see them!`;
      } else if (messageText.toLowerCase().includes('write') && messageText.toLowerCase().includes('achievement')) {
        if (currentExperience.length > 0) {
          const achievements = await generateAchievements('Software Developer', 'Project development', 0);
          response = `🚀 Fantastic! I've crafted ${achievements.length} compelling achievement statements for your work experience. These highlight your impact and results - exactly what recruiters love to see!`;
        } else {
          response = 'I\'d love to help you write some impressive achievements! First, could you add some work experience to your resume? You can say something like "I worked at [Company] as [Role] doing [Description]".';
        }
      } else if (messageText.toLowerCase().includes('resume tip')) {
        response = await getResumeAdvice('general resume best practices');
      } else if (messageText.toLowerCase().includes('auto fill') || messageText.toLowerCase().includes('autofill')) {
        const result = await autoFillResume('Software Developer', 3, ['Web Application Development', 'API Integration']);
        response = result.message;
      } else if (messageText.toLowerCase().includes('optimize') || messageText.toLowerCase().includes('optimization') || messageText.toLowerCase().includes('optimize resume')) {
        const result = await optimizeResume(messageText);
        response = `${result.message}\n\n📊 **Optimization Summary:**\n• Summary: ${result.details.summaryUpdated ? '✅ Updated' : '❌ Not updated'}\n• Skills: ${result.details.skillsAdded} added\n• Achievements: ${result.details.achievementsAdded} added\n• Involvements: ${result.details.involvementsAdded} added\n• Objective: ${result.details.objectiveUpdated ? '✅ Updated' : '❌ Not updated'}\n• Role: ${result.details.labelUpdated ? '✅ Updated' : '❌ Not updated'}\n\nYour resume is now optimized and ready to impress recruiters! 🚀`;
      } else if (messageText.toLowerCase().includes('generate summary')) {
        const summary = await generateSummary('Software Developer', '3 years of experience', ['JavaScript', 'React', 'Node.js']);
        response = '✨ Perfect! I\'ve created a compelling professional summary that highlights your key strengths and experience. This will grab recruiters\' attention right from the start!';
      } else if (messageText.toLowerCase().includes('show current context') || messageText.toLowerCase().includes('current context')) {
        const context = getCurrentContext();
        response = `📄 **Here's your current resume overview:**\n\n• **Name:** ${context.name}\n• **Email:** ${context.email}\n• **Phone:** ${context.phone}\n• **Location:** ${context.location}\n• **Summary:** ${context.summary}\n• **Skills:** ${context.skills || 'None'}\n• **Experience:** ${context.experience} positions\n• **Education:** ${context.education} degrees\n\n💡 **Quick tip:** You can update any field by simply telling me! For example:\n• "My name is Sarah"\n• "I'm a Senior Developer"\n• "Add React to my skills"\n• "I live in San Francisco"`;
      } else if (messageText.toLowerCase().includes('add experience') || messageText.toLowerCase().includes('add work experience')) {
        response = 'I\'d be happy to help you add work experience! Please tell me:\n\n• Company name\n• Your role/title\n• What you did there\n\nFor example: "I worked at Google as a Software Engineer developing web applications and leading a team of 5 developers."';
      } else if (messageText.toLowerCase().includes('add skill') || messageText.toLowerCase().includes('add new skill')) {
        // Parse skill addition command
        const skillMatch = messageText.match(/add\s+(?:new\s+)?skill\s+(\w+)\s+to\s+(\w+)/i);
        if (skillMatch) {
          const skillName = skillMatch[1];
          const skillType = skillMatch[2];
          response = await addNewSkill(skillName, skillType);
        } else {
          // Try to extract skill name from simpler patterns
          const simpleSkillMatch = messageText.match(/add\s+(?:skill\s+)?(\w+)/i);
          if (simpleSkillMatch) {
            const skillName = simpleSkillMatch[1];
            response = await addNewSkill(skillName, 'technologies'); // Default to technologies
          } else {
            response = 'I\'d love to add a skill for you! You can say something like:\n\n• "Add React to frameworks"\n• "I know Python" (I\'ll categorize it automatically)\n• "Add JavaScript to languages"\n\nWhat skill would you like to add?';
          }
        }
      } else {
        // Build conversation history for context
        const recentMessages = messages.slice(-6).map(msg => 
          `${msg.isUser ? 'User' : 'AI'}: ${msg.text}`
        );
        response = await customPrompt(messageText, recentMessages);
      }

      addMessage(response, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Provide more helpful error messages based on the error type
      let friendlyErrorMessage = '';
      if (errorMessage.includes('Rate limit')) {
        friendlyErrorMessage = '⏰ Oops! I\'m getting a bit too many requests right now. Please wait a moment and try again. I\'ll be ready to help you in just a bit!';
      } else if (errorMessage.includes('API authentication')) {
        friendlyErrorMessage = '🔧 It looks like there\'s a configuration issue with my AI service. Please check your API settings, but I\'m still here to help with basic resume guidance!';
      } else if (errorMessage.includes('Server error')) {
        friendlyErrorMessage = '🛠️ I\'m experiencing some technical difficulties right now. Please try again in a few moments, or feel free to ask me something else!';
      } else if (errorMessage.includes('Empty response')) {
        friendlyErrorMessage = '🤔 I didn\'t quite understand that. Could you try rephrasing your question? I\'m here to help with resume building, skills, summaries, and more!';
      } else {
        friendlyErrorMessage = `😅 Oops! Something went wrong: ${errorMessage}\n\nDon\'t worry though - I\'m still here to help! Try asking me about resume tips, or tell me what you\'d like to update in your resume.`;
      }
      
      addMessage(friendlyErrorMessage, false);
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
        AI Assistant
      </ToggleButton>
    );
  }

  if (!isExpanded) {
    return (
      <ChatContainer style={{ height: '120px' }}>
        <ChatHeader>
          <AIIcon>AI</AIIcon>
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
            Expand AI Chat
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
        <AIIcon>AI</AIIcon>
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
            <QuickAction 
              key={index} 
              onClick={() => handleQuickAction(action)}
              isOptimize={action.includes('🚀 Optimize')}
            >
              {action}
            </QuickAction>
          ))}
        </QuickActions>

        {messages.map((message) => (
          <Message key={message.id} isUser={message.isUser}>
            <Avatar isUser={message.isUser}>
              {message.isUser ? 'U' : 'AI'}
            </Avatar>
            <MessageBubble isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          </Message>
        ))}

        {isLoading && (
          <Message isUser={false}>
            <Avatar isUser={false}>AI</Avatar>
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
