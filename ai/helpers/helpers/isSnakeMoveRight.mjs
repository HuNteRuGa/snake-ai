export const isSnakeMoveRight = ({ prevHeedPosition, currentHeadPosition, foodPosition }) => {
  const diffX = currentHeadPosition[0] - prevHeedPosition[0];
  const diffY = currentHeadPosition[1] - prevHeedPosition[1];

  if (diffX === 0) {
    return (foodPosition[1] >= currentHeadPosition[1] && diffY === 1) || (foodPosition[1] <= currentHeadPosition[1] && diffY === -1);
  } else {
    return (foodPosition[0] >= currentHeadPosition[0] && diffX === 1) || (foodPosition[0] <= currentHeadPosition[0] && diffX === -1);
  }
}