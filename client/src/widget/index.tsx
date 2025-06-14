import React from 'react';
import ReactDOM from 'react-dom';
import { ChatWidget } from './ChatWidget';

// Create widget container
const widgetContainer = document.createElement('div');
widgetContainer.id = 'beauty-advisor-widget';
document.body.appendChild(widgetContainer);

// Get configuration from script tag
const script = document.currentScript as HTMLScriptElement;
const config: Record<string, string | undefined> = {};

// Only add non-null values to config
const attrs = [
  'apiUrl',
  'primaryColor',
  'position',
  'welcomeMessage',
  'widgetTitle',
  'companyLogo'
] as const;

attrs.forEach(attr => {
  const value = script.getAttribute(`data-${attr.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`);
  if (value !== null) {
    config[attr] = value;
  }
});

// Render widget
ReactDOM.render(
  <React.StrictMode>
    <ChatWidget {...config} />
  </React.StrictMode>,
  widgetContainer
); 