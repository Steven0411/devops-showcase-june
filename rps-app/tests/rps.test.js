const { AdaptiveBot, judge, MOVES, BEATS } = require("../rps");

describe("Game Logic", () => {
  test("judge correctly identifies win", () => {
    expect(judge("rock", "scissors")).toBe("win");
    expect(judge("paper", "rock")).toBe("win");
    expect(judge("scissors", "paper")).toBe("win");
  });

  test("judge correctly identifies loss", () => {
    expect(judge("rock", "paper")).toBe("lose");
  });

  test("judge correctly identifies tie", () => {
    expect(judge("rock", "rock")).toBe("tie");
  });

  test("MOVES contains all three options", () => {
    expect(MOVES.length).toBe(3);
    expect(MOVES).toContain("rock");
  });

  test("BEATS defines counters correctly", () => {
    expect(BEATS.rock).toBe("paper");
  });
});

describe("AdaptiveBot", () => {
  test("initializes correctly", () => {
    const bot = new AdaptiveBot();
    expect(bot.round).toBe(0);
  });

  test("chooseMove returns a valid move", () => {
    const bot = new AdaptiveBot();
    const move = bot.chooseMove();
    expect(MOVES).toContain(move);
  });

  test("learn updates round count", () => {
    const bot = new AdaptiveBot();
    bot.learn("rock");
    expect(bot.round).toBe(1);
  });

  test("bot skill increases with rounds", () => {
    const bot = new AdaptiveBot();
    const skill0 = bot.skill();
    bot.round = 50;
    const skill50 = bot.skill();
    expect(skill50).toBeGreaterThan(skill0);
  });
});
