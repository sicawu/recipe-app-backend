const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: String,
  difficulty: String,
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  imageUrl: String,
  tags: [{
    type: String
  }],
  description: String,
  ingredients: [{
    name: String,
    amount: Number,
    unit: String
  }],
  instructions: [String],
  tip: String,
  dressing: [{
    name: String,
    amount: Number,
    unit: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);

