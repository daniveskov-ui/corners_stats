function calculateProbability(odds) {

  if (!odds || odds <= 1) return 0;

  const implied = 1 / odds;

  const modelEdge = 1.08;

  return implied * modelEdge;
}

module.exports = {
  calculateProbability
};
