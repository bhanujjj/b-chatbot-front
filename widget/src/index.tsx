import React from 'react';
import ReactDOM from 'react-dom';
import { ChatWidget } from './ChatWidget';

// Create widget container
const widgetContainer = document.createElement('div');
widgetContainer.id = 'beauty-advisor-widget';
document.body.appendChild(widgetContainer);

// Get configuration from script tag
const script = document.currentScript as HTMLScriptElement;
const config = {
  apiUrl: script.getAttribute('data-api-url'),
  primaryColor: script.getAttribute('data-primary-color'),
  position: script.getAttribute('data-position'),
  welcomeMessage: script.getAttribute('data-welcome-message'),
  widgetTitle: script.getAttribute('data-widget-title'),
  companyLogo: script.getAttribute('data-company-logo'),
};

// Filter out null values
const filteredConfig = Object.fromEntries(
  Object.entries(config).filter(([_, value]) => value !== null)
) as Partial<Parameters<typeof ChatWidget>[0]>;

// Render widget
ReactDOM.render(
  <React.StrictMode>
    <ChatWidget {...filteredConfig} />
  </React.StrictMode>,
  widgetContainer
); 