export const moveSnakeHead = {
  up: ([headX, headY]) => [headX, headY - 1],
  down: ([headX, headY]) => [headX, headY + 1],
  left: ([headX, headY]) => [headX - 1, headY],
  right: ([headX, headY]) => [headX + 1, headY],
};
