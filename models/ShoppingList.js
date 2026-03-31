const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  recipeIds: [{
    type: String,
    ref: 'Recipe.id'
  }],
  ingredients: [{
    name: String,
    total_amount: Number,
    unit: String,
    category: String
  }],
  guests: {
    type: Number,
    default: 2
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);

