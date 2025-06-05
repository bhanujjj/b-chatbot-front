const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Load and parse products data
const products = [
  {
    name: "Gentle Cleanser",
    type: "face wash",
    skin_type: "acne-prone",
    price: 27.89,
    image_url: "/product-images/gentle-cleanser.jpg",
    description: "A gentle cleanser perfect for acne-prone skin, helps control breakouts while maintaining skin's natural balance."
  },
  {
    name: "Exfoliating Face Wash",
    type: "face wash",
    skin_type: "acne-prone",
    price: 21.64,
    image_url: "/product-images/exfoliating-face-wash.jpg",
    description: "An exfoliating face wash that helps remove dead skin cells and unclog pores, ideal for acne-prone skin."
  },
  {
    name: "Foaming Face Wash",
    type: "face wash",
    skin_type: "acne-prone",
    price: 19.06,
    image_url: "/product-images/foaming-face-wash.jpg",
    description: "A foaming face wash that deeply cleanses while being gentle on sensitive, acne-prone skin."
  }
];

module.exports = async (req, res) => {
  // Enable CORS with proper origin
  const allowedOrigins = [
    'https://beauty-advisor-chatbot-e9h1.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;
    
    // Filter products based on message content
    let recommendedProducts = [];
    if (message.toLowerCase().includes('acne') || message.toLowerCase().includes('face wash')) {
      recommendedProducts = products.filter(p => p.type === 'face wash' && p.skin_type === 'acne-prone');
    }

    // If we have product recommendations, just return those without the chat response
    if (recommendedProducts.length > 0) {
      res.status(200).json({
        reply: "Here are some recommended products for you:",
        recommendations: recommendedProducts
      });
      return;
    }

    // If no product recommendations, proceed with normal chat
    const openRouterResponse = await axios.post(OPENROUTER_URL, {
      messages: [
        { role: "system", content: "You are a helpful beauty advisor." },
        { role: "user", content: message }
      ],
      model: "anthropic/claude-3-opus-20240229"
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': `${req.headers.origin || 'http://localhost:3000'}`
      }
    });

    res.status(200).json({
      reply: openRouterResponse.data.choices[0].message.content,
      recommendations: []
    });
  } catch (error) {
    console.error('Detailed error information:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    res.status(500).json({
      error: 'Failed to process chat request',
      details: error.message
    });
  }
}; 