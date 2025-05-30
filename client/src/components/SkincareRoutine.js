import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import ProductCard from './ProductCard';

const RoutineStep = ({ step, products, onCompareToggle, comparedProducts }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        {step.name}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {step.description}
      </Typography>
      {products && products.length > 0 && (
        <Grid container spacing={2}>
          {products.map((product, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <ProductCard
                product={product}
                onCompareToggle={onCompareToggle}
                isCompared={comparedProducts.some(p => p.name === product.name)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </AccordionDetails>
  </Accordion>
);

const SkincareRoutine = ({ open, onClose, routine, onCompareToggle, comparedProducts }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Your Personalized Skincare Routine</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WbSunnyIcon color="warning" />
            Morning Routine
          </Typography>
          {routine?.morning?.map((step, index) => (
            <RoutineStep
              key={index}
              step={step}
              products={step.products}
              onCompareToggle={onCompareToggle}
              comparedProducts={comparedProducts}
            />
          ))}
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <NightsStayIcon color="primary" />
            Evening Routine
          </Typography>
          {routine?.evening?.map((step, index) => (
            <RoutineStep
              key={index}
              step={step}
              products={step.products}
              onCompareToggle={onCompareToggle}
              comparedProducts={comparedProducts}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SkincareRoutine; 