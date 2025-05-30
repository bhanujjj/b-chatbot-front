import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CompareIcon from '@mui/icons-material/Compare';

const SkinAnalysis = ({ open, onClose, onAnalysisComplete }) => {
  const [images, setImages] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef();

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      date: new Date().toISOString(),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleClear = () => {
    // Revoke object URLs to prevent memory leaks
    images.forEach(image => URL.revokeObjectURL(image.url));
    setImages([]);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    
    setAnalyzing(true);
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image.file);
      });

      const response = await fetch('http://localhost:8000/api/analyze-skin', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const processedResults = data.overall || data;
      setResults(processedResults);
      onAnalysisComplete(processedResults);
    } catch (error) {
      console.error('Error analyzing images:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCompareImages = () => {
    // Implement image comparison logic
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Skin Analysis</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Upload photos of your skin to get a detailed analysis and track your progress over time.
          </Typography>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <Button
            variant="contained"
            startIcon={<PhotoCameraIcon />}
            onClick={() => fileInputRef.current.click()}
            sx={{ mr: 2 }}
          >
            Upload Photos
          </Button>
          {(images.length > 0 || results) && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
              sx={{ mr: 2 }}
            >
              Clear All
            </Button>
          )}
          {images.length >= 2 && (
            <Button
              variant="outlined"
              startIcon={<CompareIcon />}
              onClick={handleCompareImages}
            >
              Compare Photos
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={2} sx={{ p: 1 }}>
                <img
                  src={image.url}
                  alt={`Skin analysis ${index + 1}`}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 4,
                  }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {new Date(image.date).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {results && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Analysis Results</Typography>
            <Grid container spacing={2}>
              {Object.entries(results).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>{key}</Typography>
                    <Typography variant="body2">
                      {key === 'acne' 
                        ? `${value.severity} (${value.location})`
                        : Array.isArray(value) 
                          ? value.join(', ') 
                          : typeof value === 'object'
                            ? JSON.stringify(value)
                            : String(value)
                      }
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={images.length === 0 || analyzing}
        >
          {analyzing ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SkinAnalysis; 