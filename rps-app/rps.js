#!/usr/bin/env node
"use strict";

/*
 * Rock · Paper · Scissors — You vs. an adaptive bot.
 *
 * The bot starts out essentially random, but it watches everything you do and
 * gets progressively better:
 *   1. It learns which move you favour overall (frequency model).
 *   2. It learns your habits — e.g. "after Rock, you tend to play Scissors"
 *      (1st- and 2nd-order Markov / pattern models).
 *   3. As rounds go by, its "skill" rises: early on it mostly guesses,
 *      later on it trusts its predictions and counters them hard.
 *
 * Run:  node rps.js
 */

const readline = require("readline");

const MOVES = ["rock", "paper", "scissors"];
const EMOJI = { rock: "🪨", paper: "📄", scissors: "💥" };
// What beats what:  beats[x] is the move that DEFEATS x.
const BEATS = { rock: "paper", paper: "scissors", scissors: "rock" };
// What x defeats:
const LOSES_TO = { rock: "scissors", paper: "rock", scissors: "paper" };

// ---------------------------------------------------------------------------
// The adaptive bot
// ---------------------------------------------------------------------------
class AdaptiveBot {
  constructor() {
    this.history = []; // every player move, in order
    this.freq = { rock: 0, paper: 0, scissors: 0 }; // overall counts
    this.order1 = {}; // last move -> { next move: count }
    this.order2 = {}; // last two moves -> { next move: count }
    this.round = 0;
  }

  // How much the bot "trusts" its prediction this round, 0..1.
  // Ramps up with experience so it visibly gets tougher.
  skill() {
    // 0 at round 0, approaches ~0.95 as rounds climb.
    return Math.min(0.95, this.round / (this.round + 6));
  }

  // Best-guess of the player's NEXT move, plus a confidence 0..1.
  predict() {
    const n = this.history.length;
    if (n === 0) return null;

    const last1 = this.history[n - 1];
    const last2 = n >= 2 ? this.history[n - 2] + "," + last1 : null;

    // Prefer the most specific model that has enough data.
    const fromTable = (table, key) => {
      const row = key != null ? table[key] : null;
      if (!row) return null;
      let best = null,
        total = 0,
        bestCount = 0;
      for (const m of MOVES) {
        const c = row[m] || 0;
        total += c;
        if (c > bestCount) {
          bestCount = c;
          best = m;
        }
      }
      if (total < 2 || !best) return null;
      return { move: best, confidence: bestCount / total };
    };

    return (
      fromTable(this.order2, last2) ||
      fromTable(this.order1, last1) ||
      this._fromFreq()
    );
  }

  _fromFreq() {
    let best = null,
      total = 0,
      bestCount = -1;
    for (const m of MOVES) {
      total += this.freq[m];
      if (this.freq[m] > bestCount) {
        bestCount = this.freq[m];
        best = m;
      }
    }
    if (total < 2) return null;
    return { move: best, confidence: bestCount / total };
  }

  // Choose the bot's move for this round.
  chooseMove() {
    const prediction = this.predict();
    const skill = this.skill();

    // No useful read, or the dice say "play it loose this round".
    if (!prediction || Math.random() > skill * prediction.confidence) {
      return MOVES[Math.floor(Math.random() * 3)];
    }
    // Counter the move we expect the player to throw.
    return BEATS[prediction.move];
  }

  // Feed the actual player move back in so the bot learns.
  learn(playerMove) {
    const h = this.history;
    if (h.length >= 1) {
      const k1 = h[h.length - 1];
      (this.order1[k1] ||= { rock: 0, paper: 0, scissors: 0 })[playerMove]++;
    }
    if (h.length >= 2) {
      const k2 = h[h.length - 2] + "," + h[h.length - 1];
      (this.order2[k2] ||= { rock: 0, paper: 0, scissors: 0 })[playerMove]++;
    }
    this.freq[playerMove]++;
    h.push(playerMove);
    this.round++;
  }
}

// ---------------------------------------------------------------------------
// Game rules
// ---------------------------------------------------------------------------
function judge(player, bot) {
  if (player === bot) return "tie";
  return BEATS[player] === bot ? "lose" : "win"; // did bot play the counter?
}

function skillLabel(skill) {
  if (skill < 0.25) return "Warming up";
  if (skill < 0.5) return "Learning";
  if (skill < 0.7) return "Sharpening";
  if (skill < 0.85) return "Locked in";
  return "Mind reader";
}

// ---------------------------------------------------------------------------
// CLI loop
// ---------------------------------------------------------------------------
function main() {
  const bot = new AdaptiveBot();
  const score = { win: 0, lose: 0, tie: 0 };
  let round = 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n=== Rock · Paper · Scissors ===");
  console.log("You vs. a bot that learns your patterns and gets tougher.\n");
  console.log("Type: rock / paper / scissors  (or r / p / s)");
  console.log("Commands: 'stats' to see the score, 'quit' to stop.\n");

  const parse = (raw) => {
    const t = raw.trim().toLowerCase();
    if (["r", "rock"].includes(t)) return "rock";
    if (["p", "paper"].includes(t)) return "paper";
    if (["s", "scissors"].includes(t)) return "scissors";
    return null;
  };

  const showStats = () => {
    const total = score.win + score.lose + score.tie;
    console.log(
      `\n  Score after ${total} round(s) — You: ${score.win}  Bot: ${score.lose}  Ties: ${score.tie}`
    );
    if (total > 0) {
      const wr = ((score.win / total) * 100).toFixed(0);
      console.log(`  Your win rate: ${wr}%  |  Bot skill: ${skillLabel(bot.skill())}\n`);
    } else {
      console.log("");
    }
  };

  const farewell = () => {
    console.log("\n--- Final tally ---");
    showStats();
    const verdict =
      score.win > score.lose
        ? "You beat the bot. Impressive — it doesn't lose often. 🏆"
        : score.win < score.lose
        ? "The bot read you like a book. Better luck next time. 🤖"
        : "Dead even. A worthy duel. 🤝";
    console.log(verdict + "\n");
    rl.close();
  };

  const prompt = () => {
    rl.question(`Round ${round + 1} — your move: `, (raw) => {
      const cmd = raw.trim().toLowerCase();
      if (["quit", "q", "exit"].includes(cmd)) return farewell();
      if (cmd === "stats") {
        showStats();
        return prompt();
      }

      const player = parse(raw);
      if (!player) {
        console.log("  ? Didn't catch that. Use rock/paper/scissors (r/p/s), 'stats' or 'quit'.\n");
        return prompt();
      }

      // Bot decides BEFORE learning this move (no cheating).
      const botMove = bot.chooseMove();
      bot.learn(player);
      const result = judge(player, botMove);
      score[result]++;
      round++;

      const line = `  You ${EMOJI[player]} ${player}   vs   Bot ${EMOJI[botMove]} ${botMove}  →  `;
      console.log(
        line +
          (result === "win" ? "You win! ✅" : result === "lose" ? "Bot wins. ❌" : "Tie. 🔁")
      );
      prompt();
    });
  };

  rl.on("close", () => process.exit(0));
  prompt();
}

module.exports = { AdaptiveBot, judge, MOVES, BEATS };

if (require.main === module) main();
