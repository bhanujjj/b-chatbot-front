import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface ChatWidgetProps {
  apiUrl?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  welcomeMessage?: string;
  widgetTitle?: string;
  companyLogo?: string;
}

const defaultProps = {
  apiUrl: 'https://beauty-chatbot-ai-p1fp.onrender.com',
  primaryColor: '#FF69B4',
  position: 'bottom-right',
  welcomeMessage: 'Hello! 👋 I\'m your beauty advisor. How can I help you today?',
  widgetTitle: 'Beauty Advisor',
  companyLogo: '',
};

const Widget = styled.div<{ isOpen: boolean; position: string }>`
  position: fixed;
  ${props => props.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
  bottom: 20px;
  z-index: 999999;
`;

const ChatButton = styled.button<{ primaryColor: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.primaryColor};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 30px;
    height: 30px;
    fill: white;
  }
`;

const ChatWindow = styled.div<{ isOpen: boolean; primaryColor: string }>`
  position: fixed;
  ${props => props.isOpen ? 'display: flex;' : 'display: none;'}
  flex-direction: column;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  bottom: 100px;
  right: 20px;
`;

const ChatHeader = styled.div<{ primaryColor: string }>`
  background-color: ${props => props.primaryColor};
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div<{ isUser: boolean; primaryColor: string }>`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  ${props => props.isUser ? `
    background-color: ${props.primaryColor};
    color: white;
    align-self: flex-end;
  ` : `
    background-color: #f0f0f0;
    color: black;
    align-self: flex-start;
  `}
`;

const InputArea = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;

  &:focus {
    border-color: ${props => props.color};
  }
`;

const SendButton = styled.button<{ primaryColor: string }>`
  background-color: ${props => props.primaryColor};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = (userProps) => {
  const props = { ...defaultProps, ...userProps };
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: props.welcomeMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${props.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          chatHistory: messages,
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Widget isOpen={isOpen} position={props.position}>
      <ChatButton
        primaryColor={props.primaryColor}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        )}
      </ChatButton>

      <ChatWindow isOpen={isOpen} primaryColor={props.primaryColor}>
        <ChatHeader primaryColor={props.primaryColor}>
          {props.companyLogo && <img src={props.companyLogo} alt="Company Logo" />}
          <span>{props.widgetTitle}</span>
        </ChatHeader>

        <ChatMessages>
          {messages.map((message, index) => (
            <Message
              key={index}
              isUser={message.role === 'user'}
              primaryColor={props.primaryColor}
            >
              {message.content}
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </ChatMessages>

        <InputArea>
          <Input
            color={props.primaryColor}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <SendButton
            primaryColor={props.primaryColor}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </SendButton>
        </InputArea>
      </ChatWindow>
    </Widget>
  );
}; 