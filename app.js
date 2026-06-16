// Rock, Paper, Scissors Game
// Usage: open in browser with an HTML file, or run in Node.js via CLI

const CHOICES = ["rock", "paper", "scissors"];

const RULES = {
  rock:     { beats: "scissors", losesTo: "paper"    },
  paper:    { beats: "rock",     losesTo: "scissors" },
  scissors: { beats: "paper",    losesTo: "rock"      },
};

const score = { player: 0, computer: 0, draws: 0 };

function getComputerChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "draw";
  return RULES[playerChoice].beats === computerChoice ? "player" : "computer";
}

function playRound(playerChoice) {
  playerChoice = playerChoice.toLowerCase().trim();

  if (!CHOICES.includes(playerChoice)) {
    return {
      valid: false,
      message: `Invalid choice "${playerChoice}". Please choose rock, paper, or scissors.`,
    };
  }

  const computerChoice = getComputerChoice();
  const winner = determineWinner(playerChoice, computerChoice);

  let resultMessage;
  if (winner === "draw") {
    score.draws++;
    resultMessage = `It's a draw! You both chose ${playerChoice}.`;
  } else if (winner === "player") {
    score.player++;
    resultMessage = `You win! ${capitalise(playerChoice)} beats ${computerChoice}.`;
  } else {
    score.computer++;
    resultMessage = `You lose! ${capitalise(computerChoice)} beats ${playerChoice}.`;
  }

  return {
    valid: true,
    playerChoice,
    computerChoice,
    winner,
    message: resultMessage,
    score: { ...score },
  };
}

function resetScore() {
  score.player = 0;
  score.computer = 0;
  score.draws = 0;
}

function getScore() {
  return { ...score };
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Browser / DOM integration ---
// Attaches game to the page if the expected elements are present.

function initDOM() {
  const buttons   = document.querySelectorAll("[data-choice]");
  const resultEl  = document.getElementById("result");
  const scoreEl   = document.getElementById("score");
  const resetBtn  = document.getElementById("reset");

  if (!buttons.length) return; // no DOM — running in Node.js

  function updateScoreDisplay() {
    if (scoreEl) {
      const s = getScore();
      scoreEl.textContent = `You ${s.player} – ${s.computer} Computer  (${s.draws} draws)`;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const result = playRound(btn.dataset.choice);
      if (resultEl) resultEl.textContent = result.message;
      updateScoreDisplay();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetScore();
      if (resultEl) resultEl.textContent = "Game reset. Make your move!";
      updateScoreDisplay();
    });
  }

  updateScoreDisplay();
}

// --- Node.js CLI mode ---
// Run: node app.js rock   (or any choice as a CLI argument)

function runCLI() {
  const choice = process.argv[2];
  if (!choice) {
    console.log("Usage: node app.js <rock|paper|scissors>");
    return;
  }
  const result = playRound(choice);
  console.log(result.message);
  const s = result.score;
  console.log(`Score — You: ${s.player}  Computer: ${s.computer}  Draws: ${s.draws}`);
}

// Entry point detection
if (typeof window !== "undefined") {
  // Browser: wire up DOM after the page has loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDOM);
  } else {
    initDOM();
  }
} else if (typeof process !== "undefined" && process.argv) {
  // Node.js CLI
  runCLI();
}

// Named exports for use as a module (ES modules / bundlers)
if (typeof module !== "undefined") {
  module.exports = { playRound, resetScore, getScore, CHOICES };
}
