import { MAP_SIZE } from "../../settings.mjs";

export const generateAppleCoordinates = (snakeCoordinates, disableX) => {
  let newCoordinates;
  let match;
  do {
    // Generate new coordinates
    const x = Math.floor(Math.random() * MAP_SIZE[0]);
    const y = Math.floor(Math.random() * MAP_SIZE[1]);
    newCoordinates = [x, y];
    // Check if new coordinates match any of the original ones
    match = snakeCoordinates.some((coord) => coord[0] === x && coord[1] === y) || x === disableX;
  } while (match);
  return newCoordinates;
}