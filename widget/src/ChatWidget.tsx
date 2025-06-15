import * as React from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: Arial, sans-serif;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #E5A4B3;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
  font-size: 24px;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background-color: #E5A4B3;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

interface MessageProps {
  $isUser: boolean;
  $isError?: boolean;
}

const Message = styled.div<MessageProps>`
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 15px;
  max-width: 80%;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  background-color: ${props => 
    props.$isError ? '#ffebee' : 
    props.$isUser ? '#E5A4B3' : '#f1f1f1'
  };
  color: ${props => 
    props.$isError ? '#c62828' : 
    props.$isUser ? 'white' : 'black'
  };
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #E5A4B3;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 20px;
  background-color: ${props => props.disabled ? '#ccc' : '#E5A4B3'};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #d48a99;
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
  color: #666;
  font-style: italic;
`;

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([{
    text: "Hello! I'm your beauty product advisor. I can help you find the perfect products for your skin type and concerns. What would you like to know?",
    isUser: false
  }]);
  const [inputText, setInputText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: Message = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 30000);

      const response = await fetch('https://beauty-chatbot-ai-p1fp.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText }),
        signal: abortControllerRef.current.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      if (!('response' in data) || typeof data.response !== 'string' || !data.response.trim()) {
        console.error('Invalid server response:', data);
        throw new Error('Invalid or empty response from server');
      }

      const botMessage: Message = { text: data.response.trim(), isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = "Sorry, there was an error processing your request. Please try again later.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Sorry, the request timed out. Please try again.";
        } else if (error.message.includes('status: 429')) {
          errorMessage = "Too many requests. Please wait a moment before trying again.";
        } else if (error.message.includes('Invalid response') || error.message.includes('Invalid or empty response')) {
          errorMessage = "Sorry, received an invalid response. Please try again.";
        }
      }

      setMessages(prev => [...prev, { text: errorMessage, isUser: false, isError: true }]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <WidgetContainer>
      {!isOpen ? (
        <ChatButton onClick={() => setIsOpen(true)}>
          💬
        </ChatButton>
      ) : (
        <ChatWindow>
          <ChatHeader>
            <div>Beauty Advisor</div>
            <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
          </ChatHeader>
          
          <ChatMessages>
            {messages.map((msg, idx) => (
              <Message key={idx} $isUser={msg.isUser} $isError={msg.isError}>
                {msg.text}
              </Message>
            ))}
            {isLoading && (
              <LoadingIndicator>Thinking...</LoadingIndicator>
            )}
            <div ref={messagesEndRef} />
          </ChatMessages>

          <form onSubmit={handleSubmit}>
            <ChatInput>
              <Input
                type="text"
                value={inputText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <SendButton type="submit" disabled={isLoading}>
                Send
              </SendButton>
            </ChatInput>
          </form>
        </ChatWindow>
      )}
    </WidgetContainer>
  );
}; 