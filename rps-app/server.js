"use strict";

/*
 * Rock · Paper · Scissors — backend.
 * Express API + MongoDB (Mongoose) for persistent scores and a leaderboard.
 * Serves the static frontend from /public.
 */

require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Data model -------------------------------------------------------------
const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual: total rounds and win rate (handy for the leaderboard).
playerSchema.virtual("rounds").get(function () {
  return this.wins + this.draws + this.losses;
});
playerSchema.set("toJSON", { virtuals: true });

const Player = mongoose.model("Player", playerSchema);

// --- Helpers ----------------------------------------------------------------
const cleanName = (n) => String(n || "").trim().slice(0, 24);

function leaderboardEntry(p) {
  const rounds = p.wins + p.draws + p.losses;
  const winRate = rounds ? p.wins / rounds : 0;
  return {
    name: p.name,
    wins: p.wins,
    draws: p.draws,
    losses: p.losses,
    rounds,
    winRate: Math.round(winRate * 100),
  };
}

// --- API --------------------------------------------------------------------

// Load a player's saved score (creates the record if new).
app.get("/api/score/:name", async (req, res) => {
  try {
    const name = cleanName(req.params.name);
    if (!name) return res.status(400).json({ error: "Name required" });
    const player = await Player.findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { new: true, upsert: true }
    );
    res.json(leaderboardEntry(player));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record a single round result. body: { name, result: "win"|"draw"|"loss" }
app.post("/api/round", async (req, res) => {
  try {
    const name = cleanName(req.body.name);
    const result = req.body.result;
    if (!name) return res.status(400).json({ error: "Name required" });
    const field = { win: "wins", draw: "draws", loss: "losses" }[result];
    if (!field) return res.status(400).json({ error: "Invalid result" });

    const player = await Player.findOneAndUpdate(
      { name },
      { $inc: { [field]: 1 }, $setOnInsert: { name } },
      { new: true, upsert: true }
    );
    res.json(leaderboardEntry(player));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset one player's score back to zero.
app.post("/api/reset", async (req, res) => {
  try {
    const name = cleanName(req.body.name);
    if (!name) return res.status(400).json({ error: "Name required" });
    const player = await Player.findOneAndUpdate(
      { name },
      { wins: 0, draws: 0, losses: 0 },
      { new: true, upsert: true }
    );
    res.json(leaderboardEntry(player));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ranked leaderboard: by win rate, then total wins. Only players who've played.
app.get("/api/leaderboard", async (req, res) => {
  try {
    const players = await Player.find({});
    const ranked = players
      .map(leaderboardEntry)
      .filter((p) => p.rounds > 0)
      .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins)
      .slice(0, 10);
    res.json(ranked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Boot -------------------------------------------------------------------
async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB:", MONGODB_URI);
  } catch (err) {
    console.error("✗ MongoDB connection failed:", err.message);
    console.error("  Make sure mongod is running (see README).");
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`✓ Server running → http://localhost:${PORT}`);
  });
}

if (require.main === module) start();

module.exports = { app, Player, leaderboardEntry };

// npm install prom-client express

const client = require("prom-client");

// Create a registry
const register = new client.Registry();

// Default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metric: request counter
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

register.registerMetric(httpRequestsTotal);

// Middleware to count requests
app.use((req, res, next) => {
  httpRequestsTotal.inc();
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
