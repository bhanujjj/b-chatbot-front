import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidget } from './ChatWidget';

// Function to initialize the widget
function init(containerId: string = 'beauty-chat-widget') {
  // Create container if it doesn't exist
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Create root and render widget
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget />
    </React.StrictMode>
  );
}

// Export the widget module
const BeautyChatWidget = {
  init
};

export default BeautyChatWidget;

// Also expose it on window for direct script tag usage
declare global {
  interface Window {
    BeautyChatWidget?: {
      init: typeof init;
    };
  }
}

window.BeautyChatWidget = {
  init: init
}; 