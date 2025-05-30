require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const routineRoutes = require('./routes/routineRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure CORS with more permissive settings
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Add headers for image requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Chat endpoint that uses Python AI service
app.post('/api/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    
    console.log('Received request:', {
      message,
      chatHistoryLength: chatHistory?.length
    });

    // Format chat history to match Python service expectations
    const formattedHistory = Array.isArray(chatHistory) 
      ? chatHistory.map(msg => ({
          role: msg.role || 'user',
          content: msg.content || ''
        }))
      : [];

    console.log('Calling Python service with:', {
      message,
      formattedHistoryLength: formattedHistory.length
    });

    // Call Python AI service with properly formatted request
    const response = await axios.post('http://localhost:8002/chat', {
      message: message || '',  // Ensure message is never undefined
      chatHistory: formattedHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    console.log('Python service response:', {
      hasReply: !!response.data.reply,
      recommendationsCount: response.data.recommendations?.length,
      recommendations: response.data.recommendations // Log full recommendations
    });

    if (!response.data || !response.data.reply) {
      throw new Error('Invalid response from Python service');
    }

    // Log the exact data being sent to frontend
    console.log('Sending to frontend:', {
      recommendations: response.data.recommendations || []
    });

    res.json({ 
      reply: response.data.reply,
      recommendations: response.data.recommendations || []
    });
  } catch (error) {
    console.error('Chat API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.response?.data || error.message
    });
  }
});

// New routes
app.use('/api', routineRoutes);
app.use('/api', analysisRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 