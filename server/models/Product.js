const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }],
  skinType: {
    type: String,
    enum: ['all', 'dry', 'oily', 'combination', 'sensitive'],
    default: 'all',
  },
  ingredients: [{
    type: String,
  }],
});

module.exports = mongoose.model('Product', productSchema); 