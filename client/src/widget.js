import React from 'react';
import { createRoot } from 'react-dom/client';
import BeautyChatbotWidget from './components/BeautyChatbotWidget';

class BeautyChatbot {
  constructor() {
    this.config = {};
  }

  init(config) {
    this.config = {
      ...this.config,
      ...config
    };

    // Create container if it doesn't exist
    let container = document.getElementById('beauty-chatbot-widget');
    if (!container) {
      container = document.createElement('div');
      container.id = 'beauty-chatbot-widget';
      document.body.appendChild(container);
    }

    // Render the widget
    const root = createRoot(container);
    root.render(<BeautyChatbotWidget config={this.config} />);
  }

  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    };
    this.init(this.config);
  }
}

// Expose the widget globally
window.BeautyChatbot = new BeautyChatbot(); 