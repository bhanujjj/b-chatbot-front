import React, { useState, useEffect } from 'react';
import './ProductCard.css';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const ProductCard = ({ product, onCompareToggle, isCompared }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const placeholderImage = 'https://via.placeholder.com/200?text=Product+Image';
  
  useEffect(() => {
    if (product?.image_url) {
      // Check if the image_url is a complete base64 string
      if (product.image_url.startsWith('data:image')) {
        if (!product.image_url.includes('base64,') || product.image_url.length < 100) {
          console.error('Invalid or truncated base64 string');
          setImageUrl(placeholderImage);
          setImageError(true);
          return;
        }
        setImageUrl(product.image_url);
        setImageError(false);
      } else {
        setImageUrl(product.image_url);
        setImageError(false);
      }
    } else {
      setImageUrl(placeholderImage);
      setImageError(true);
    }
  }, [product]);

  if (!product) {
    console.log('No product data received');
    return null;
  }

  const handleImageError = (error) => {
    console.error('Image error in CardMedia:', error);
    setImageUrl(placeholderImage);
    setImageError(true);
  };

  console.log('Rendering product:', {
    name: product.name,
    imageUrl: imageUrl,
    hasError: imageError
  });

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={imageError ? 'https://via.placeholder.com/200' : imageUrl}
        alt={product.name}
        onError={handleImageError}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        loading="lazy"
        sx={{ 
          objectFit: 'contain',
          backgroundColor: '#f5f5f5'
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          Price $ {product.price ? product.price.toFixed(2) : '0.00'} USD
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" color="primary">
            Order now
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CompareArrowsIcon />}
                checkedIcon={<CompareArrowsIcon color="primary" />}
                checked={isCompared || false}
                onChange={() => onCompareToggle && onCompareToggle(product)}
              />
            }
            label="Compare"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 