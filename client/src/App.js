import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import ChatInterface from './components/ChatInterface';
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
      <AppBar position="static" sx={{ backgroundColor: '#E5A4B3' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Beauty Product Advisor
          </Typography>
        </Toolbar>
      </AppBar>
      <ChatInterface />
    </ThemeProvider>
  );
}

export default App;
