require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const PYTHON_API = process.env.PYTHON_API || 'https://beauty-chatbot-ai-p1fp.onrender.com';

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.VERCEL_URL, 'https://beauty-chatbot-frontend.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// API Routes
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'middleware-ok' });
});

// Proxy requests to Python service
app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API}/chat`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding request to Python backend:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
});

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Chat endpoint: http://localhost:${PORT}/api/chat`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app; 