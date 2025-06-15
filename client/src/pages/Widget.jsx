import React from 'react';
import ChatInterface from '../components/ChatInterface';

export default function Widget() {
  return (
    <div style={{ height: '100vh', backgroundColor: '#fff' }}>
      <ChatInterface minimalMode={true} />
    </div>
  );
} 