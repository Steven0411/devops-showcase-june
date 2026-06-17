# Rock · Paper · Scissors (with MongoDB)

Play Rock Paper Scissors against a bot that learns your patterns and gets
progressively better. Scores are saved per player in **MongoDB**, and there's a
ranked **leaderboard**.

## What's in here

| File | Purpose |
|------|---------|
| `server.js` | Express API + MongoDB connection, serves the web app |
| `public/index.html` | The browser game (UI + adaptive bot + leaderboard) |
| `rps.js` | Bonus: the original terminal version (`npm run cli`) |
| `package.json` | Dependencies and scripts |
| `.env.example` | Config template — copy to `.env` |

## Prerequisites

- **Node.js** 18+ (for `node --watch`; any 16+ works for `npm start`)
- **MongoDB Community Server** running locally

### Install & run MongoDB locally

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community   # runs mongod in the background
```

**Windows:** install MongoDB Community Server from mongodb.com; it runs as a
service automatically. Or run `mongod` manually.

**Check it's up:** MongoDB listens on `mongodb://127.0.0.1:27017` by default.

## Run the app

```bash
# 1. install dependencies
npm install

# 2. set up config
cp .env.example .env      # (Windows: copy .env.example .env)

# 3. start the server
npm start                 # or: npm run dev  (auto-reload on save)
```

## Run the app using docker
# From the devops-showcase directory run the following command
```bash
# run the app and database images from the docker compose file
docker compose up -d
```

Then open **http://localhost:3000** in your browser.

> Running from VS Code: open this folder, then use the integrated terminal for
> the commands above. (You no longer need Live Server — `server.js` serves the
> page itself.)

## How scores persist

1. Enter a player name and start playing.
2. After every round the result is POSTed to `/api/round` and stored in the
   `players` collection.
3. Reload the page — your totals are fetched back from MongoDB.
4. The leaderboard ranks players by win rate (then total wins).

## API reference

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/score/:name` | Load (or create) a player's score |
| `POST` | `/api/round` | Body `{ name, result: "win"\|"draw"\|"loss" }` — record a round |
| `POST` | `/api/reset` | Body `{ name }` — reset a player's score to 0 |
| `GET` | `/api/leaderboard` | Top 10 players by win rate |

## Inspect the data

```bash
mongosh
use rps
db.players.find().pretty()
```
