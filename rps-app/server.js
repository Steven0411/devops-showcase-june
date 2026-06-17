const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  return choices[Math.floor(Math.random() * choices.length)];
}

function getResult(player, computer) {
  if (player === computer) return "Draw";

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "You win!";
  }

  return "You lose!";
}

app.get("/play", (req, res) => {
  const player = req.query.choice;
  const computer = getComputerChoice();

  if (!player) {
    return res.json({ error: "No choice provided" });
  }

  const result = getResult(player, computer);

  res.json({
    player,
    computer,
    result,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});