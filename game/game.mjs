import { generateAppleCoordinates } from "./helpers/generateAppleCoordinates.mjs";
import { MAP_SIZE } from "../settings.mjs";
import { DIRECTIONS } from "./consts.mjs";
import { moveSnakeHead } from "./helpers/moveSnakeHead.mjs";

export class Game {
  constructor() {
    this.snake = [[Math.round(MAP_SIZE[0] / 2), Math.round(MAP_SIZE[1] / 2)]];

    this.movesStory = [];
    this.foodStory = [];

    this.createFood();
  }

  createFood() {
    this.food = generateAppleCoordinates(this.snake, this.food ? undefined : [Math.round(MAP_SIZE[0] / 2)]);

    this.foodStory.push(JSON.parse(JSON.stringify(this.food)));
  }

  move(direction) {
    if (typeof direction === 'number') direction = DIRECTIONS[direction];
  
    this.movesStory.push(direction);

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