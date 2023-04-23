export const regenerateRandomWeights = (weights) => {
  const weightsCopy = JSON.parse(JSON.stringify(weights));

  for (let i = 0; i < weightsCopy.length; i++) {
    for (let j = 0; j < weightsCopy[i].length; j++) {
      for (let k = 0; k < weightsCopy[i][j].length; k++) {
        let random = Math.random() * 0.1 - 0.05; // generate a random number between -0.05 and 0.05
        weightsCopy[i][j][k] += random; // add the random number to the current element
      }
    }
  }

  return weightsCopy;
}