const isSnakeMoveRight = ({ prevHeedPosition, currentHeadPosition, foodPosition }) => {
  const diffX = currentHeadPosition[0] - prevHeedPosition[0];
  const diffY = currentHeadPosition[1] - prevHeedPosition[1];

  if (diffX === 0) {
    return (foodPosition[1] >= currentHeadPosition[1] && diffY === 1) || (foodPosition[1] <= currentHeadPosition[1] && diffY === -1);
  } else {
    return (foodPosition[0] >= currentHeadPosition[0] && diffX === 1) || (foodPosition[0] <= currentHeadPosition[0] && diffX === -1);
  }
}

class AI {
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

  async playGame(game) {
    let isAlive = true;
    this.score = 0;
    console.log('STARTING GAME');

    for(let i = 0; i !== MOVES_LIMIT && isAlive; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));

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
        this.score += REWARDS.death * 2;
        break;
      }

      const { prevHeedPosition, currentHeadPosition, foodEaten, snakeAlive } = game.move(direction);

      if (foodEaten) this.score += REWARDS.eatFood;
      if (!snakeAlive) {
        console.log('SNAKE DEAD');
        this.score += REWARDS.death;
        break;
      }

      if (foodEaten || isSnakeMoveRight({ prevHeedPosition, currentHeadPosition, foodPosition: game.food })) {
        this.score += REWARDS.moveToFood;
      } else this.score += REWARDS.moveFromFood;

      const map = [];

      for (let y = 0; y !== MAP_SIZE[1]; y++) {
        const row = [];

        for (let x = 0; x !== MAP_SIZE[0]; x++) {
          if (game.food[0] === x && game.food[1] === y) {
            row.push('food');
          } else if (game.snake.some((v) => v[0] === x && v[1] === y)) {
            row.push('snake');
          } else {
            row.push('none');
          }
        }

        map.push(row);
      }

      draw(map);

      document.querySelector('.score').innerHTML = this.score;
    }

    document.querySelector('.score').innerHTML = this.score;

    return this.score;
  }

  async playHistory(game) {
    let isAlive = true;
    this.score = 0;
    console.log('STARTING GAME HISTORY');

    game.food = foodStory.shift();

    for(let i = 0; i !== MOVES_LIMIT && isAlive; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const direction = movesStory[i];

      if (direction >= 4 || direction < 0) {
        this.score += REWARDS.death * 2;
        break;
      }

      const { prevHeedPosition, currentHeadPosition, foodEaten, snakeAlive } = game.move(direction);

      if (foodEaten) {
        this.score += REWARDS.eatFood;
        game.food = foodStory.shift();
      }
      if (!snakeAlive) {
        console.log('SNAKE DEAD');
        this.score += REWARDS.death;
        break;
      }

      if (foodEaten || isSnakeMoveRight({ prevHeedPosition, currentHeadPosition, foodPosition: game.food })) {
        this.score += REWARDS.moveToFood;
      } else this.score += REWARDS.moveFromFood;

      const map = [];

      for (let y = 0; y !== MAP_SIZE[1]; y++) {
        const row = [];

        for (let x = 0; x !== MAP_SIZE[0]; x++) {
          if (game.food[0] === x && game.food[1] === y) {
            row.push('food');
          } else if (game.snake.some((v) => v[0] === x && v[1] === y)) {
            row.push('snake');
          } else {
            row.push('none');
          }
        }

        map.push(row);
      }

      draw(map);

      document.querySelector('.score').innerHTML = this.score;
    }

    document.querySelector('.score').innerHTML = this.score;

    return this.score;
  }
}