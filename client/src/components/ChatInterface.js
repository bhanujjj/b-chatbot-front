import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Grid,
  Fab,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import CompareIcon from '@mui/icons-material/Compare';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EventNoteIcon from '@mui/icons-material/EventNote';
import axios from 'axios';
import ProductCard from './ProductCard';
import CompareModal from './CompareModal';
import SkincareQuestionnaire from './SkincareQuestionnaire';
import SkincareRoutine from './SkincareRoutine';
import SkinAnalysis from './SkinAnalysis';

const actions = [
  { icon: <EventNoteIcon />, name: 'Create Routine', key: 'routine' },
  { icon: <PhotoCameraIcon />, name: 'Analyze Skin', key: 'analysis' },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hello! I\'m your beauty product advisor. I can help you find the perfect products for your skin type and concerns. What would you like to know?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [compareProducts, setCompareProducts] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [routineOpen, setRoutineOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [skinRoutine, setSkinRoutine] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCompareToggle = (product) => {
    setCompareProducts(prev => {
      const exists = prev.some(p => p.name === product.name);
      if (exists) {
        return prev.filter(p => p.name !== product.name);
      } else if (prev.length < 3) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const handleQuestionnaireComplete = async (answers) => {
    try {
      const response = await axios.post('http://localhost:8000/api/create-routine', { answers });
      setSkinRoutine(response.data.routine);
      setRoutineOpen(true);
    } catch (error) {
      console.error('Error creating routine:', error);
    }
  };

  const handleAnalysisComplete = (results) => {
    const analysisMessage = {
      role: 'assistant',
      content: 'Based on your skin analysis, here are my observations and recommendations:',
      analysis: results
    };
    setMessages(prev => [...prev, analysisMessage]);
  };

  const handleSpeedDialAction = (action) => {
    switch (action) {
      case 'routine':
        setQuestionnaireOpen(true);
        break;
      case 'analysis':
        setAnalysisOpen(true);
        break;
      default:
        break;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        message: input,
        chatHistory: messages
      });

      if (response.data) {
        const assistantMessage = {
          role: 'assistant',
          content: response.data.reply,
          recommendations: response.data.recommendations || []
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 3 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1, 
            mb: 2, 
            p: 2, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100'
                }}
              >
                <Typography>{message.content}</Typography>
                {message.recommendations && message.recommendations.length > 0 && (
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {message.recommendations.map((product, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <ProductCard 
                          product={product}
                          onCompareToggle={handleCompareToggle}
                          isCompared={compareProducts.some(p => p.name === product.name)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {message.analysis && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Analysis Results:</Typography>
                    {Object.entries(message.analysis).map(([key, value]) => (
                      <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                        • {key.charAt(0).toUpperCase() + key.slice(1)}: {
                          key === 'acne' 
                            ? `${value.severity} (${value.location})`
                            : Array.isArray(value) 
                              ? value.join(', ') 
                              : typeof value === 'object'
                                ? JSON.stringify(value)
                                : String(value)
                        }
                      </Typography>
                    ))}
                  </Box>
                )}
                {message.analysis?.recommendations?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Recommended Products:</Typography>
                    {message.analysis.recommendations.map((rec, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">{rec.type} for {rec.severity} Acne:</Typography>
                        <ul style={{ margin: 0 }}>
                          {rec.suggestions.map((suggestion, i) => (
                            <li key={i}>
                              <Typography variant="body2">{suggestion}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Paper>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Box>

        <SpeedDial
          ariaLabel="SpeedDial"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.key}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleSpeedDialAction(action.key)}
            />
          ))}
        </SpeedDial>

        {compareProducts.length > 0 && (
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 16, right: 96 }}
            onClick={() => setCompareModalOpen(true)}
          >
            <CompareIcon />
          </Fab>
        )}

        <CompareModal
          open={compareModalOpen}
          onClose={() => setCompareModalOpen(false)}
          products={compareProducts}
        />

        <SkincareQuestionnaire
          open={questionnaireOpen}
          onClose={() => setQuestionnaireOpen(false)}
          onComplete={handleQuestionnaireComplete}
        />

        <SkincareRoutine
          open={routineOpen}
          onClose={() => setRoutineOpen(false)}
          routine={skinRoutine}
          onCompareToggle={handleCompareToggle}
          comparedProducts={compareProducts}
        />

        <SkinAnalysis
          open={analysisOpen}
          onClose={() => setAnalysisOpen(false)}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </Box>
    </Container>
  );
};

export default ChatInterface; 