const game = new Game();
const ai = new AI(weights);
if (movesStory && foodStory) {
  ai.playHistory(game);
} else {
  ai.playGame(game);
}