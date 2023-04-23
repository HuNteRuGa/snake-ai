import { fileURLToPath } from 'url';
import path from 'path';
import { writeFileSync, readFileSync } from 'fs';
import yargs from 'yargs/yargs';
import { resolve } from 'path';
import { AI } from "./ai/helpers/ai.mjs";
import { generateRandomWeights } from "./ai/helpers/helpers/generateRandomWeights.mjs";
import { regenerateRandomWeights } from "./ai/helpers/helpers/regenerateRandomWeights.mjs";
import { Game } from "./game/game.mjs";
import { FILTER_IN_GENERATION, GENERATIONS_COUNT, MULTIPLE_BY_GENERATION, SAVE_NAME, START_COUNT } from "./settings.mjs";

const args = yargs(process.argv).argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generationsTop = [];
let prevGenerationTop = [];

let startGenerationNumber = 0;
if (!args.save) {
  for (let i = 0; i < START_COUNT; i++) {
    const game = new Game();
    const ai = new AI(generateRandomWeights());
    const score = ai.playGame(game);
    prevGenerationTop.push({ score, weights: JSON.parse(JSON.stringify(ai.layers)) });
  }
  
  prevGenerationTop = prevGenerationTop.sort((a, b) => b.score - a.score).slice(0, FILTER_IN_GENERATION);
} else {
  const fileData = readFileSync(resolve(__dirname, 'ai', 'helpers', 'saves', `${args.save}.json`));
  const saveData = JSON.parse(fileData);
  const lastGen = saveData[saveData.length - 1].rating;
  startGenerationNumber = saveData[saveData.length - 1].generation + 1;

  prevGenerationTop = lastGen;
}

console.log('START GENERATION', prevGenerationTop.map((v) => v.score));

for (let j = startGenerationNumber; j !== GENERATIONS_COUNT; j++) {
  const generation = prevGenerationTop.reduce((acc, v) => {
    const newWeights = [];
    for (let k = 0; k !== MULTIPLE_BY_GENERATION; k++) {
      newWeights.push(regenerateRandomWeights(v.weights));
    }

    return [...acc, ...newWeights];
  }, [...prevGenerationTop.map((v) => v.weights)]);

  const generationResults = generation.map((weights) => {
    const game = new Game();
    const ai = new AI(weights);
    const score = ai.playGame(game);
    const foodEaten = game.snake.length - 1;
    return { score, foodEaten, movesStory: game.movesStory, foodStory: game.foodStory, weights: JSON.parse(JSON.stringify(ai.layers)) };
  });

  prevGenerationTop = generationResults.sort((a, b) => b.score - a.score).slice(0, 10);
  generationsTop.push({ generation: j, rating: prevGenerationTop });

  console.log(`TOP GENERATION #${j} SCORE: ${prevGenerationTop[0].score}, FOOD EATEN: ${prevGenerationTop[0].foodEaten}`);

  if (j % SAVE_INTERVAL === 0) {
    writeFileSync(resolve(__dirname, 'ai', 'helpers', 'saves', `${SAVE_NAME}.json`), JSON.stringify(generationsTop, null, 2));
  }
}
