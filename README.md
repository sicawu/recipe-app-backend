# Recipe App Backend

## Tech Stack
- Node.js / Express
- SQLite3
- UUID for IDs

## API Endpoints
- `GET /` - Health check
- `GET /recipes` - List all recipes
- `GET /recipes/:id` - Get recipe by ID
- `POST /recipes` - Create new recipe
- `PUT /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe

## Run
```bash
npm run dev
```

Server on http://localhost:3001

## DB Schema
Single `recipes` table with JSON fields for tags, ingredients, instructions.

## Note
DROP TABLE on startup for dev (remove in prod).
