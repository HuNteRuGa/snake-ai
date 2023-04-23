import { MAP_SIZE, MOVES_LIMIT, REWARDS } from "../../settings.mjs";
import { isSnakeMoveRight } from "./helpers/isSnakeMoveRight.mjs";

export class AI {
  constructor(weights) {
    this.layers = weights;
  }

  getResult(input) {
    const aiResponse = this.layers.reduce((prevNodes, layer) => {
      return layer.map((node) => {
        return node.reduce((acc, v, i) => acc + (v * prevNodes[i]), 0)
      });
    }, input);

    return aiResponse;
  }

  playGame(game) {
    let isAlive = true;
    let score = 0;

    for(let i = 0; i !== MOVES_LIMIT && isAlive; i++) {
      const snakeHead = game.snake[0];
      const food = game.food;
      const snakeTail = game.snake.slice(0, -1);
  
      const aiResult = this.getResult([
        food[1] < snakeHead[1] ? 1 : 0,
        food[0] > snakeHead[0] ? 1 : 0,
        food[1] > snakeHead[1] ? 1 : 0,
        food[0] < snakeHead[0] ? 1 : 0,
        (snakeHead[1] === 1 || snakeTail.some((tail) => tail[1] === snakeHead[1] - 1)) ? 1 : 0,
        (snakeHead[0] === MAP_SIZE[0] - 1 || snakeTail.some((tail) => tail[0] === snakeHead[0] + 1)) ? 1 : 0,
        (snakeHead[1] === MAP_SIZE[1] - 1 || snakeTail.some((tail) => tail[1] === snakeHead[1] + 1)) ? 1 : 0,
        (snakeHead[0] === 1 || snakeTail.some((tail) => tail[0] === snakeHead[0] - 1)) ? 1 : 0,
        game.prevDirection === 'up' ? 1 : 0,
        game.prevDirection === 'right' ? 1 : 0,
        game.prevDirection === 'down' ? 1 : 0,
        game.prevDirection === 'left' ? 1 : 0,
      ]);

      const direction = Math.floor(aiResult);
      // console.log({ direction, aiResult });

      if (direction >= 4 || direction < 0) {
        score -= 200;
        return score;
      }

      const { prevHeedPosition, currentHeadPosition, foodEaten, snakeAlive } = game.move(direction);

      if (!snakeAlive) {
        score += REWARDS.death;
        return score;
      }
      
      if (foodEaten) score += REWARDS.eatFood;
      if (foodEaten || isSnakeMoveRight({ prevHeedPosition, currentHeadPosition, foodPosition: game.food })) {
        score += REWARDS.moveToFood;
      } else score += REWARDS.moveFromFood;
    }

    score += REWARDS.death;
    return score;
  }
}