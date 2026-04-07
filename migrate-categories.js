const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/recipeapp');

const Recipe = require('./models/Recipe');

const categoryMap = {
  'Dairy': 'Dairy & Eggs',
  'Meat': 'Meat & Fish',
  // Add other mappings if needed
};

async function migrate() {
  try {
    const recipes = await Recipe.find({});
    console.log(`Processing ${recipes.length} recipes...`);

    let updated = 0;
    for (const recipe of recipes) {
      let changed = false;

      // Migrate ingredients
      recipe.ingredients = recipe.ingredients.map(ing => {
        if (categoryMap[ing.category]) {
          console.log(`Migrated ingredient category in ${recipe.name}: ${ing.category} → ${categoryMap[ing.category]}`);
          ing.category = categoryMap[ing.category];
          changed = true;
        }
        return ing;
      });

      // Migrate dressing
      recipe.dressing = recipe.dressing.map(ing => {
        if (categoryMap[ing.category]) {
          console.log(`Migrated dressing category in ${recipe.name}: ${ing.category} → ${categoryMap[ing.category]}`);
          ing.category = categoryMap[ing.category];
          changed = true;
        }
        return ing;
      });

      if (changed) {
        await recipe.save();
        updated++;
      }
    }

    console.log(`Migration complete. Updated ${updated} recipes.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrate();

