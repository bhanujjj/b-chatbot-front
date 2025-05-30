import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  position: fixed;
  ${props => props.position === 'bottom-right' ? 'bottom: 20px; right: 20px;' : ''}
  ${props => props.position === 'bottom-left' ? 'bottom: 20px; left: 20px;' : ''}
  ${props => props.position === 'top-right' ? 'top: 20px; right: 20px;' : ''}
  ${props => props.position === 'top-left' ? 'top: 20px; left: 20px;' : ''}
  z-index: 1000;
  font-family: ${props => props.theme.fontFamily || 'Arial, sans-serif'};
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme.primaryColor || '#007bff'};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;

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
  background-color: ${props => props.theme.primaryColor || '#007bff'};
  color: white;
  font-weight: bold;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.primaryColor || '#007bff'};
  }
`;

const SendButton = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.theme.primaryColor || '#007bff'};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 15px;
  max-width: 80%;
  ${props => props.isUser ? `
    background-color: ${props.theme.primaryColor || '#007bff'};
    color: white;
    margin-left: auto;
  ` : `
    background-color: #f1f1f1;
    margin-right: auto;
  `}
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  gap: 10px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const BeautyChatbotWidget = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

    try {
      const response = await fetch(`${config.apiUrl || 'http://localhost:8000'}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, isUser: false }]);
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again.', isUser: false }]);
    }
  };

  return (
    <WidgetContainer position={config.position || 'bottom-right'} theme={config.theme || {}}>
      <ChatButton 
        onClick={() => setIsOpen(!isOpen)} 
        theme={config.theme || {}}
      >
        {isOpen ? '×' : '💬'}
      </ChatButton>

      {isOpen && (
        <ChatWindow>
          <ChatHeader theme={config.theme || {}}>
            {config.title || 'Beauty Advisor'}
          </ChatHeader>
          
          <ChatMessages>
            {messages.map((message, index) => (
              <Message key={index} isUser={message.isUser} theme={config.theme || {}}>
                {message.text}
              </Message>
            ))}
            {recommendations.map((product, index) => (
              <ProductCard key={index}>
                <ProductImage src={product.image_url} alt={product.name} />
                <ProductInfo>
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p>${product.price}</p>
                </ProductInfo>
              </ProductCard>
            ))}
            <div ref={messagesEndRef} />
          </ChatMessages>

          <ChatInput>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              theme={config.theme || {}}
            />
            <SendButton onClick={handleSend} theme={config.theme || {}}>
              Send
            </SendButton>
          </ChatInput>
        </ChatWindow>
      )}
    </WidgetContainer>
  );
};

export default BeautyChatbotWidget; 