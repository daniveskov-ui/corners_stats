const SIMULATIONS = 10000;


// simulate one portfolio outcome
function simulateOnce(bankroll, bets) {

  let br = bankroll;

  bets.forEach(bet => {

    const win = Math.random() < bet.probability;

    if (win)
      br += bet.stake * (bet.softOdds - 1);
    else
      br -= bet.stake;

  });

  return br;
}


// Monte Carlo simulation
function monteCarlo(bankroll, bets) {

  if (bets.length === 0) {

    return {
      expectedBankroll: bankroll,
      roi: 0,
      riskOfRuin: 0,
      maxDrawdown: 0
    };

  }

  let results = [];

  for (let i = 0; i < SIMULATIONS; i++) {
    results.push(simulateOnce(bankroll, bets));
  }


  // expected bankroll
  const avg =
    results.reduce((a,b)=>a+b,0) / results.length;


  // risk of ruin
  const ruined =
    results.filter(r => r < bankroll * 0.5).length;


  // max drawdown
  const worst =
    Math.min(...results);


  const drawdown =
    (bankroll - worst) / bankroll;


  const roi =
    ((avg - bankroll) / bankroll) * 100;


  return {

    expectedBankroll: avg,

    roi,

    riskOfRuin:
      (ruined / SIMULATIONS) * 100,

    maxDrawdown:
      drawdown * 100

  };

}


module.exports = {
  monteCarlo
};
