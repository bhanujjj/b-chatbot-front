import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import Widget from './pages/Widget';
import { CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E5A4B3',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/widget" element={<Widget />} />
          <Route path="/" element={
            <>
              <AppBar position="static" sx={{ backgroundColor: '#E5A4B3' }}>
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Beauty Product Advisor
                  </Typography>
                </Toolbar>
              </AppBar>
              <ChatInterface />
            </>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
