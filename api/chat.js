const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, chatHistory } = req.body;
    console.log('Received request:', { message, chatHistoryLength: chatHistory?.length });

    // Format chat history
    const formattedHistory = Array.isArray(chatHistory) 
      ? chatHistory.map(msg => ({
          role: msg.role || 'user',
          content: msg.content || ''
        }))
      : [];

    // Make request to OpenRouter directly
    const response = await axios.post(process.env.OPENROUTER_API_URL, {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        ...formattedHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('OpenRouter response received');

    res.status(200).json({
      reply: response.data.choices[0].message.content,
      recommendations: []
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
}; 