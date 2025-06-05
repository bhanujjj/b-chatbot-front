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
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  
  useEffect(() => {
    if (product?.image_url) {
      // For external URLs, use them directly
      setImageUrl(product.image_url);
      setImageError(false);
    } else {
      setImageUrl(placeholderImage);
      setImageError(true);
    }
  }, [product]);

  if (!product) {
    console.log('No product data received');
    return null;
  }

  const handleImageError = () => {
    console.error('Image failed to load:', product.image_url);
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
        image={imageError ? placeholderImage : imageUrl}
        alt={product.name}
        onError={handleImageError}
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