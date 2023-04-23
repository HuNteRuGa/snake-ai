import { fileURLToPath } from 'url';
import path, { resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import yargs from 'yargs/yargs';

const args = yargs(process.argv).argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!args.save) throw 'argument [save] not passed';
if (!args.generation) throw 'argument [generation] not passed';
const numberInGeneration = +args.numberInGeneration || 0;
const addStory = !!args.story;

const fileData = readFileSync(resolve(__dirname, 'ai', 'helpers', 'saves', `${args.save}.json`));
const saveData = JSON.parse(fileData);
const gen = saveData.find((v) => v.generation === args.generation);

if (!gen) {
  console.log(`Generation ${args.generation} not found`);
  process.exit();
}

const snake = gen.rating[numberInGeneration];

console.log(`Writting generation ${args.generation} to weights.js...`);

writeFileSync(
  resolve(__dirname, 'visualization', `weights.js`),
  `const weights = ${JSON.stringify(snake.weights, null, 2)};
${addStory ? `const movesStory = ${JSON.stringify(snake.movesStory, null, 2)};
const foodStory = ${JSON.stringify(snake.foodStory, null, 2)};` : ''}`);

console.log(`Success`);