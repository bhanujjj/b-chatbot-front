import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CompareModal = ({ open, onClose, products }) => {
  if (!products || products.length === 0) return null;

  const compareAttributes = [
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', format: (value) => `$${value.toFixed(2)}` },
    { key: 'description', label: 'Description' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Compare Products</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Feature</TableCell>
              {products.map((product, index) => (
                <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {compareAttributes.map((attr) => (
              <TableRow key={attr.key}>
                <TableCell sx={{ fontWeight: 'bold' }}>{attr.label}</TableCell>
                {products.map((product, index) => (
                  <TableCell key={index}>
                    {attr.format ? attr.format(product[attr.key]) : product[attr.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default CompareModal; 