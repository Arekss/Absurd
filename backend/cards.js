const fs = require("fs");
const path = require("path");

// Load the cards data from cards.json
const cards = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db/defaultCards.json"), "utf8"),
);

// Function to get 10 random answers
function getRandomAnswers() {
  const shuffled = cards.answers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

module.exports = { getRandomAnswers };
