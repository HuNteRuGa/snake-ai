const generateAppleCoordinates = (snakeCoordinates) => {
  let newCoordinates;
  let match;
  do {
    // Generate new coordinates
    const x = Math.floor(Math.random() * MAP_SIZE[0]);
    const y = Math.floor(Math.random() * MAP_SIZE[1]);
    newCoordinates = [x, y];
    // Check if new coordinates match any of the original ones
    match = snakeCoordinates.some((coord) => coord[0] === x && coord[1] === y);
  } while (match);
  return newCoordinates;
}

const moveSnakeHead = {
  up: ([headX, headY]) => [headX, headY - 1],
  down: ([headX, headY]) => [headX, headY + 1],
  left: ([headX, headY]) => [headX - 1, headY],
  right: ([headX, headY]) => [headX + 1, headY],
};

const DIRECTIONS = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
  0: 'up',
  1: 'right',
  2: 'down',
  3: 'left',
};

const MAP_SIZE = [30, 30];

const SAVE_INTERVAL=30;

const MOVES_LIMIT = 2000;

const REWARDS = {
  eatFood: 10,
  moveToFood: 1,
  moveFromFood: -1,
  death: -100,
}


class Game {
  constructor() {
    this.snake = [[Math.round(MAP_SIZE[0] / 2), Math.round(MAP_SIZE[1] / 2)]];

    this.createFood();
  }

  createFood() {
    this.food = generateAppleCoordinates(this.snake);
  }

  move(direction) {
    if (typeof direction === 'number') direction = DIRECTIONS[direction];
    // console.log('direction', direction);

    this.prevDirection = direction;

    const headCoords = this.snake[0];
    const newHeadCoords = moveSnakeHead[direction](headCoords);

    const foodEaten = this.checkFoodCollision(newHeadCoords);

    if (foodEaten) {
      this.createFood();
    }

    this.snake = [newHeadCoords, ...this.snake];

    let snakeAlive = !this.checkSelfCollision();
    if (!snakeAlive) return { prevHeedPosition: headCoords, currentHeadPosition: newHeadCoords, foodEated: false, snakeAlive };
    snakeAlive = !this.checkMapCollision();

    if (!foodEaten) {
      this.snake = this.snake.slice(0, -1);
    }

    return { prevHeedPosition: headCoords, currentHeadPosition: newHeadCoords, foodEaten, snakeAlive }
  }

  checkFoodCollision(newHeadCoords) {
    return newHeadCoords[0] === this.food[0] && newHeadCoords[1] === this.food[1];
  }

  checkMapCollision() {
    if (this.snake[0][0] === -1) return true; 
    if (this.snake[0][0] === MAP_SIZE[0]) return true; 
    if (this.snake[0][1] === -1) return true; 
    if (this.snake[0][1] === MAP_SIZE[1]) return true; 
  }

  checkSelfCollision() {
    const [head, ...body] = this.snake;
    return body.some((coord) => coord[0] === head[0] && coord[1] === head[1]);
  }
}