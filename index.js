const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const Recipe = require('./models/Recipe');
const ShoppingList = require('./models/ShoppingList');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/recipeapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed if empty (async)
async function seedDB() {
  try {
    const count = await Recipe.countDocuments();
    if (count === 0) {
      console.log('No recipes found. Seeding from seeds/recipes.json...');
      const seedData = JSON.parse(fs.readFileSync('./seeds/recipes.json', 'utf8'));
      
      for (const recipe of seedData) {
        await Recipe.findOrCreate({
          id: recipe.id
        }, recipe);
      }
      console.log(`Seeded ${seedData.length} recipes.`);
    } else {
      console.log(`Found ${count} recipes. Skipping seed.`);
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seedDB();

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Recipe API running on port 3001 🚀 MongoDB' });
});

// GET /recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /recipes/:id
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ id: req.params.id }).lean();
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /recipes
app.post('/recipes', async (req, res) => {
  try {
    const recipeData = req.body;
    const id = uuidv4();
    const recipe = new Recipe({ ...recipeData, id });
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /recipes/:id
app.put('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, upsert: true }
    ).lean();
    res.json({ message: 'Recipe updated', recipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /recipes/:id
app.delete('/recipes/:id', async (req, res) => {
  try {
    await Recipe.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SHOPPING LISTS ROUTES
// POST /shopping-lists
app.post('/shopping-lists', async (req, res) => {
  try {
    const shoppingList = new ShoppingList(req.body);
    const saved = await shoppingList.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /shopping-lists
app.get('/shopping-lists', async (req, res) => {
  try {
    const lists = await ShoppingList.find().sort({ createdAt: -1 }).lean();
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /shopping-lists/:id
app.delete('/shopping-lists/:id', async (req, res) => {
  try {
    await ShoppingList.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shopping list deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(3001, () => {
  console.log('Server läuft auf Port 3001');
});

