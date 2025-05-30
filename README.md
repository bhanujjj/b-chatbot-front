# Beauty Advisor Chatbot

An intelligent chatbot system that provides personalized skincare product recommendations based on user preferences and concerns.

## Features

- Interactive chat interface for skincare consultations
- Personalized product recommendations
- Skin type analysis
- Product comparison functionality
- Embeddable widget for third-party websites

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- AI Service: Python with FastAPI
- Database: CSV-based product catalog

## Project Structure

```
beauty-chatbot/
├── client/               # React frontend
├── server/              # Node.js backend
│   └── ai_service/      # Python AI service
└── products.csv         # Product database
```

## Prerequisites

- Node.js v16+
- Python 3.8+
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bhanujjj/beauty-advisor-chatbot.git
   cd beauty-advisor-chatbot
   ```

2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../server
   npm install
   ```

4. Install AI service dependencies:
   ```bash
   cd ai_service
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the AI service (from ai_service directory):
   ```bash
   uvicorn main:app --port 8002 --reload
   ```

2. Start the Node.js server (from server directory):
   ```bash
   node index.js
   ```

3. Start the React frontend (from client directory):
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- AI Service: http://localhost:8002

## Widget Integration

To embed the chatbot in your website, add the following code:

```html
<script src="path/to/widget.bundle.js"></script>
<script>
  window.BeautyChatbot.init({
    apiKey: 'YOUR_API_KEY',
    position: 'bottom-right',
    theme: {
      primaryColor: '#ff69b4',
      fontFamily: 'Arial, sans-serif'
    }
  });
</script>
```

## License

MIT License

## Author

Bhanuj Bhalla 